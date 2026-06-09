import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch } from 'firebase/firestore';

// Pulls the Google Form responses sheet and adds any NEW respondents to the invitees
// collection. Add-only and idempotent: existing invitees (matched by email) are skipped,
// so this is safe to call repeatedly (manual dashboard button + scheduled cron).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Public "form responses" sheet (CSV export). Not a secret.
const SHEET_ID = '1h_ihbHwh1om08zvaD9ucYq-1mG9J4mlM7MCzQqU51jk';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

const firebaseConfig = {
  apiKey: 'AIzaSyAm3GrtCxIrK6fU-K6TgVx46yamlFlV9Pc',
  authDomain: 'oblivion-3c64c.firebaseapp.com',
  projectId: 'oblivion-3c64c',
  storageBucket: 'oblivion-3c64c.firebasestorage.app',
  messagingSenderId: '669343480639',
  appId: '1:669343480639:web:3962f1d1a4f36c4c25f18a',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DRIVE_ID_RE = /[?&]id=([^&]+)/;

// Column indices in the form responses sheet:
// 0 Timestamp | 1 Email Address | 2 Full Name | 3 Email ID | 4 Food Pref | 5 Current Era Pic | 6 Bachpan Pic
const COL = { emailA: 1, name: 2, emailB: 3, currentEraPic: 5 };

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function getDb() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

export async function POST() {
  // 1. Fetch the sheet CSV
  let csv: string;
  try {
    const res = await fetch(CSV_URL, { redirect: 'follow' });
    const ct = res.headers.get('content-type') || '';
    csv = await res.text();
    if (!res.ok || !ct.includes('csv')) {
      return NextResponse.json({ ok: false, error: 'Could not read the form sheet (is it still link-shared?)' }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to fetch the form sheet' }, { status: 502 });
  }

  // 2. Build candidate invitees from rows
  const rows = parseCSV(csv).slice(1);
  const candidates = new Map<string, { name: string; email: string; photoUrl: string }>();
  for (const r of rows) {
    if (r.length <= COL.currentEraPic) continue;
    const email = ((r[COL.emailA] || '').trim() || (r[COL.emailB] || '').trim()).toLowerCase();
    if (!EMAIL_RE.test(email)) continue;
    const name = (r[COL.name] || '').trim();
    const m = (r[COL.currentEraPic] || '').match(DRIVE_ID_RE);
    const photoUrl = m ? `https://lh3.googleusercontent.com/d/${m[1]}=w800` : '/fp/skull.webp';
    if (!candidates.has(email)) candidates.set(email, { name, email, photoUrl });
  }

  // 3. Diff against existing invitees (by email) and add only the new ones
  try {
    const db = getDb();
    const snap = await getDocs(collection(db, 'invitees'));
    const existing = new Set<string>();
    snap.forEach((d) => {
      const e = (d.data().email || '').toLowerCase();
      if (e) existing.add(e);
    });

    const toAdd = Array.from(candidates.values()).filter((c) => !existing.has(c.email));
    for (let i = 0; i < toAdd.length; i += 400) {
      const batch = writeBatch(db);
      for (const inv of toAdd.slice(i, i + 400)) {
        batch.set(doc(collection(db, 'invitees')), { ...inv, attending: null, timestamp: Date.now() });
      }
      await batch.commit();
    }

    return NextResponse.json({
      ok: true,
      added: toAdd.length,
      skipped: candidates.size - toAdd.length,
      totalInvitees: existing.size + toAdd.length,
      addedNames: toAdd.map((c) => c.name).slice(0, 50),
    });
  } catch (err) {
    console.error('sync-form error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: 'Sync failed while writing to the database' }, { status: 502 });
  }
}
