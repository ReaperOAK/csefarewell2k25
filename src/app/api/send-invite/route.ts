import { NextRequest, NextResponse } from 'next/server';

// Runs on the Vercel server (NOT the browser). Holds the email-service bearer token
// in a server-only env var and forwards the request to the openclaw email-service.
// This keeps the token out of the client bundle.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_API_URL = (process.env.EMAIL_API_URL || '').replace(/\/$/, '');
const EMAIL_API_TOKEN = process.env.EMAIL_API_TOKEN || '';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  if (!EMAIL_API_URL || !EMAIL_API_TOKEN) {
    return NextResponse.json({ ok: false, error: 'Email service not configured' }, { status: 503 });
  }

  let body: { id?: string; name?: string; email?: string; photoUrl?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { id, name, email, photoUrl } = body || {};
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ ok: false, error: 'invitee id required' }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'Valid recipient email required' }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${EMAIL_API_URL}/send-invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${EMAIL_API_TOKEN}`,
      },
      // Only forward the fields the email-service needs; the invite link is derived
      // server-side there from its trusted SITE_BASE_URL.
      body: JSON.stringify({ id, name, email, photoUrl }),
    });

    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    console.error('send-invite proxy error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: 'Failed to reach email service' }, { status: 502 });
  }
}
