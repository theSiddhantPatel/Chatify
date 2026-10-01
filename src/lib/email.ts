import { Resend } from "resend";

export const resendClient = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const sender = {
  email: process.env.EMAIL_FROM || "onboarding@resend.dev",
  name: process.env.EMAIL_FROM_NAME || "Chatify",
};

export async function sendWelcomeEmail(email: string, name: string, clientURL: string) {
  if (!resendClient) {
    console.log("Resend API key not configured, skipping welcome email");
    return;
  }

  try {
    const { data, error } = await resendClient.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "Welcome to Chatify!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #06b6d4;">Welcome to Chatify, ${name}!</h2>
          <p>We are thrilled to have you here. Chatify lets you connect with your friends in real time.</p>
          <div style="margin: 20px 0;">
            <a href="${clientURL}" style="background-color: #06b6d4; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Open Chatify
            </a>
          </div>
          <p style="color: #64748b; font-size: 13px;">Happy messaging!<br />The Chatify Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending welcome email:", error);
    } else {
      console.log("Welcome email sent:", data?.id);
    }
  } catch (err) {
    console.error("Failed to send welcome email:", err);
  }
}
