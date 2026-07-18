# User Joined Date Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `joinedAt` column to the `User` table and display it in the Hover Card UI in the ChatWidget using a calendar icon.

**Architecture:** We will modify `schema.prisma` to add `joinedAt DateTime @default(now())` to `User`, generate a schema migration, update the GET `/api/users/[id]` endpoint to fetch and return the date, and update `ChatWidget.tsx` to cache user details and display the date dynamically.

**Tech Stack:** Next.js, Prisma, Radix UI, Lucide React, Tailwind CSS.

---

### Task 1: Update Database Schema & Run Migration

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Update the User model in schema**

Modify `prisma/schema.prisma` to add the `joinedAt` field to `User` model around line 15:
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  joinedAt      DateTime  @default(now()) // Add this
  accounts      Account[]
  sessions      Session[]
  comments      Comment[]
}
```

- [ ] **Step 2: Generate and apply the migration**

Run the Prisma migration command in the terminal:
```powershell
npx prisma migrate dev --name add_joined_at_to_user
```
Expected output:
```
Your database is now in sync with your schema.
Generated Prisma Client ...
```

---

### Task 2: Update User API Endpoint

**Files:**
- Modify: `app/api/users/[id]/route.ts`

- [ ] **Step 1: Update the SELECT query in user API route**

Modify `app/api/users/[id]/route.ts` around line 12 to include `joinedAt` in the Prisma query:
```typescript
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                email: true,
                joinedAt: true,
            }
        });
```

Verify that the file compiles:
```powershell
npx tsc --noEmit
```

---

### Task 3: Integrate Joined Date in ChatWidget

**Files:**
- Modify: `components/ChatWidget.tsx`

- [ ] **Step 1: Add CalendarDays import and update state**

Add `CalendarDays` import and update the Comment interface/imports:
```typescript
// Add this import in components/ChatWidget.tsx around line 15:
import { CalendarDays } from "lucide-react";
```

Replace the `userEmails` state and `fetchUserEmail` function in `components/ChatWidget.tsx` (around lines 54–71) with the following caching state and helper:
```typescript
    interface UserDetails {
        email: string | null;
        joinedAt: string | null;
    }
    const [userDetails, setUserDetails] = useState<Record<string, UserDetails>>({});
    const pendingDetailsRef = useRef<Set<string>>(new Set());

    const fetchUserDetails = async (userId: string) => {
        if (!userId || userDetails[userId] || pendingDetailsRef.current.has(userId)) return;
        pendingDetailsRef.current.add(userId);
        try {
            const res = await fetch(`/api/users/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setUserDetails(prev => ({
                    ...prev,
                    [userId]: {
                        email: data.email,
                        joinedAt: data.joinedAt
                    }
                }));
            }
        } catch (err) {
            console.error("Failed to fetch user details", err);
        } finally {
            pendingDetailsRef.current.delete(userId);
        }
    };
```

- [ ] **Step 2: Update HoverCard trigger and content UI**

In `components/ChatWidget.tsx` (around lines 375–415), update the other users' avatar HoverCard component:
1. Update `onOpenChange` to call `fetchUserDetails` instead of `fetchUserEmail`.
2. Update the email rendering paragraph to display the email from `userDetails`.
3. Add the `<CalendarDays>` block back inside `<HoverCardContent>` underneath the email paragraph.

Replace that block with:
```typescript
                                            {/* Avatar for others */}
                                            {!isMe && (
                                                <div className="w-8 h-8 flex-shrink-0 flex flex-col justify-end">
                                                    {showAvatar ? (
                                                        <HoverCard onOpenChange={(open) => {
                                                            if (open && comment.user.id) {
                                                                fetchUserDetails(comment.user.id);
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
                                                                            {comment.user.id ? (userDetails[comment.user.id]?.email || "Loading...") : "No email available"}
                                                                        </p>
                                                                        <div className="flex items-center pt-2">
                                                                            <CalendarDays className="mr-2 h-4 w-4 opacity-70 text-gray-500 dark:text-gray-400" />{" "}
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {comment.user.id && userDetails[comment.user.id]?.joinedAt
                                                                                    ? `Joined ${new Date(userDetails[comment.user.id].joinedAt).toLocaleDateString([], { month: 'long', year: 'numeric' })}`
                                                                                    : "Loading..."}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </HoverCardContent>
                                                        </HoverCard>
                                                    ) : <div className="w-8" />}
                                                </div>
                                            )}
```

- [ ] **Step 3: Run static typecheck and production build**

Run build command in the terminal to verify no compilation issues exist:
```powershell
npm run build
```
