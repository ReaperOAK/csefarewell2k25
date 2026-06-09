import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Runs on the Vercel server (NOT the browser). Holds the email-service bearer token
// in a server-only env var and forwards to the openclaw email-service.
//
// Security: the recipient is NOT taken from the request body. We look the invitee up
// by id in Firestore and use the STORED email/name/photo. So even though this endpoint
// has no admin session (the app's admin auth is a client-side password), it can only
// ever (re)send to people already on the invite list — never arbitrary recipients.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_API_URL = (process.env.EMAIL_API_URL || '').replace(/\/$/, '');
const EMAIL_API_TOKEN = process.env.EMAIL_API_TOKEN || '';

// Public Firebase web config (same as src/firebase.ts — safe to ship; client SDK keys).
const firebaseConfig = {
  apiKey: 'AIzaSyAm3GrtCxIrK6fU-K6TgVx46yamlFlV9Pc',
  authDomain: 'oblivion-3c64c.firebaseapp.com',
  projectId: 'oblivion-3c64c',
  storageBucket: 'oblivion-3c64c.firebasestorage.app',
  messagingSenderId: '669343480639',
  appId: '1:669343480639:web:3962f1d1a4f36c4c25f18a',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getDb() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

export async function POST(req: NextRequest) {
  if (!EMAIL_API_URL || !EMAIL_API_TOKEN) {
    return NextResponse.json({ ok: false, error: 'Email service not configured' }, { status: 503 });
  }

  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const id = body?.id;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ ok: false, error: 'invitee id required' }, { status: 400 });
  }

  // Look up the canonical invitee record; only registered invitees can be emailed.
  let invitee: { name?: string; email?: string; photoUrl?: string };
  try {
    const snap = await getDoc(doc(getDb(), 'invitees', id));
    if (!snap.exists()) {
      return NextResponse.json({ ok: false, error: 'Invitee not found' }, { status: 404 });
    }
    invitee = snap.data() as typeof invitee;
  } catch (err) {
    console.error('invitee lookup failed:', err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: 'Could not look up invitee' }, { status: 502 });
  }

  if (!invitee.email || !EMAIL_RE.test(invitee.email)) {
    return NextResponse.json({ ok: false, error: 'Invitee has no valid email on file' }, { status: 422 });
  }

  try {
    const upstream = await fetch(`${EMAIL_API_URL}/send-invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${EMAIL_API_TOKEN}`,
      },
      // Recipient fields come from Firestore, not the client. The invite link is derived
      // server-side in the email-service from its trusted SITE_BASE_URL.
      body: JSON.stringify({ id, name: invitee.name, email: invitee.email, photoUrl: invitee.photoUrl }),
    });

    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    console.error('send-invite proxy error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: 'Failed to reach email service' }, { status: 502 });
  }
}
