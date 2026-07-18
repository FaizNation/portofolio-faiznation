# Design Spec: User Avatar Hover Card Integration with On-Demand User Details API

This document details the architecture, file additions, and modifications to integrate a Hover Card onto the user avatars in the discussion chat widget. To protect user privacy, emails are loaded on-demand when the Hover Card is opened, rather than exposing them in the general comments list response.

---

## 1. Objectives

- Install `@radix-ui/react-avatar` and create the Shadcn `Avatar` component.
- Create an on-demand API route `/api/users/[id]` that fetches and returns user email.
- Expose the user `id` (cuid) in the existing comments API payload.
- Update the discussion chat widget UI (`components/ChatWidget.tsx`) to show a Hover Card on user avatars with their custom avatar representation, name, and on-demand loaded email.

---

## 2. API Schema and Changes

### Comments API Updates (`app/api/comments/route.ts`)
We will include the user ID `id: true` inside the selected user fields so the client can query that user's email on hover.

```typescript
// app/api/comments/route.ts
// Include id: true inside include.user.select in GET and POST handlers.
user: {
    select: {
        id: true,
        name: true,
        image: true,
        email: true // Still needed internally to evaluate isVerified
    }
}
```

We will also update the mapped user object in the response to pass `id` to the client:
```typescript
user: {
    id: comment.user.id,
    name: comment.user.name,
    image: comment.user.image,
    isVerified
}
```

### New User API Route (`app/api/users/[id]/route.ts`)
Create a GET endpoint that takes `params.id` and queries the database for that user's email.

```typescript
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: params.id },
            select: { email: true }
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

---

## 3. Frontend Additions

### Dependency
Install `@radix-ui/react-avatar` using `npm install`.

### Avatar Component (`components/ui/avatar.tsx`)
Standard shadcn avatar component utilizing Radix UI primitives.

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

---

## 4. UI ChatWidget Integration (`components/ChatWidget.tsx`)

- Add `email` as an optional field on the client-side `Comment["user"]` type:
  ```typescript
  user: {
      id?: string;
      name: string | null;
      image: string | null;
      isVerified?: boolean;
  }
  ```
- Declare state to store fetched emails mapping:
  ```typescript
  const [userEmails, setUserEmails] = useState<Record<string, string>>({});
  ```
- Create helper function `fetchUserEmail(userId: string)` to request the email.
- Integrate `<HoverCard>`, `<HoverCardTrigger>`, and `<HoverCardContent>` around the comment avatar.
- Trigger `fetchUserEmail` inside `<HoverCard onOpenChange={...}>`.
- Inside `<HoverCardContent>`:
  - Render `<Avatar>`, `<AvatarImage src={comment.user.image || undefined}>`, `<AvatarFallback>`.
  - Render name in `<h4 className="text-sm font-semibold">`.
  - Render email inside `<p className="text-sm">` with fallback to `"Loading..."` if fetching.
  - Remove `<CalendarDays>` and Joined date.
