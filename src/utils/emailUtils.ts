import emailjs from '@emailjs/browser';
import { Invitee } from '../types';

// Configuration for EmailJS
const EMAILJS_SERVICE_ID = 'ReaperOAK';
const EMAILJS_TEMPLATE_ID = 'ReaperOAK';
const EMAILJS_PUBLIC_KEY = 'wsCefJMospSDh5hqJ';

/**
 * Check if an email is valid and not empty
 * @param email The email address to check
 * @returns boolean indicating if the email is valid
 */
export const isValidEmail = (email: string | undefined | null): boolean => {
  if (!email || email.trim() === '') {
    return false;
  }
  
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Send an invitation email to a single invitee
 * @param invitee The invitee object containing email and other details
 * @param customMessage Optional custom message to include in the email
 * @returns Promise that resolves when the email is sent
 */
export const sendInvitationEmail = async (
  invitee: Invitee,
  customMessage?: string
): Promise<void> => {
  if (!isValidEmail(invitee.email)) {
    throw new Error('Invitee does not have a valid email address');
  }

  try {
    // Initialize EmailJS with your public key
    emailjs.init(EMAILJS_PUBLIC_KEY);
    
    
    // Create a complete invitation link with the full URL
    const invitationLink = `${window.location.origin}/invitation/${invitee.id}`;
    
    // Create template parameters matching the expected format
    const templateParams = {
      email: invitee.email,
      name: invitee.name,
      link: invitationLink,
    };
    
    // Log the template parameters for debugging
    console.log('Sending email to:', invitee.email);
    console.log('With template parameters:', templateParams);
    
    // Send the email using EmailJS with the simplified format
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID, 
      EMAILJS_TEMPLATE_ID, 
      templateParams
    );
    
    console.log(`Email sent successfully to ${invitee.name}`, response);
  } catch (error: unknown) {
    console.error('Error sending email:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to send email: ${error.message}`);
    } else {
      throw new Error('Failed to send email: Unknown error occurred');
    }
  }
};

/**
 * Send invitation emails to multiple invitees with a progress callback
 * @param invitees Array of invitees to send emails to
 * @param onProgress Callback function to track progress (receives number of emails sent so far)
 * @returns Promise that resolves when all emails are sent
 */
export const sendBulkInvitationEmails = async (
  invitees: Invitee[],
  onProgress?: (sent: number) => void
): Promise<void> => {
  // Filter invitees to only include those with valid email addresses
  const inviteesWithEmail = invitees.filter(invitee => isValidEmail(invitee.email));
  
  if (inviteesWithEmail.length === 0) {
    console.warn('No invitees with valid email addresses found');
    return;
  }
  
  // Define batch size for processing (to avoid rate limits)
  const batchSize = 3;
  
  // Calculate total number of batches
  const totalBatches = Math.ceil(inviteesWithEmail.length / batchSize);
  
  // Track total emails sent
  let totalSent = 0;
  
  // Process each batch sequentially
  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    // Calculate start and end indices for this batch
    const startIndex = batchIndex * batchSize;
    const endIndex = Math.min(startIndex + batchSize, inviteesWithEmail.length);
    
    // Get the current batch of invitees
    const currentBatch = inviteesWithEmail.slice(startIndex, endIndex);
    
    // Process this batch and get the number of successfully sent emails
    const batchResults = await Promise.all(
      currentBatch.map(invitee => 
        sendEmailAndCatchError(invitee)
      )
    );
    
    // Count successful emails in this batch
    const batchSent = batchResults.filter(result => result).length;
    
    // Update total sent count
    totalSent += batchSent;
    
    // Call progress callback if provided
    if (onProgress) {
      onProgress(totalSent);
    }
    
    // Add a small delay between batches to prevent rate limiting
    if (batchIndex < totalBatches - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

/**
 * Helper function to send an email and catch any errors
 * @param invitee The invitee to send an email to
 * @returns Promise that resolves to true if successful, false if failed
 */
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
 * Test function to verify EmailJS configuration
 * This can be called directly from the browser console for debugging
 */
export const testEmailSend = async (testEmail: string = "test@example.com"): Promise<void> => {
  try {
    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);
    
    // Create simple test parameters using the exact format from the request
    const testParams = {
      email: testEmail,
      name: "Test User",
      link: `${window.location.origin}/invitation/test-id`
    };
    
    console.log('Testing EmailJS with parameters:', testParams);
    
    // Send test email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID, 
      EMAILJS_TEMPLATE_ID, 
      testParams
    );
    
    console.log('Test email sent successfully:', response);
  } catch (error) {
    console.error('Test email failed:', error);
    // Add more detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
  }
};