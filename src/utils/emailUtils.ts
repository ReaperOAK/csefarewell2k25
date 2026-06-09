import { Invitee } from '../types';

// The browser calls our same-origin Next.js route (/api/send-invite), which holds the
// email-service token server-side and forwards to the openclaw email-service (Gmail SMTP).
// No secret is ever exposed to the client.
const SEND_INVITE_ENDPOINT = '/api/send-invite';

/**
 * Always true on the client — configuration lives server-side in the API route.
 * (The route returns 503 if the backend env vars are missing.)
 */
export const isEmailConfigured = (): boolean => true;

/**
 * Check if an email is valid and not empty.
 */
export const isValidEmail = (email: string | undefined | null): boolean => {
  if (!email || email.trim() === '') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Send a single invitation email via the backend.
 * The invite link is derived server-side from the invitee id (we never send a URL).
 */
export const sendInvitationEmail = async (invitee: Invitee): Promise<void> => {
  if (!isValidEmail(invitee.email)) {
    throw new Error('Invitee does not have a valid email address');
  }

  const res = await fetch(SEND_INVITE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: invitee.id,
      name: invitee.name,
      email: invitee.email,
      photoUrl: invitee.photoUrl,
    }),
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) detail = data.error;
    } catch {
      /* ignore non-JSON error bodies */
    }
    throw new Error(`Failed to send email: ${detail}`);
  }
};

/**
 * Send invitation emails to multiple invitees, in small batches, with a progress callback.
 */
export const sendBulkInvitationEmails = async (
  invitees: Invitee[],
  onProgress?: (sent: number) => void,
): Promise<void> => {
  const inviteesWithEmail = invitees.filter((invitee) => isValidEmail(invitee.email));
  if (inviteesWithEmail.length === 0) {
    console.warn('No invitees with valid email addresses found');
    return;
  }

  const batchSize = 3;
  const totalBatches = Math.ceil(inviteesWithEmail.length / batchSize);
  let totalSent = 0;

  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const startIndex = batchIndex * batchSize;
    const currentBatch = inviteesWithEmail.slice(startIndex, startIndex + batchSize);

    const batchResults = await Promise.all(currentBatch.map((invitee) => sendEmailAndCatchError(invitee)));
    totalSent += batchResults.filter(Boolean).length;
    onProgress?.(totalSent);

    // brief pause between batches to stay gentle on Gmail
    if (batchIndex < totalBatches - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
};

async function sendEmailAndCatchError(invitee: Invitee): Promise<boolean> {
  try {
    await sendInvitationEmail(invitee);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${invitee.name}:`, error);
    return false;
  }
}

/**
 * Send a test email to verify the backend + Gmail config.
 * Callable from the admin Email Template Test tool.
 */
export const testEmailSend = async (testEmail: string = 'test@example.com'): Promise<void> => {
  const res = await fetch(SEND_INVITE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 'test-id',
      name: 'Test User',
      email: testEmail,
    }),
  });
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) detail = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(`Test email failed: ${detail}`);
  }
};
