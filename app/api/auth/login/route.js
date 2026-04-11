import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  const { password } = await request.json();
  const expected = String(process.env.ADMIN_PASSWORD ?? '').trim();
  const submitted = typeof password === 'string' ? password.trim() : '';

  if (!expected) {
    return NextResponse.json(
      { success: false, error: 'Admin password not configured' },
      { status: 500 }
    );
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[admin-login] dev check:', {
      env_password_configured: true,
      submitted_length: submitted.length,
      expected_length: expected.length,
    });
  }

  if (submitted === expected) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
