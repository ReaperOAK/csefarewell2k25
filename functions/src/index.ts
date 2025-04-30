import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

// Initialize Firebase Admin
admin.initializeApp();

// Create email transporter using Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: functions.config().gmail?.email || 'owaimine1@gmail.com',
      pass: functions.config().gmail?.password || 'oa786ak92',
    },
  });
};

// This function will be triggered when a new document is added to the emailQueue collection
export const processEmailQueue = functions.firestore
  .document('emailQueue/{emailId}')
  .onCreate(async (snapshot: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    const emailData = snapshot.data();
    
    if (!emailData) {
      console.error('No email data found in the document');
      return null;
    }
    
    try {
      // Update status to processing
      await snapshot.ref.update({
        status: 'processing',
        processingStartTime: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      // Format the invitation email
      const emailContent = await formatEmail(emailData);
      
      // Send the email
      const transporter = createTransporter();
      
      const mailOptions = {
        from: `"OBLIVION 2025" <owaimine1@gmail.com>`,
        to: emailData.to,
        subject: emailData.subject,
        html: emailContent,
      };
      
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      
      // Update status to sent
      await snapshot.ref.update({
        status: 'sent',
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        messageId: info.messageId,
      });
      
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('Error sending email:', error);
      
      // Update status to error
      await snapshot.ref.update({
        status: 'error',
        error: error.message,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      return { success: false, error: error.message };
    }
  });

// Function to format email content
async function formatEmail(emailData: any): Promise<string> {
  // You can customize this template based on your needs
  const { dynamicData } = emailData;
  
  // Simple HTML template for the invitation
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${emailData.subject}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #000000;
          border: 1px solid #333;
          color: #e0e0e0;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #d4af37;
          color: #d4af37;
        }
        .content {
          padding: 20px 0;
        }
        .invitation-image {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          display: block;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          margin: 20px 0;
          background-color: #d4af37;
          color: #000 !important;
          text-decoration: none;
          font-weight: bold;
          border-radius: 4px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>OBLIVION 2025</h1>
          <h2>CSE Farewell</h2>
        </div>
        <div class="content">
          <p>Dear ${dynamicData.inviteeName},</p>
          <p>You are cordially invited to OBLIVION 2025 - The CSE Department Farewell Ceremony.</p>
          
          ${dynamicData.customMessage ? `<p>${dynamicData.customMessage}</p>` : ''}
          
          <p>Please use the link below to RSVP and view your personalized invitation:</p>
          
          <div style="text-align: center;">
            <a href="${dynamicData.invitationLink}" class="button">View Your Invitation</a>
          </div>
          
          <p>We look forward to celebrating this special occasion with you.</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}