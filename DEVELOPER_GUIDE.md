# AVERRA Developer Guide

Welcome to the AVERRA membership platform. This guide will help you understand the codebase and start contributing effectively.

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm package manager
- Supabase account
- Stripe account (for payments)
- Resend account (for emails)

### Setup

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Configure environment variables (see below)
4. Run development server: `pnpm dev`

### Environment Variables

The platform requires these variables (managed via Supabase):

```env
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_DB_URL=your-database-url

STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable
STRIPE_WEBHOOK_SECRET=your-webhook-secret

RESEND_API_KEY=your-resend-key
EMAIL_FROM=noreply@yourdomain.com

PUBLIC_SITE_URL=https://yourdomain.com
```

---

## Project Structure

```
/workspaces/default/code/
├── src/
│   ├── app/
│   │   ├── components/        # Reusable React components
│   │   ├── context/           # React context providers
│   │   ├── layouts/           # Page layouts
│   │   ├── pages/             # Route pages
│   │   │   ├── admin/         # Admin pages
│   │   │   └── members/       # Member pages
│   │   ├── App.tsx            # Main app component
│   │   └── routes.tsx         # React Router configuration
│   ├── utils/
│   │   ├── errorHandling.ts   # Global error handling
│   │   ├── supabase/
│   │   │   ├── client.ts      # Supabase client singleton
│   │   │   └── queries.ts     # Centralized DB queries
│   │   └── realtime/
│   │       └── manager.ts     # Realtime connection manager
│   └── styles/                # Global styles
├── supabase/
│   └── functions/
│       └── server/            # Edge functions
├── public/                     # Static assets
└── Documentation:
    ├── README.md              # Project overview
    ├── DEVELOPER_GUIDE.md     # This file
    ├── SYSTEM_ARCHITECTURE.md # Technical architecture
    ├── AUTH_FIX_IMPLEMENTATION.md  # Auth system details
    ├── ADMIN_SETUP_GUIDE.md   # Admin setup
    └── ADMIN_QUICK_START.md   # Admin quick reference
```

---

## Core Concepts

### 1. Authentication

The platform uses Supabase Auth with custom role-based access control.

**Key Files:**
- `src/app/context/AuthContext.tsx` - Auth state management
- `src/app/components/ProtectedRoute.tsx` - Route protection middleware

**Usage:**

```typescript
import { useAuth } from '@/app/context/AuthContext';

function MyComponent() {
  const { user, isLoading, login, signOut } = useAuth();
  
  // Login
  const handleLogin = async () => {
    const { user, error } = await login(email, password);
    if (error) {
      console.error(error.userMessage);
      return;
    }
    // Success
  };
  
  // Access user data
  if (user.isAdmin) {
    // Admin-only logic
  }
}
```

**User Object:**

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  membershipTier: "blueprint" | "gold-standard" | null;
  subscriptionStatus: "active" | "canceled" | "past_due" | "expired";
  stripeCustomerId?: string;
  hasCompletedOnboarding: boolean;
  joinedAt: string;
  isAdmin: boolean;
}
```

### 2. Error Handling

All errors use a centralized system that provides user-friendly messages.

**Key Files:**
- `src/utils/errorHandling.ts` - Error utilities

**Usage:**

```typescript
import { createAppError, withErrorHandling } from '@/utils/errorHandling';

// Wrap async operations
const { data, error } = await withErrorHandling(
  async () => {
    const result = await someAsyncOperation();
    return result;
  },
  'operationName',  // For logging
  'database'        // Error type
);

if (error) {
  // error.userMessage is user-friendly
  setErrorMessage(error.userMessage);
  // error.message is technical (for logging)
  console.error(error.message);
}
```

**Error Types:**
- `auth` - Authentication/authorization
- `network` - Connection issues
- `database` - Database operations
- `validation` - Input validation
- `subscription` - Payment/subscription
- `verification` - Email/code verification
- `realtime` - Websocket connections
- `stripe` - Payment processing

### 3. Database Queries

Use centralized query utilities instead of direct Supabase calls.

**Key Files:**
- `src/utils/supabase/queries.ts` - Query functions

**Usage:**

```typescript
import {
  getUserProfile,
  updateUserProfile,
  getCommunityPosts,
  checkUsernameAvailability,
} from '@/utils/supabase/queries';

// Get user profile
const { data: profile, error } = await getUserProfile(userId);

// Update profile
const { data, error } = await updateUserProfile(userId, {
  full_name: 'New Name',
});

// Check username
const { available, error } = await checkUsernameAvailability('username');

// Get posts
const { data: posts, error } = await getCommunityPosts(10);
```

### 4. Realtime Subscriptions

Use the realtime manager to prevent memory leaks.

**Key Files:**
- `src/utils/realtime/manager.ts` - Connection manager

**Usage:**

```typescript
import { realtimeManager } from '@/utils/realtime/manager';

function MyComponent() {
  useEffect(() => {
    // Subscribe to posts
    const unsubscribe = realtimeManager.subscribe('posts-feed', {
      table: 'posts',
      event: 'INSERT',
      callback: (payload) => {
        console.log('New post:', payload.new);
        // Update state
      },
    });
    
    // Cleanup on unmount
    return unsubscribe;
  }, []);
}
```

**Benefits:**
- Automatic cleanup
- No duplicate subscriptions
- Connection monitoring
- Error handling

---

## Common Tasks

### Adding a New Page

1. Create page component in `src/app/pages/`
2. Add route in `src/app/routes.tsx`
3. Wrap with `ProtectedRoute` if authentication required

```typescript
// 1. Create page
// src/app/pages/MyNewPage.tsx
export function MyNewPage() {
  return <div>My New Page</div>;
}

