# Comment Reply Email Notification Spec

Implement email notifications for users when someone replies to their comments in the portfolio discussion widget.

## Context & Requirements
- When user B replies to user A's comment, user A should receive an email notification.
- The email should be in English.
- The email must include the name of the replier, the content of the reply, and a link back to the portfolio.
- It must reuse the existing Nodemailer transporter configurations from the contact route.
- It must avoid self-notifications (i.e., if user A replies to user A's own comment).
- It must handle email failures gracefully so that comment submission still succeeds even if email delivery fails.

## Proposed Changes

### Component 1: Email Utility
#### [NEW] [email.ts](file:///c:/Users/ASUS/Desktop/Developments/project/personal/portofolio-faiznation/lib/email.ts)
Create a helper function to send the notification email:
- Name: `sendReplyNotificationEmail`
- Service: Gmail (via SMTP using `process.env.EMAIL_USER` and `process.env.EMAIL_PASS`)
- Body: A clean HTML & text template containing the reply details and a redirect link using `process.env.NEXTAUTH_URL`.

### Component 2: API Route for Comments
#### [MODIFY] [route.ts](file:///c:/Users/ASUS/Desktop/Developments/project/personal/portofolio-faiznation/app/api/comments/route.ts)
- Modify the POST request handler to check if the comment is a reply (i.e., has a `parentId`).
- Retrieve the email and name of the parent comment's author.
- Ensure the parent author has a valid email address and that it does not match the replier's email address.
- Call the email utility with the details and await the result.
- Wrap the email sending invocation in a try-catch block to prevent SMTP failures from causing comment submission failures.

## Verification Plan
### Manual Verification
- Log in to the application and post comments.
- Test replying to someone else's comment to verify the email notification is received successfully.
- Test replying to one's own comment to verify no email is sent.
- Temporarily change SMTP settings to invalid values to verify that comment creation still succeeds even if email sending fails.
