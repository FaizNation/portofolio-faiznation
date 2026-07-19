# Design Spec: User Joined Date Integration

This document details the schema changes, API updates, and UI integrations to add a `joinedAt` date column to the `User` model and display it in the Hover Card UI in the ChatWidget.

---

## 1. Objectives

- Add a `joinedAt` field of type `DateTime` with a default value of `now()` to the `User` table.
- Create and run a database migration to apply the change.
- Update `/api/users/[id]` endpoint to select and return `joinedAt`.
- Update the ChatWidget UI to cache user details (both email and joinedAt date) and show the joined date in the hover card using `CalendarDays` from `lucide-react`.

---

## 2. Database Schema Changes

Modify `prisma/schema.prisma` to include `joinedAt`:

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  joinedAt      DateTime  @default(now()) // Added
  accounts      Account[]
  sessions      Session[]
  comments      Comment[]
}
```

Run migration:
```powershell
npx prisma migrate dev --name add_joined_at_to_user
```

---

## 3. API Updates (`app/api/users/[id]/route.ts`)

Modify the select statement to fetch `joinedAt`:

```typescript
const user = await prisma.user.findUnique({
    where: { id },
    select: {
        email: true,
        joinedAt: true, // Added
    }
});
```

The response will return:
```json
{
  "email": "user@example.com",
  "joinedAt": "2026-07-18T07:23:57.000Z"
}
```

---

## 4. UI ChatWidget Integration (`components/ChatWidget.tsx`)

- Import `CalendarDays` from `lucide-react`:
  ```typescript
  import { CalendarDays } from "lucide-react";
  ```
- Update `userEmails` state to `userDetails` state:
  ```typescript
  interface UserDetails {
      email: string | null;
      joinedAt: string | null;
  }
  const [userDetails, setUserDetails] = useState<Record<string, UserDetails>>({});
  ```
- Update `fetchUserEmail` helper to `fetchUserDetails` and update state appropriately:
  ```typescript
  const fetchUserDetails = async (userId: string) => {
      if (!userId || userDetails[userId] || pendingEmailsRef.current.has(userId)) return;
      pendingEmailsRef.current.add(userId);
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
          pendingEmailsRef.current.delete(userId);
      }
  };
  ```
- Render the CalendarDays and formatted date back inside `<HoverCardContent>`:
  ```tsx
  <div className="flex items-center pt-2">
      <CalendarDays className="mr-2 h-4 w-4 opacity-70 text-gray-500 dark:text-gray-400" />
      <span className="text-xs text-muted-foreground">
          {comment.user.id && userDetails[comment.user.id]?.joinedAt
              ? `Joined ${new Date(userDetails[comment.user.id].joinedAt).toLocaleDateString([], { month: 'long', year: 'numeric' })}`
              : "Loading..."}
      </span>
  </div>
  ```
