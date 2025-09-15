import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import React from 'react';

interface EmailPayload {
  to: string;
  subject: string;
  html?: string;
  react?: React.ReactElement;
  text?: string;
}

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = `Boxmoc <noreply@${process.env.RESEND_DOMAIN || 'example.com'}>`;

async function sendWithResend(payload: EmailPayload) {
  if (!resendApiKey) {
    throw new Error('Resend API key is not configured.');
  }
  const resend = new Resend(resendApiKey);

  const { to, subject, html, react, text } = payload;
  
  if (!react && !html && !text) {
      throw new Error("Email content is missing. Provide 'react', 'html', or 'text'.");
  }

  const emailHtml = react ? render(react) : html;

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    html: emailHtml as string,
    text,
  });

  if (error) {
    console.error('Resend Error:', error);
    throw new Error(`Failed to send email with Resend: ${error.message}`);
  }

  return data;
}

async function sendWithNodemailer(payload: EmailPayload) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP transport is not fully configured.');
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: parseInt(SMTP_PORT, 10) === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const { to, subject, html, react, text } = payload;
  const emailHtml = react ? render(react) : html;

  const info = await transporter.sendMail({
    from: fromEmail,
    to,
    subject,
    html: emailHtml,
    text,
  });

  return info;
}


async function sendWithSES(payload: EmailPayload) {
    // Placeholder for AWS SES integration
    // To implement:
    // 1. Add `@aws-sdk/client-ses` package.
    // 2. Configure AWS credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION) in .env.
    // 3. Initialize SES client: `new SESClient({ region: "your-region" })`.
    // 4. Create `SendEmailCommand` with parameters from the payload.
    // 5. Send the command: `await client.send(command)`.
    // 6. Ensure your sending domain is verified in SES to avoid deliverability issues.
    console.warn("AWS SES not implemented. Falling back to default provider.");
    // Fallback to Resend or Nodemailer if SES is not yet implemented
    return resendApiKey ? sendWithResend(payload) : sendWithNodemailer(payload);
}

export async function sendEmail(payload: EmailPayload) {
  // Logic to determine which email service to use.
  // For now, it prefers Resend, then Nodemailer.
  // A future implementation could use a 'userCount' variable to switch to SES.
  const userCount = 0; // Placeholder for user count logic

  if (userCount > 100 && process.env.AWS_REGION) {
      return sendWithSES(payload);
  }

  if (resendApiKey) {
    try {
      console.log('Sending email with Resend...');
      return await sendWithResend(payload);
    } catch (error) {
      console.warn('Resend failed, attempting fallback to Nodemailer.', error);
      return sendWithNodemailer(payload);
    }
  } else {
    console.log('Sending email with Nodemailer...');
    return sendWithNodemailer(payload);
  }
}
