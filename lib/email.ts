import nodemailer from "nodemailer";

interface EmailPayload {
  toEmail: string;
  parentName: string;
  replierName: string;
  replyContent: string;
}

export async function sendReplyNotificationEmail({
  toEmail,
  parentName,
  replierName,
  replyContent,
}: EmailPayload) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: `[FaizNation Portfolio] New reply to your comment`,
    text: `Hi ${parentName},

${replierName} has replied to your comment:

"${replyContent}"

You can view the reply and join the discussion here:
${appUrl}

Best regards,
FaizNation Portfolio`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px;">
        <h2 style="color: #18181b; margin-bottom: 20px;">[FaizNation Portfolio] New Reply Notification</h2>
        <p>Hi <strong>${parentName}</strong>,</p>
        <p><strong>${replierName}</strong> has replied to your comment:</p>
        <blockquote style="border-left: 4px solid #18181b; padding-left: 15px; margin: 20px 0; color: #71717a; font-style: italic;">
          "${replyContent}"
        </blockquote>
        <p>Click the button below to view the reply and join the discussion:</p>
        <div style="margin: 30px 0;">
          <a href="${appUrl}" style="background-color: #18181b; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Reply</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 30px 0;" />
        <p style="font-size: 12px; color: #a1a1aa;">This is an automated email notification from the FaizNation Portfolio discussion widget.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
