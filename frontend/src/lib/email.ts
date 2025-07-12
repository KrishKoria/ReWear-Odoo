import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendEmail = async (options: EmailOptions) => {
  try {
    const transporter = createTransporter();

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"ReWear" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text,
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

// Email templates
export const createVerificationEmailTemplate = (
  url: string,
  userName: string,
  userEmail: string
) => {
  return {
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          .logo { font-size: 24px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ReWear</div>
            <h1>Welcome to ReWear!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>Thank you for joining ReWear - the community-driven clothing exchange platform!</p>
            <p>To complete your account setup and start your sustainable fashion journey, please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
              <a href="${url}" class="button">Verify Email Address</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e9e9e9; padding: 10px; border-radius: 5px;">${url}</p>
            <p>This link will expire in 1 hour for security purposes.</p>
            <p>If you didn't create an account with ReWear, please ignore this email.</p>
            <p>Happy swapping!</p>
            <p>The ReWear Team</p>
          </div>
          <div class="footer">
            <p>© 2025 ReWear. All rights reserved.</p>
            <p>This email was sent to ${userEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to ReWear!

Hello ${userName}!

Thank you for joining ReWear - the community-driven clothing exchange platform!

To complete your account setup and start your sustainable fashion journey, please verify your email address by clicking the link below:

${url}

This link will expire in 1 hour for security purposes.

If you didn't create an account with ReWear, please ignore this email.

Happy swapping!
The ReWear Team

© 2025 ReWear. All rights reserved.
This email was sent to ${userEmail}
    `,
  };
};

export const createPasswordResetEmailTemplate = (
  url: string,
  userName: string,
  userEmail: string
) => {
  return {
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #e53e3e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          .logo { font-size: 24px; font-weight: bold; }
          .warning { background: #fed7d7; border: 1px solid #feb2b2; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ReWear</div>
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>We received a request to reset your password for your ReWear account.</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account is still secure.
            </div>
            <p>To reset your password, click the button below:</p>
            <p style="text-align: center;">
              <a href="${url}" class="button">Reset Password</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e9e9e9; padding: 10px; border-radius: 5px;">${url}</p>
            <p>This link will expire in 1 hour for security purposes.</p>
            <p>If you need help or have questions, please contact our support team.</p>
            <p>Stay secure!</p>
            <p>The ReWear Team</p>
          </div>
          <div class="footer">
            <p>© 2025 ReWear. All rights reserved.</p>
            <p>This email was sent to ${userEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
ReWear - Password Reset Request

Hello ${userName}!

We received a request to reset your password for your ReWear account.

⚠️ Security Notice: If you didn't request this password reset, please ignore this email. Your account is still secure.

To reset your password, click the link below:

${url}

This link will expire in 1 hour for security purposes.

If you need help or have questions, please contact our support team.

Stay secure!
The ReWear Team

© 2025 ReWear. All rights reserved.
This email was sent to ${userEmail}
    `,
  };
};
