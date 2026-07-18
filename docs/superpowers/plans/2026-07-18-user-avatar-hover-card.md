# User Avatar Hover Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Hover Card to user avatars in the ChatWidget that shows the user's avatar, name, and email fetched on-demand.

**Architecture:** We will modify the Comments API to include `userId` in the payload, create an on-demand API route `/api/users/[id]` to fetch the user's email, install and create the Shadcn Avatar component, and integrate Radix HoverCard and Avatar into `ChatWidget.tsx`.

**Tech Stack:** Next.js, Radix UI (HoverCard, Avatar), Prisma, Tailwind CSS.

---

### Task 1: Install `@radix-ui/react-avatar` Dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install dependency**

Run the installation command in the workspace root directory:
```powershell
npm install @radix-ui/react-avatar
```

- [ ] **Step 2: Verify installation**

Run:
```powershell
git diff package.json
```
Expected output:
```diff
+    "@radix-ui/react-avatar": "^1.1.3",
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @radix-ui/react-avatar dependency"
```

---

### Task 2: Create Avatar Component

**Files:**
- Create: `components/ui/avatar.tsx`

- [ ] **Step 1: Write the Avatar component code**

Create and write the component file `components/ui/avatar.tsx`:
```typescript
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/avatar.tsx
git commit -m "feat: create shadcn avatar ui component"
```

---

### Task 3: Expose User ID in Comments API

**Files:**
- Modify: `app/api/comments/route.ts`

- [ ] **Step 1: Update the SELECT queries and mappings**

Modify `app/api/comments/route.ts` around line 13 and line 94 to select `id: true` for the user:
```typescript
// Replace lines 13-18 with:
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true
                    }
                },
```
```typescript
// Replace lines 94-99 with:
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true
                    }
                },
```

Modify `app/api/comments/route.ts` around line 43 and line 123 to include user `id` in client response:
```typescript
// Replace lines 43-47 with:
                user: {
                    id: comment.user.id,
                    name: comment.user.name,
                    image: comment.user.image,
                    isVerified
                },
```
```typescript
// Replace lines 123-127 with:
            user: {
                id: newComment.user.id,
                name: newComment.user.name,
                image: newComment.user.image,
                isVerified
            },
```

- [ ] **Step 2: Verify changes with git diff**

Verify:
```powershell
git diff app/api/comments/route.ts
```

- [ ] **Step 3: Commit**

```bash
git add app/api/comments/route.ts
git commit -m "feat: expose user id in comments api payload"
```

---

### Task 4: Add New On-Demand User Details API Endpoint

**Files:**
- Create: `app/api/users/[id]/route.ts`

- [ ] **Step 1: Write the user details route**

Create and write the GET API handler in `app/api/users/[id]/route.ts`:
```typescript
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                email: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ email: user.email });
    } catch (error) {
        console.error("Error fetching user email:", error);
        return NextResponse.json({ error: "Failed to fetch user email" }, { status: 500 });
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/users/[id]/route.ts
git commit -m "feat: add user details api route to fetch email"
```

---

### Task 5: Integrate HoverCard in ChatWidget

**Files:**
- Modify: `components/ChatWidget.tsx`

- [ ] **Step 1: Add imports, Comment interface updates, and state**

Add `HoverCard` and `Avatar` imports and update imports in `components/ChatWidget.tsx`:
```typescript
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
```

Update `Comment` interface definition to support user ID:
```typescript
interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id?: string;
        name: string | null;
        image: string | null;
        isVerified?: boolean;
    };
    // ...
}
```

Add state for tracking user emails and a fetching helper:
```typescript
    const [userEmails, setUserEmails] = useState<Record<string, string>>({});

    const fetchUserEmail = async (userId: string) => {
        if (!userId || userEmails[userId]) return;
        try {
            const res = await fetch(`/api/users/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setUserEmails(prev => ({ ...prev, [userId]: data.email }));
            }
        } catch (err) {
            console.error("Failed to fetch user email", err);
        }
    };
```

- [ ] **Step 2: Integrate HoverCard UI around avatar**

Modify the avatar block (around lines 346–362 in `components/ChatWidget.tsx`) to implement the HoverCard. Replace that code block with the following:
```typescript
                                            {/* Avatar for others */}
                                            {!isMe && (
                                                <div className="w-8 h-8 flex-shrink-0 flex flex-col justify-end">
                                                    {showAvatar ? (
                                                        <HoverCard onOpenChange={(open) => {
                                                            if (open && comment.user.id) {
                                                                fetchUserEmail(comment.user.id);
                                                            }
                                                        }}>
                                                            <HoverCardTrigger asChild>
                                                                <button className="w-8 h-8 rounded-full focus:outline-none overflow-hidden cursor-pointer">
                                                                    {comment.user.image ? (
                                                                        <img
                                                                            src={comment.user.image}
                                                                            alt={comment.user.name || "User"}
                                                                            className="w-8 h-8 rounded-full object-cover shadow-sm"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                                                                            {comment.user.name?.[0] || "?"}
                                                                        </div>
                                                                    )}
                                                                </button>
                                                            </HoverCardTrigger>
                                                            <HoverCardContent className="w-80 p-4 border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 rounded-xl shadow-xl z-[250]">
                                                                <div className="flex justify-between space-x-4">
                                                                    <Avatar className="w-12 h-12">
                                                                        {comment.user.image ? (
                                                                            <AvatarImage src={comment.user.image} alt={comment.user.name || "User"} />
                                                                        ) : null}
                                                                        <AvatarFallback className="bg-gray-300 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 font-bold text-sm">
                                                                            {comment.user.name?.[0] || "?"}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="space-y-1 flex-1 min-w-0">
                                                                        <h4 className="text-sm font-semibold text-black dark:text-white truncate">
                                                                            {comment.user.name || "Anonymous"}
                                                                        </h4>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                            {comment.user.id ? (userEmails[comment.user.id] || "Loading...") : "No email available"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </HoverCardContent>
                                                        </HoverCard>
                                                    ) : <div className="w-8" />}
                                                </div>
                                            )}
```

- [ ] **Step 3: Run static typecheck and build**

Run build command in the terminal to verify no lint or typescript compilation issues exist:
```powershell
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add components/ChatWidget.tsx
git commit -m "feat: integrate HoverCard for user avatars in ChatWidget"
```
