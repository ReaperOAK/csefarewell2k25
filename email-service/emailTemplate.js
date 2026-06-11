/**
 * Personalized IBIZA 2k26 farewell invite email.
 * All CSS is inline + table-based for broad email-client compatibility (Gmail strips <style>).
 *
 * Portrait handling:
 *   - Real submitted photos are Google-Drive `lh3.googleusercontent.com/d/<id>=...` URLs.
 *     We force them to `=w400-h400-c` so the image is a small (~370KB) square crop that
 *     fills the circular frame instead of a multi-MB full-size PNG.
 *   - Everyone without a real photo (the `/fp/skull.webp` default, empty, or any
 *     non-absolute path) gets an initials monogram rendered in pure HTML — a relative
 *     path can never resolve inside an inbox, so this avoids a broken-image icon.
 */

const AMBER = '#e86a24';
const AMBER_SOFT = 'rgba(232,106,36,0.35)';
const CREAM = '#f8f3eb';
const CREAM_DIM = 'rgba(248,243,235,0.7)';
const CREAM_FAINT = 'rgba(248,243,235,0.4)';
const INK = '#0a0a0c';
const HAIRLINE = 'rgba(248,243,235,0.12)';

// Event facts — keep in sync with the on-site invitation card.
const EVENT = {
  date: '16th June 2026',
  time: '2:00 PM onwards',
  venue: 'STCET',
  theme: 'Beach Rave Party',
};

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// A real portrait is an absolute Google-hosted image; anything else (relative skull
// default, blank) is treated as "no photo" so we fall back to a monogram.
function resolvePortrait(photoUrl) {
  if (typeof photoUrl !== 'string') return null;
  const drive = photoUrl.match(/lh3\.googleusercontent\.com\/d\/([^=/?#]+)/);
  if (drive) return `https://lh3.googleusercontent.com/d/${drive[1]}=w400-h400-c`;
  const gid = photoUrl.match(/drive\.google\.com\/.*[?&]id=([^&]+)/);
  if (gid) return `https://lh3.googleusercontent.com/d/${gid[1]}=w400-h400-c`;
  return null; // relative paths, skull default, etc. -> monogram
}

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'IB';
  const first = parts[0][0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/**
 * @param {{ name: string, inviteLink: string, photoUrl?: string }} data
 * @returns {{ subject: string, html: string, text: string }}
 */
export function buildInviteEmail({ name, inviteLink, photoUrl }) {
  const safeName = escapeHtml(name || 'friend');
  const safeLink = escapeHtml(inviteLink);
  const portraitSrc = resolvePortrait(photoUrl);

  // Circular portrait — real photo, or an initials monogram that needs no external asset.
  const portrait = portraitSrc
    ? `<img src="${escapeHtml(portraitSrc)}" width="120" height="120" alt="${safeName}"
            style="display:block;width:120px;height:120px;border-radius:50%;object-fit:cover;border:2px solid ${AMBER};box-shadow:0 0 36px ${AMBER_SOFT};background-color:#1a1208;" />`
    : `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="120" height="120"
              style="width:120px;height:120px;border-radius:50%;border:2px solid ${AMBER};box-shadow:0 0 36px ${AMBER_SOFT};background-color:#1a1208;">
         <tr><td align="center" valign="middle"
                 style="font-family:Arial,Helvetica,sans-serif;font-size:42px;font-weight:700;letter-spacing:0.04em;color:${AMBER};">
           ${escapeHtml(initials(name))}
         </td></tr>
       </table>`;

  const subject = `${name || 'You'} — your IBIZA farewell invitation`;

  const text = [
    `IBIZA — CSE Farewell 2k26`,
    ``,
    `Hi ${name || 'there'},`,
    ``,
    `One last tide, one last song, one last night with your name in it.`,
    `Your personalized invitation is ready.`,
    ``,
    `When:  ${EVENT.date} · ${EVENT.time}`,
    `Where: ${EVENT.venue}`,
    `Theme: ${EVENT.theme}`,
    ``,
    `Open it here: ${inviteLink}`,
    ``,
    `See you under the amber lights.`,
    `— CSE Juniors`,
  ].join('\n');

  // Reusable cell styles
  const labelStyle = `font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${AMBER};padding-bottom:4px;`;
  const valueStyle = `font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.3;color:${CREAM};`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark only" />
  <meta name="supported-color-schemes" content="dark" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:${INK};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">One last tide, one last song, one last night with your name in it — your IBIZA invitation is inside.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${INK};background-image:radial-gradient(circle at 50% -10%, rgba(232,106,36,0.16), transparent 55%);">
    <tr>
      <td align="center" style="padding:34px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;max-width:560px;background-color:#0d0d10;background-image:linear-gradient(180deg, rgba(248,243,235,0.04), rgba(248,243,235,0.015));border:1px solid ${HAIRLINE};border-radius:18px;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:40px 36px 0;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:0.34em;text-transform:uppercase;color:${AMBER};">Final summer signal</div>
              <div style="height:14px;line-height:14px;">&nbsp;</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:52px;line-height:1;font-weight:700;letter-spacing:0.05em;color:${CREAM};">IBIZA</div>
              <div style="height:8px;line-height:8px;">&nbsp;</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.28em;text-transform:uppercase;color:${CREAM_FAINT};">CSE Farewell · 2k26</div>
            </td>
          </tr>

          <!-- Portrait -->
          <tr>
            <td align="center" style="padding:34px 36px 0;">${portrait}</td>
          </tr>

          <!-- Personal line -->
          <tr>
            <td align="center" style="padding:26px 40px 0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:23px;line-height:1.4;color:${CREAM};">
              Hi ${safeName}, one last tide,<br/>one last song, one last night with your name in it.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:18px 44px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${CREAM_DIM};">
              The CSE juniors are throwing one final night for you. Here is where it lands — your personalized invitation and RSVP are one tap away.
            </td>
          </tr>

          <!-- Details ticket -->
          <tr>
            <td style="padding:28px 36px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${HAIRLINE};border-radius:14px;background-color:rgba(232,106,36,0.05);">
                <tr>
                  <td width="50%" style="padding:20px 22px;border-right:1px solid ${HAIRLINE};border-bottom:1px solid ${HAIRLINE};">
                    <div style="${labelStyle}">When</div>
                    <div style="${valueStyle}">${EVENT.date}<br/><span style="color:${CREAM_DIM};font-size:13px;">${EVENT.time}</span></div>
                  </td>
                  <td width="50%" style="padding:20px 22px;border-bottom:1px solid ${HAIRLINE};">
                    <div style="${labelStyle}">Where</div>
                    <div style="${valueStyle}">${EVENT.venue}</div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:18px 22px;">
                    <div style="${labelStyle}">Theme</div>
                    <div style="${valueStyle}">${EVENT.theme}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:30px 36px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="${AMBER}" style="border-radius:999px;">
                    <a href="${safeLink}" target="_blank"
                       style="display:inline-block;padding:16px 42px;border-radius:999px;background:${AMBER};color:${INK};font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;text-decoration:none;">
                      Open your invitation
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:16px 40px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${CREAM_FAINT};word-break:break-all;">
              or paste this link:<br/>
              <a href="${safeLink}" target="_blank" style="color:rgba(232,106,36,0.85);text-decoration:none;">${safeLink}</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:34px 40px 40px;">
              <div style="border-top:1px solid ${HAIRLINE};line-height:1px;font-size:1px;">&nbsp;</div>
              <div style="padding-top:24px;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:14px;color:rgba(248,243,235,0.55);">See you under the amber lights.</div>
              <div style="padding-top:10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;color:rgba(248,243,235,0.3);">IBIZA · CSE FAREWELL 2k26</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}
