/**
 * Personalized IBIZA 2k26 farewell invite email.
 * All CSS is inline + table-based for broad email-client compatibility (Gmail strips <style>).
 */

const AMBER = '#e86a24';
const CREAM = '#f8f3eb';
const INK = '#0a0a0c';

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * @param {{ name: string, inviteLink: string, photoUrl?: string }} data
 * @returns {{ subject: string, html: string, text: string }}
 */
export function buildInviteEmail({ name, inviteLink, photoUrl }) {
  const safeName = escapeHtml(name || 'friend');
  const safeLink = escapeHtml(inviteLink);
  const portrait = photoUrl
    ? `<tr><td align="center" style="padding:0 0 28px;">
         <img src="${escapeHtml(photoUrl)}" width="116" height="116" alt="${safeName}"
              style="width:116px;height:116px;border-radius:50%;object-fit:cover;border:2px solid ${AMBER};box-shadow:0 0 32px rgba(232,106,36,0.35);" />
       </td></tr>`
    : '';

  const subject = `${name || 'You'} — your IBIZA farewell invitation`;

  const text = [
    `IBIZA — Farewell 2k26`,
    ``,
    `Hi ${name || 'there'},`,
    ``,
    `One last tide, one last song, one last night with your name in it.`,
    `Your personalized invitation is ready.`,
    ``,
    `Open it here: ${inviteLink}`,
    ``,
    `See you under the amber lights.`,
    `— CSE Juniors`,
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:${INK};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">One last tide, one last song, one last night with your name in it.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${INK};background-image:radial-gradient(circle at 50% 0%, rgba(232,106,36,0.14), transparent 60%);padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:rgba(248,243,235,0.03);border:1px solid rgba(248,243,235,0.12);border-radius:16px;padding:40px 32px;">
          <tr>
            <td align="center" style="padding-bottom:8px;font-family:'Georgia',serif;font-size:12px;letter-spacing:0.32em;text-transform:uppercase;color:${AMBER};">
              Final summer signal
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:24px;font-family:Arial,Helvetica,sans-serif;font-size:46px;line-height:1;font-weight:700;letter-spacing:0.04em;color:${CREAM};">
              IBIZA
            </td>
          </tr>
          ${portrait}
          <tr>
            <td align="center" style="padding-bottom:18px;font-family:'Georgia',serif;font-style:italic;font-size:22px;line-height:1.35;color:${CREAM};">
              Hi ${safeName}, one last tide, one last song,<br/>one last night with your name in it.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:30px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:rgba(248,243,235,0.7);">
              The CSE juniors are throwing one final night for you. Your personalized invitation — and your RSVP — are waiting behind the door below.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:8px;">
              <a href="${safeLink}" target="_blank"
                 style="display:inline-block;padding:15px 38px;border-radius:999px;background:${AMBER};color:${INK};font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;text-decoration:none;">
                Open your invitation
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:14px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:rgba(248,243,235,0.4);word-break:break-all;">
              or paste this link:<br/>
              <a href="${safeLink}" target="_blank" style="color:rgba(232,106,36,0.85);text-decoration:none;">${safeLink}</a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:34px;border-top:1px solid rgba(248,243,235,0.1);font-family:'Georgia',serif;font-style:italic;font-size:13px;color:rgba(248,243,235,0.5);">
              See you under the amber lights.
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td align="center" style="padding-top:18px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:rgba(248,243,235,0.3);">
              IBIZA · CSE Farewell 2k26
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
