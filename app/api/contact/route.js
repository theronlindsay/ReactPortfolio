import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const METHODS = new Set(['email', 'phone', 'text', 'other']);

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function envTrim(key) {
  const v = process.env[key];
  return v == null ? '' : String(v).trim();
}

export async function POST(request) {
  const destination = envTrim('DESTINATION_EMAIL');
  const oauthUser = envTrim('EMAIL_OAUTH_USER');
  const clientId = envTrim('GOOGLE_OAUTH_CLIENT_ID');
  const clientSecret = envTrim('GOOGLE_OAUTH_CLIENT_SECRET');
  const refreshToken = envTrim('GOOGLE_OAUTH_REFRESH_TOKEN');

  if (process.env.NODE_ENV === 'development') {
    console.log('[contact] dev — OAuth mail env (server terminal):', {
      DESTINATION_EMAIL: destination ?? '(missing)',
      EMAIL_OAUTH_USER: oauthUser ?? '(missing)',
      GOOGLE_OAUTH_CLIENT_ID: clientId ?? '(missing)',
      GOOGLE_OAUTH_CLIENT_SECRET:
        clientSecret == null ? '(missing)' : `(set, length ${clientSecret.length})`,
      GOOGLE_OAUTH_REFRESH_TOKEN:
        refreshToken == null ? '(missing)' : `(set, length ${refreshToken.length})`,
    });
  }

  if (!destination || !oauthUser || !clientId || !clientSecret || !refreshToken) {
    return NextResponse.json(
      { success: false, error: 'Email delivery is not configured on the server.' },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { contactMethod, contactDetail = '', otherDetail = '', messageHtml = '' } = body;

  if (!contactMethod || !METHODS.has(contactMethod)) {
    return NextResponse.json(
      { success: false, error: 'Invalid or missing contact method.' },
      { status: 400 }
    );
  }

  if (contactMethod === 'other') {
    if (typeof otherDetail !== 'string' || !otherDetail.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please describe how you want to be contacted.' },
        { status: 400 }
      );
    }
  } else {
    if (typeof contactDetail !== 'string' || !contactDetail.trim()) {
      return NextResponse.json(
        { success: false, error: 'Contact details are required for the selected method.' },
        { status: 400 }
      );
    }
    if (contactMethod === 'email') {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(contactDetail.trim())) {
        return NextResponse.json({ success: false, error: 'Invalid email address.' }, { status: 400 });
      }
    }
  }

  if (typeof messageHtml !== 'string') {
    return NextResponse.json({ success: false, error: 'Invalid message.' }, { status: 400 });
  }

  const safeMessage =
    messageHtml.length > 200_000 ? messageHtml.slice(0, 200_000) : messageHtml;

  const contactLine =
    contactMethod === 'other' ? otherDetail.trim() : contactDetail.trim();

  const subject = `[Portfolio] Contact — ${contactMethod}`;
  const textBody = [
    `Method: ${contactMethod}`,
    `Reach at: ${contactLine}`,
    '',
    'Message (HTML also attached):',
    safeMessage.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
  ].join('\n');

  const htmlBody = `
    <h2 style="font-family:system-ui,sans-serif;">New portfolio contact</h2>
    <p style="font-family:system-ui,sans-serif;"><strong>Method:</strong> ${escapeHtml(contactMethod)}</p>
    <p style="font-family:system-ui,sans-serif;"><strong>Contact:</strong> ${escapeHtml(contactLine)}</p>
    <hr style="border:none;border-top:1px solid #ccc;margin:1.5rem 0;" />
    <div style="font-family:system-ui,sans-serif;">${safeMessage}</div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: oauthUser,
        clientId,
        clientSecret,
        refreshToken,
      },
    });

    await transporter.sendMail({
      from: oauthUser,
      to: destination,
      replyTo: contactMethod === 'email' ? contactDetail.trim() : undefined,
      subject,
      text: textBody,
      html: htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] send failed:', err?.message || err);
    if (process.env.NODE_ENV === 'development') {
      console.error('[contact] dev — full error:', err);
    }
    return NextResponse.json(
      { success: false, error: 'Failed to send email. Try again later.' },
      { status: 502 }
    );
  }
}
