import nodemailer from "nodemailer";
import { extractTextFromHTML } from "./extract-text-from-html";

// cPanel SMTP configuration
const transporter = nodemailer.createTransport({
  host: "mi3-lr5.supercp.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.CPANEL_EMAIL_USER,
    pass: process.env.CPANEL_EMAIL_PASSWORD,
  },
});

export const sendMail = async (
  to: string,
  options: {
    subject: string;
    html: string;
    text?: string;
    replyTo?: string;
    displayName?: string;
    organization?: string;
  },
) => {
  const mailOptions = {
    from: `"${options.displayName || "Bright Future School Team"}" <${process.env.CPANEL_EMAIL_USER}>`,
    to,
    subject: options.subject,
    html: options.html,
    text: options.text || extractTextFromHTML(options.html),
    replyTo: options.replyTo || process.env.CPANEL_EMAIL_USER,
    headers: {
      "X-Organization": options.organization || "Bright Future School WAU",
    },
  };
  try {
    const data = await transporter.sendMail(mailOptions);
    console.log(" email sent: ", data);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Failed to send email. ");
  }
};
