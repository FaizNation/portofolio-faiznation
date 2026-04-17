# Chat Reply and Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add WhatsApp-style message replies and a context menu with "Reply" and "Copy" actions to the ChatWidget.

**Architecture:** Update the database to support self-referencing comments, enhance the API to fetch and save reply context, and implement a custom context menu and reply UI in the React frontend.

**Tech Stack:** Next.js, TypeScript, Prisma (PostgreSQL), Tailwind CSS, Framer Motion.

---

### Task 1: Database Schema Update

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Update Prisma Schema**

Add `parentId` and self-relations to the `Comment` model.

```prisma
model Comment {
  id        String    @id @default(cuid())
  content   String    @db.Text
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // New fields for replies
  parentId  String?
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")
}
```

- [ ] **Step 2: Run Prisma Migration**

Run: `npx prisma migrate dev --name add_comment_replies`
Expected: Success, migration file created, database updated.

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "db: add parentId and relations to Comment model"
```

---

### Task 2: API Enhancements

**Files:**
- Modify: `app/api/comments/route.ts`

- [ ] **Step 1: Update GET handler to include parent data**

Modify the `include` block in the GET function.

```typescript
// app/api/comments/route.ts

// Inside GET()
const comments = await prisma.comment.findMany({
    orderBy: {
        createdAt: 'asc'
    },
    include: {
        user: {
            select: {
                name: true,
                image: true
            }
        },
        parent: {
            include: {
                user: {
                    select: {
                        name: true
                    }
                }
            }
        }
    }
});
```

- [ ] **Step 2: Update POST handler to accept parentId**

Extract `parentId` from the request body and include it in the `create` call.

```typescript
// app/api/comments/route.ts

// Inside POST(req: Request)
const { content, parentId } = await req.json();

// ... (validation and user fetch)

const newComment = await prisma.comment.create({
    data: {
        content: content.trim(),
        userId: user.id,
        parentId: parentId || null,
    },
    include: {
        user: {
            select: {
                name: true,
                image: true
            }
        },
        parent: {
            include: {
                user: {
                    select: {
                        name: true
                    }
                }
            }
        }
    }
});
```

- [ ] **Step 3: Verify API changes**

(Manual test or simple script to POST a comment with a fake ID to see it fail, then a real one).

- [ ] **Step 4: Commit**

```bash
git add app/api/comments/route.ts
git commit -m "api: support parentId in comments GET and POST"
```

---

### Task 3: Frontend State and Infrastructure

**Files:**
- Modify: `components/ChatWidget.tsx`

- [ ] **Step 1: Update Comment interface and add new states**

```typescript
interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        name: string | null;
        image: string | null;
    };
    parent?: {
        content: string;
        user: {
            name: string | null;
        };
    } | null;
}

// Inside ChatWidget component:
const [replyTo, setReplyTo] = useState<Comment | null>(null);
const [contextMenu, setContextMenu] = useState<{ x: number, y: number, comment: Comment } | null>(null);
const [copySuccess, setCopySuccess] = useState(false);
```

- [ ] **Step 2: Add Click-to-Close Context Menu Effect**

Ensure the context menu closes when clicking elsewhere.

```typescript
useEffect(() => {
    const handleCloseMenu = () => setContextMenu(null);
    window.addEventListener("click", handleCloseMenu);
    return () => window.removeEventListener("click", handleCloseMenu);
}, []);
```

- [ ] **Step 3: Commit**

```bash
git add components/ChatWidget.tsx
git commit -m "feat: add reply and context menu state to ChatWidget"
```

---

### Task 4: Context Menu UI and Logic

**Files:**
- Modify: `components/ChatWidget.tsx`

- [ ] **Step 1: Implement Context Menu Handlers**

```typescript
const handleContextMenu = (e: React.MouseEvent, comment: Comment) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, comment });
};

