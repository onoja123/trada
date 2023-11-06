import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

interface EmailOptions {
  email: string;
  from?: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const user = process.env.MAIL_USER || 'jhhh'; // Use environment variable or fallback
    const pass = process.env.MAIL_PASS || 'hhhh'; // Use environment variable or fallback
    const host = process.env.MAIL_HOST || 'hhhh'; // Use environment variable or fallback
    const port = parseInt(process.env.MAIL_PORT || '587'); // Use environment variable or fallback
    const MAIL_NAME = 'No-Reply';

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host,
      port,
      auth: {
        user,
        pass,
      },
    });

    // Define mail options
    const mailOptions = {
      from: options.from ? `${options.from} <${user}>` : `${MAIL_NAME} <${user}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

export default sendEmail;