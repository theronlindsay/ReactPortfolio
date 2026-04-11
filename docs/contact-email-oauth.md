# Contact form: Gmail + OAuth 2

The `/api/contact` route sends mail through **Gmail** using **OAuth 2** (no app passwords).

## 1. Google Cloud project

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project.
3. **APIs & Services → Library** → enable **Gmail API**.

## 2. OAuth consent screen

1. **APIs & Services → OAuth consent screen**.
2. Choose **External** (unless you use Google Workspace and prefer Internal).
3. Fill app name, user support email, developer contact.
4. On **Scopes**, add **Manually** and include:
  - `https://mail.google.com/`
  - (Required for Gmail SMTP with XOAUTH2.)
5. If the app stays in **Testing**, add your Gmail address under **Test users**.

## 3. OAuth client credentials

**Recommended:** **Desktop app** — works with the Playground without configuring redirect URIs.

1. **APIs & Services → Credentials → Create credentials → OAuth client ID**.
2. Application type: **Desktop app**.
3. Copy the **Client ID** and **Client secret**.

Put them in `.env.local`:

- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`

**If you use “Web application” instead:** you **must** add the Playground redirect URI (see step 4) or you will get `**redirect_uri_mismatch`**.

## 4. Refresh token (OAuth 2.0 Playground)

1. Open [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
2. **If your OAuth client is type “Web application”:**
  - Google Cloud → **Credentials** → open that OAuth 2.0 Client ID.  
  - Under **Authorized redirect URIs**, click **Add URI** and paste **exactly** (no trailing slash, `https` only):  
  `**https://developers.google.com/oauthplayground`**  
  - **Save**. Wait a minute for changes to apply, then continue.
3. Click the **gear** (OAuth 2.0 configuration).
4. Check **Use your own OAuth credentials** and paste **Client ID** and **Client secret** (must match the client you just edited).
5. In the left list, find **Gmail API v1** and select scope `**https://mail.google.com/`** (or add it manually under “Input your own scopes”).
6. Click **Authorize APIs** and sign in with the **same Google account** that will send mail.
7. Click **Exchange authorization code for tokens**.
8. Copy the **Refresh token** into `.env.local` as `GOOGLE_OAUTH_REFRESH_TOKEN`.

## 5. App environment variables


| Variable                     | Purpose                                                         |
| ---------------------------- | --------------------------------------------------------------- |
| `DESTINATION_EMAIL`          | Address that receives contact form messages.                    |
| `EMAIL_OAUTH_USER`           | The Gmail address that sends mail (the account you authorized). |
| `GOOGLE_OAUTH_CLIENT_ID`     | OAuth client ID from step 3.                                    |
| `GOOGLE_OAUTH_CLIENT_SECRET` | OAuth client secret from step 3.                                |
| `GOOGLE_OAUTH_REFRESH_TOKEN` | Refresh token from step 4.                                      |


Restart the dev server after changing `.env.local`.

## 6. Production notes

- Move the app to **Production** on the OAuth consent screen when you are ready for any Google user to authorize (if you need that); for a single mailbox, **Testing** + test users is often enough.
- Store secrets in the host’s env (e.g. Vercel **Environment Variables**), not in the repo.
- The refresh token can be revoked in [Google Account → Security → Third-party access](https://myaccount.google.com/permissions).

## Troubleshooting

- `**invalid_grant`**: Refresh token revoked or wrong client; repeat step 4.
- `**redirect_uri_mismatch` (Error 400) when authorizing in the Playground:** Your OAuth client is **Web application** and does not list the Playground redirect. Add **exactly**  
`https://developers.google.com/oauthplayground`  
under **Authorized redirect URIs** for that client, **Save**, try again. **Or** create a new **Desktop app** OAuth client and use it in the Playground (no redirect URI needed).
- `**unauthorized_client` / `EAUTH` / `AUTH XOAUTH2`**: Google rejected the client when exchanging the refresh token. Fix is almost always **credentials mismatch** or **wrong OAuth client type**:
  1. `**GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET` must be from the exact same row** in [Credentials](https://console.cloud.google.com/apis/credentials) as the OAuth client you used in the Playground (gear → “Use your own OAuth credentials”). If you created a second client or rotated the secret, get a **new refresh token** after updating `.env.local`.
  2. **Refresh token is tied to that client ID.** A token from Playground + Client A will **never** work with Client B’s ID/secret in the app.
  3. If the OAuth client type is **Web application**, add this **Authorized redirect URI** (exactly):
    `https://developers.google.com/oauthplayground`  
     Then authorize again in the Playground and exchange for a new refresh token.  
     Easiest path: create a **Desktop app** client instead and use that ID/secret in the Playground—no redirect URI setup.
  4. Copy/paste: no extra quotes inside the value, no spaces at the ends of lines (the app trims whitespace, but avoid broken multi-line secrets).
- **Access blocked / app not verified**: Add your account as a **Test user** while in Testing, or complete verification for production.
- `**Email delivery is not configured`**: One of the five env vars is missing or empty on the server.