"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEmailQueue = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const nodemailer = __importStar(require("nodemailer"));
// Initialize Firebase Admin
admin.initializeApp();
// Create email transporter using Gmail
const createTransporter = () => {
    var _a, _b;
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: ((_a = functions.config().gmail) === null || _a === void 0 ? void 0 : _a.email) || 'owaimine1@gmail.com',
            pass: ((_b = functions.config().gmail) === null || _b === void 0 ? void 0 : _b.password) || 'oa786ak92',
        },
    });
};
// This function will be triggered when a new document is added to the emailQueue collection
exports.processEmailQueue = functions.firestore
    .document('emailQueue/{emailId}')
    .onCreate(async (snapshot, context) => {
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
    }
    catch (error) {
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
async function formatEmail(emailData) {
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
//# sourceMappingURL=index.js.map