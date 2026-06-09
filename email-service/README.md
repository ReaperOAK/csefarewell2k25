# IBIZA email service

Tiny Node service that sends personalized farewell-invite emails via **your Gmail (SMTP)**.
Runs on the `openclaw` server and is exposed to the Vercel frontend via **Tailscale Funnel**.

The admin dashboard's "send invite" button → `POST /send-invite` here → Gmail sends the email.

## Endpoints

- `GET /health` → `{ ok: true }`
- `POST /send-invite` — header `Authorization: Bearer <EMAIL_API_TOKEN>`, JSON body:
  ```json
  { "id": "<firestore-invitee-id>", "name": "Archisman", "email": "a@x.com", "photoUrl": "https://..." }
  ```
  Builds the invite link `${SITE_BASE_URL}/invitation/<id>` (or pass `inviteLink` explicitly).

## One-time setup on openclaw

```bash
# 1. Gmail app password: enable 2-Step Verification on the Gmail account, then
#    create one at https://myaccount.google.com/apppasswords

# 2. On the server:
cd ~/ibiza-email-service          # wherever this folder is deployed
cp .env.example .env              # then edit .env with real values
npm ci --omit=dev                 # or: npm install --omit=dev

# 3. Run under pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 logs ibiza-email

# 4. Expose publicly over HTTPS (no DNS/cert work needed)
tailscale funnel --bg 8080        # prints a https://<host>.ts.net URL
tailscale funnel status           # shows the public URL
```

In the Vercel project env (server-only, NOT `NEXT_PUBLIC_`), set:
- `EMAIL_API_URL` = that `https://<host>.ts.net` URL
- `EMAIL_API_TOKEN` = the same token as in this `.env`

The browser calls the Vercel route `/api/send-invite`, which forwards here with the token —
the token is never exposed to the client.

## Gmail limits

A free Gmail account sends ~500 messages/day (Workspace ~2000). The built-in rate limit
(60/min) keeps you well under per-minute throttling. For a farewell guest list this is plenty.
