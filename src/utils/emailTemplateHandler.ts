import { Invitee } from '../types';

/**
 * Creates EmailJS template parameters from an invitee object
 * Formats the parameters to match the expected EmailJS template format:
 * {
 *   email: "...",
 *   name: "...",
 *   link: "..."
 * }
 * 
 * @param invitee The invitee to create parameters for
 * @param customMessage Optional custom message to include
 * @returns Object with all parameters needed for EmailJS
 */
export const createEmailParams = (invitee: Invitee, customMessage?: string): Record<string, string> => {
  // Create a complete invitation link with the full URL
  const invitationLink = `${window.location.origin}/invitation/${invitee.id}`;
  
  // Create the template parameters object with all required fields
  return {
    email: invitee.email || '',
    name: invitee.name,
    link: invitationLink,
  };
};

/**
 * Helper function to validate an email template against expected variables
 * This helps ensure the template works with our expected parameters
 */
export const validateTemplate = async (): Promise<boolean> => {
  try {
    // Create a mock invitee that matches the Invitee interface
    const mockInvitee: Invitee = {
      id: 'test-id',
      name: 'Test User',
      email: 'test@example.com',
      photoUrl: '/fp/default.png',
      attending: null
    };
    
    // Create template parameters
    const params = createEmailParams(mockInvitee, 'Test message');
    
    // Log the parameters for debugging
    console.log('Template validation parameters:', params);
    
    // Check if all required parameters are present
    const requiredParams = ['email', 'name', 'link'];
    
    const missingParams = requiredParams.filter(param => !params[param]);
    
    if (missingParams.length > 0) {
      console.error('Missing required template parameters:', missingParams);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating template:', error);
    return false;
  }
};