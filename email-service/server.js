import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { buildInviteEmail } from './emailTemplate.js';

const {
  GMAIL_USER,
  GMAIL_APP_PASSWORD,
  EMAIL_API_TOKEN,
  ALLOWED_ORIGINS = '',
  SITE_BASE_URL = 'https://ibiza.vercel.app/',
  FROM_NAME = 'IBIZA — Farewell 2k26',
  PORT = 8080,
} = process.env;

// Fail fast on missing required secrets.
for (const [k, v] of Object.entries({ GMAIL_USER, GMAIL_APP_PASSWORD, EMAIL_API_TOKEN })) {
  if (!v) {
    console.error(`[fatal] Missing required env var: ${k}. See .env.example.`);
    process.exit(1);
  }
}

const allowList = ALLOWED_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
});

const app = express();
app.set('trust proxy', 1); // behind Tailscale Funnel
app.use(express.json({ limit: '64kb' }));
app.use(
  cors({
    origin(origin, cb) {
      // allow same-origin / curl (no origin) and any explicitly allow-listed origin
      if (!origin || allowList.length === 0 || allowList.includes(origin)) return cb(null, true);
      return cb(new Error('Origin not allowed'));
    },
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 60, // 60 sends/min/IP — comfortably under Gmail's limits while allowing bursts
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

function requireAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token || token !== EMAIL_API_TOKEN) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  next();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.get('/health', (_req, res) => res.json({ ok: true, service: 'ibiza-email', time: new Date().toISOString() }));

app.post('/send-invite', requireAuth, async (req, res) => {
  const { id, name, email, photoUrl } = req.body || {};

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: 'Valid recipient email required' });
  }
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ ok: false, error: 'invitee id required' });
  }
  // Invite link is ALWAYS derived server-side from the trusted SITE_BASE_URL — never
  // accept a client-supplied URL (prevents injecting phishing links into emails sent from this Gmail).
  const link = `${SITE_BASE_URL.replace(/\/$/, '')}/invitation/${encodeURIComponent(id)}`;

  try {
    const { subject, html, text } = buildInviteEmail({ name, inviteLink: link, photoUrl });
    const info = await transporter.sendMail({
      from: `"${FROM_NAME}" <${GMAIL_USER}>`,
      to: email,
      subject,
      html,
      text,
    });
    console.log(`[sent] ${email} (${name || 'no-name'}) id=${info.messageId}`);
    return res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error(`[error] send to ${email}:`, err?.message || err);
    return res.status(502).json({ ok: false, error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`IBIZA email service listening on :${PORT}`);
  console.log(`  from: ${GMAIL_USER}  | site: ${SITE_BASE_URL}`);
  console.log(`  CORS allow-list: ${allowList.length ? allowList.join(', ') : '(any origin)'}`);
});
