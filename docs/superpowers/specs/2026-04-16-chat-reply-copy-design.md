# Design Spec: Chat Reply and Copy Features

Implement WhatsApp-style message replies and a context menu (Reply/Copy) for the ChatWidget.

## 1. Requirements

### Reply Feature
- **Context Menu**: Triggered by right-click (desktop) or long-press (mobile) on a message bubble.
- **Reply Action**: Selecting "Reply" opens a preview bar above the text input.
- **Reply Preview**: Shows the original sender's name and a snippet of their message.
- **Message Bubble UI**: Replies include a "quoted" snippet of the original message at the top of the bubble.
- **Flat Nesting**: Every reply references one original message (no deep trees).

### Copy Feature
- **Copy Action**: Selecting "Copy" from the context menu copies the message text to the clipboard.
- **Feedback**: Provide immediate visual feedback (e.g., "Copied!" notification).

## 2. Technical Architecture

### Database (Prisma)
- **Model `Comment`**:
  - Add optional `parentId: String?`
  - Add self-relation: `parent: Comment? @relation("CommentReplies", fields: [parentId], references: [id])`
  - Add back-relation: `replies: Comment[] @relation("CommentReplies")`

### API (`/api/comments`)
- **GET**: Include `parent` in the Prisma query (`include: { parent: { include: { user: true } } }`).
- **POST**: Accept an optional `parentId` in the request body.

### Frontend (`ChatWidget.tsx`)
- **State Management**:
  - `replyTo: Comment | null`: The comment currently being replied to.
  - `contextMenu: { x: number, y: number, comment: Comment } | null`: Data for the custom context menu.
- **Context Menu Component**:
  - Floating menu positioned at `(x, y)`.
  - Handles `onContextMenu` on message bubbles.
  - Implements long-press logic using `onTouchStart` and `onTouchEnd` timers.
- **Input Area**:
  - Show `ReplyPreview` bar if `replyTo` is not null.
  - Clear `replyTo` after successful send or when "X" is clicked.
- **Message Rendering**:
  - Check if `comment.parent` exists.
  - If so, render a themed quote block inside the bubble before the message content.

## 3. Implementation Steps

1. **Schema Update**: Modify `schema.prisma` and run `npx prisma migrate dev`.
2. **API Update**: Enhance GET and POST handlers in `app/api/comments/route.ts`.
3. **Frontend Infrastructure**: Add `replyTo` and `contextMenu` states to `ChatWidget.tsx`.
4. **Context Menu Implementation**: Build the custom menu and trigger logic.
5. **Reply Preview & UI**: Build the `ReplyPreview` component and update the message bubble rendering.
6. **Validation**: Test reply flow, copy functionality, and mobile responsiveness.