const handleCopy = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
        console.error("Failed to copy", err);
    }
};
```

- [ ] **Step 2: Render Context Menu Component**

Add the menu UI to the JSX (outside the main flow, portal-like or absolute).

```tsx
{contextMenu && (
    <div 
        className="fixed z-[200] bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl shadow-2xl py-1 w-32 overflow-hidden"
        style={{ top: contextMenu.y, left: contextMenu.x }}
        onClick={(e) => e.stopPropagation()}
    >
        <button 
            onClick={() => {
                setReplyTo(contextMenu.comment);
                setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
        >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
            Reply
        </button>
        <button 
            onClick={() => {
                handleCopy(contextMenu.comment.content);
                setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
        >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Copy
        </button>
    </div>
)}

{/* Copy Feedback Toast */}
<AnimatePresence>
    {copySuccess && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-1/2 translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-xs font-bold shadow-lg z-[201]"
        >
            Copied to clipboard!
        </motion.div>
    )}
</AnimatePresence>
```

- [ ] **Step 3: Attach Context Menu Trigger**

Add `onContextMenu={(e) => handleContextMenu(e, comment)}` to the message bubble container.

- [ ] **Step 4: Commit**

```bash
git add components/ChatWidget.tsx
git commit -m "feat: implement context menu with Reply and Copy actions"
```

---

### Task 5: Reply Preview and Sending

**Files:**
- Modify: `components/ChatWidget.tsx`

- [ ] **Step 1: Implement Reply Preview UI**

Add above the input field.

```tsx
{replyTo && (
    <div className="mx-4 mb-2 p-2 bg-zinc-100 dark:bg-zinc-800 border-l-4 border-black dark:border-white rounded-r-lg flex justify-between items-start animate-in slide-in-from-bottom-2">
        <div className="overflow-hidden">
            <p className="text-[10px] font-bold text-black dark:text-white">Replying to {replyTo.user.name}</p>
            <p className="text-xs text-gray-500 truncate">{replyTo.content}</p>
        </div>
        <button onClick={() => setReplyTo(null)} className="p-1 hover:bg-black/5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    </div>
)}
```

- [ ] **Step 2: Update handleSend to include parentId**

```typescript
const handleSend = async () => {
    if (!inputValue.trim() || !session) return;

    setIsLoading(true);
    try {
        const res = await fetch("/api/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                content: inputValue,
                parentId: replyTo?.id 
            }),
        });

        if (res.ok) {
            const newComment = await res.json();
            setComments([...comments, newComment]);
            setInputValue("");
            setReplyTo(null); // Clear reply state
        }
// ...
```

- [ ] **Step 3: Commit**

```bash
git add components/ChatWidget.tsx
git commit -m "feat: show reply preview and send parentId with messages"
```

---

### Task 6: Quoted Message UI in Bubbles

**Files:**
- Modify: `components/ChatWidget.tsx`

- [ ] **Step 1: Render Quoted Message inside bubble**

```tsx
{/* Inside Message Bubble, before comment.content */}
{comment.parent && (
    <div className={`mb-2 p-2 rounded-md border-l-4 text-[12px] opacity-80 ${
        isMe ? "bg-white/10 border-white" : "bg-black/5 border-black dark:bg-white/5 dark:border-white"
    }`}>
        <p className="font-bold mb-0.5">{comment.parent.user.name}</p>
        <p className="line-clamp-2 leading-tight">{comment.parent.content}</p>
    </div>
)}
```

- [ ] **Step 2: Add long-press support for mobile**

(Simulate using timers on `onTouchStart` and `onTouchEnd`).

```typescript
let longPressTimer: ReturnType<typeof setTimeout>;

const handleTouchStart = (e: React.TouchEvent, comment: Comment) => {
    longPressTimer = setTimeout(() => {
        setContextMenu({ x: e.touches[0].clientX, y: e.touches[0].clientY, comment });
    }, 500); // 500ms for long press
};

const handleTouchEnd = () => {
    clearTimeout(longPressTimer);
};
```

Attach these to the same element as `onContextMenu`.

- [ ] **Step 3: Final Polishing**

- [ ] **Step 4: Commit**

```bash
git add components/ChatWidget.tsx
git commit -m "feat: render quoted replies in chat bubbles and add mobile long-press support"
```
