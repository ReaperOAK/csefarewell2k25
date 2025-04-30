import Handlebars from 'handlebars';

/**
 * This module helps format the HTML template for EmailJS
 * It converts your handlebars template into a format EmailJS can use
 */

// The EmailJS template variable names that should be used
export const EMAILJS_VARIABLES = {
  TO_NAME: 'to_name',
  TO_EMAIL: 'to_email',
  PHOTO_URL: 'photo_url',
  INVITATION_LINK: 'invitation_link',
  CUSTOM_MESSAGE: 'custom_message'
};

/**
 * Parse HTML template and prepare it for EmailJS
 * This function compiles your Handlebars template with the given data
 * 
 * @param templateParams The parameters to use in the template
 * @returns The compiled HTML string
 */
export const compileEmailTemplate = (templateParams: Record<string, string>): string => {
  try {
    // Load the HTML template as a string
    // Note: In browser environment, this won't work directly
    // You should bundle the template or load it via AJAX
    
    // For browser-compatible version, you'd need to:
    // 1. Either import the template as a string during build
    // 2. Or fetch it via AJAX when needed
    
    // This is just a conceptual example:
    const templateHtml = ''; // This would be your template HTML as a string
    
    // Compile the template with Handlebars
    const template = Handlebars.compile(templateHtml);
    
    // Apply the parameters to the template
    return template(templateParams);
  } catch (error) {
    console.error('Error compiling email template:', error);
    return '';
  }
};

/**
 * Format parameters for EmailJS
 * Ensures parameter names match what EmailJS expects
 * 
 * @param params Your original parameter object
 * @returns Object formatted for EmailJS
 */
export const formatEmailJSParams = (params: Record<string, any>): Record<string, any> => {
  // Create a new object with the properly formatted keys
  return {
    [EMAILJS_VARIABLES.TO_NAME]: params.name || '',
    [EMAILJS_VARIABLES.TO_EMAIL]: params.email || '',
    [EMAILJS_VARIABLES.PHOTO_URL]: params.photoUrl || '',
    [EMAILJS_VARIABLES.INVITATION_LINK]: params.invitationLink || '',
    [EMAILJS_VARIABLES.CUSTOM_MESSAGE]: params.customMessage || '',
    // Add any other template variables that EmailJS needs
  };
};