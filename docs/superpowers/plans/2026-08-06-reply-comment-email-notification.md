# Comment Reply Email Notification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send an automated email notification (in English) using Nodemailer to the author of a parent comment when another user replies to their comment.

**Architecture:** Create a modular email utility helper `lib/email.ts` that handles email template formatting and nodemailer transport configuration. Integrate this helper into the `POST` method of the comments route `app/api/comments/route.ts` inside a try-catch block to prevent email failures from disrupting comment posting.

**Tech Stack:** Next.js (App Router), Prisma, Nodemailer, TypeScript

---

### Task 1: Create Email Utility Module

**Files:**
- Create: `lib/email.ts`

- [ ] **Step 1: Create `lib/email.ts` file with nodemailer transporter and send function**
Write the following code to `lib/email.ts`:

```typescript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
```

---

### Task 2: Create Manual Test Script

**Files:**
- Create: `scripts/test-email.ts`

- [ ] **Step 1: Create `scripts/test-email.ts` manual verification script**
Write the following code to `scripts/test-email.ts`:

```typescript
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { sendReplyNotificationEmail } from "../lib/email";

async function main() {
  console.log("Testing email utility...");
  const testEmail = process.env.EMAIL_USER;
  if (!testEmail) {
    console.error("EMAIL_USER environment variable not found in .env.");
    process.exit(1);
  }

  try {
    const result = await sendReplyNotificationEmail({
      toEmail: testEmail,
      parentName: "Original User",
      replierName: "Replier User",
      replyContent: "This is a test reply comment notification from test script.",
    });
    console.log("Email sent successfully!", result);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
}

main();
```

- [ ] **Step 2: Run verification script to confirm SMTP credentials work**
Run: `npx tsx scripts/test-email.ts`
Expected Output: Log message "Email sent successfully!" along with mail transaction details (meaning email arrived in `EMAIL_USER` inbox).

---

### Task 3: Integrate Email Utility into API Route

**Files:**
- Modify: `app/api/comments/route.ts`

- [ ] **Step 1: Add import and invocation to `app/api/comments/route.ts`**
Modify `app/api/comments/route.ts` to include the email notification call inside the `POST` method.
Find the code:
```typescript
        const processedNewComment = {
            ...newComment,
            user: {
                id: newComment.user.id,
                name: newComment.user.name,
                image: newComment.user.image,
                isVerified
            },
            parent: newComment.parent ? {
                ...newComment.parent,
                user: {
                    name: newComment.parent.user.name,
                    isVerified: parentIsVerified
                }
            } : null
        };

        return NextResponse.json(processedNewComment);
```
Replace it with:
```typescript
        // Check if the comment is a reply and should notify the parent comment's author
        if (parentId && newComment.parent && newComment.parent.user.email) {
            const parentEmail = newComment.parent.user.email;
            const parentName = newComment.parent.user.name || "Anonymous";
            const replierName = newComment.user.name || "Anonymous";
            const replierEmail = newComment.user.email;

            // Only notify if replying to someone else's comment
            if (parentEmail !== replierEmail) {
                const { sendReplyNotificationEmail } = await import("@/lib/email");
                try {
                    await sendReplyNotificationEmail({
                        toEmail: parentEmail,
                        parentName,
                        replierName,
                        replyContent: content.trim(),
                    });
                } catch (emailError) {
                    console.error("Failed to send reply notification email:", emailError);
                }
            }
        }

        const processedNewComment = {
            ...newComment,
            user: {
                id: newComment.user.id,
                name: newComment.user.name,
                image: newComment.user.image,
                isVerified
            },
            parent: newComment.parent ? {
                ...newComment.parent,
                user: {
                    name: newComment.parent.user.name,
                    isVerified: parentIsVerified
                }
            } : null
        };

        return NextResponse.json(processedNewComment);
```

---

### Task 4: Clean Up Test Files & Final Verification

**Files:**
- Delete: `scripts/test-email.ts`

- [ ] **Step 1: Delete `scripts/test-email.ts` manual verification script**
Delete the file to keep the codebase clean.

- [ ] **Step 2: Run dev server and manually test the widget**
Run: `npm run dev`
Verify in the browser by replying to another user's comment (or using local database entries to simulate it) to ensure no errors are thrown and execution completes successfully.