// 2. Add route
// src/app/routes.tsx
import { MyNewPage } from "@/app/pages/MyNewPage";

{
  path: "my-new-page",
  element: (
    <ProtectedRoute requireAdmin={true}>
      <MyNewPage />
    </ProtectedRoute>
  ),
}
```

### Creating a Database Query

1. Add function to `src/utils/supabase/queries.ts`
2. Use `executeQuery` wrapper
3. Return `{ data, error }`

```typescript
export async function getMyData(userId: string) {
  return executeQuery(
    () =>
      supabase
        .from("my_table")
        .select("*")
        .eq("user_id", userId),
    `getMyData(${userId})`
  );
}
```

### Adding Error Handling

```typescript
import { createAppError, logError } from '@/utils/errorHandling';

try {
  const result = await riskyOperation();
} catch (err) {
  const appError = createAppError(
    err,
    'database',
    'Failed to load data. Please try again.'
  );
  logError('MyComponent', appError);
  setError(appError.userMessage);
}
```

### Creating a Realtime Subscription

```typescript
import { realtimeManager } from '@/utils/realtime/manager';

useEffect(() => {
  const cleanup = realtimeManager.subscribe('my-channel', {
    table: 'my_table',
    event: '*',  // or 'INSERT', 'UPDATE', 'DELETE'
    filter: 'user_id=eq.123',  // optional
    callback: (payload) => {
      handleUpdate(payload);
    },
  });
  
  return cleanup;
}, []);
```

---

## Database Schema

### Profiles Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  username TEXT UNIQUE,
  membership_type TEXT CHECK (membership_type IN ('blueprint', 'gold-standard')),
  membership_status TEXT DEFAULT 'active',
  is_admin BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Posts Table

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'discussion',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Testing

### Running Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:coverage
```

### Admin QA Page

Visit `/admin/qa` to access the comprehensive testing dashboard:

- **Automated Tests**: Run all system tests
- **Debug Panel**: View session info, database stats, realtime connections
- **Individual Tests**: Test specific components

Tests included:
1. Database Connection
2. Auth System
3. Session Persistence
4. Membership Permissions
5. Username Validation
6. Stripe Integration
7. Storage Buckets
8. Realtime Updates
9. Error Handling
10. Admin Access

---

## Debugging

### Common Issues

**"useAuth must be used within an AuthProvider"**
- Ensure component is inside RootLayout
- Check routes.tsx configuration

**"Multiple GoTrueClient instances"**
- Always use singleton: `import { supabase } from '@/utils/supabase/client'`
- Never create new Supabase clients

**"Failed to fetch"**
- Check network connection
- Verify Edge Function deployment
- Review CORS settings
- Check error handling implementation

**Session not persisting**
- Clear browser cookies
- Check session expiration
- Verify auth refresh logic

### Debug Tools

1. **Admin Debug Page** (`/admin-debug`) - Auth & DB state
2. **Admin QA Page** (`/admin/qa`) - System tests
3. **Browser Console** - Structured error logs
4. **Network Tab** - Monitor API requests
5. **React DevTools** - Component state

### Logging

The platform uses structured logging:

```typescript
import { logError } from '@/utils/errorHandling';

logError('ComponentName', error);

// Output format:
// [2026-05-11T12:00:00.000Z] ComponentName: {
//   type: 'database',
//   message: 'Query failed',
//   userMessage: 'Unable to load data',
//   retryable: true,
//   originalError: { ... }
// }
```

---

## Code Style

### TypeScript

- Use explicit types for function parameters and returns
- Avoid `any` - use `unknown` if type is truly unknown
- Use interfaces for objects, types for unions/primitives
- Enable strict mode in tsconfig.json

### React

- Use functional components with hooks
- Prefer named exports over default exports
- Keep components small and focused
- Extract reusable logic to custom hooks

### Naming Conventions

- Components: PascalCase (`UserProfile`)
- Functions: camelCase (`loadUserData`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- Files: PascalCase for components, camelCase for utilities

### Error Messages

- User messages: Clear, actionable, non-technical
- Log messages: Detailed, include context
- Always provide both

```typescript
// Good
const error = createAppError(
  err,
  'database',
  'Unable to save your changes. Please try again.'
);

// Bad
throw new Error('Query failed');
```

---

## Security Best Practices

1. **Never expose service role key** to frontend
2. **Use RLS policies** for all tables
3. **Validate all input** before database operations
4. **Rate limit** sensitive operations
5. **Log security events** (failed logins, etc.)
6. **Use HTTPS** in production
7. **Set secure cookie flags**
8. **Sanitize user input** before display

---

## Deployment

### Supabase

1. Push database migrations
2. Deploy Edge Functions
3. Configure environment variables
4. Enable RLS policies
5. Set up webhooks (Stripe, etc.)

### Frontend

1. Build: `pnpm build`
2. Test build: `pnpm preview`
3. Deploy to hosting (Vercel, Netlify, etc.)
4. Configure custom domain
5. Set environment variables
6. Enable HTTPS

---

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Internal Documentation

- `SYSTEM_ARCHITECTURE.md` - Technical architecture
- `AUTH_FIX_IMPLEMENTATION.md` - Auth system details
- `ADMIN_SETUP_GUIDE.md` - Admin setup instructions
- `ADMIN_QUICK_START.md` - Quick admin reference

---

## Support

For questions or issues:

1. Check this documentation
2. Review system architecture docs
3. Use Admin QA page for debugging
4. Check browser console for errors
5. Review Supabase logs

---

## Contributing

1. Create feature branch from `main`
2. Follow code style guidelines
3. Add tests for new features
4. Update documentation
5. Submit pull request
6. Ensure all tests pass

---

Last Updated: May 11, 2026
Maintained by: AVERRA Development Team
