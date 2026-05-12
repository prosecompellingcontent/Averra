# AVERRA System Architecture

This document describes the technical architecture and key systems of the AVERRA membership platform.

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Error Handling](#error-handling)
3. [Database & Queries](#database--queries)
4. [Realtime Systems](#realtime-systems)
5. [Testing & QA](#testing--qa)

---

## Authentication & Authorization

### Auth Context (`src/app/context/AuthContext.tsx`)

The AuthProvider manages global authentication state with:

- **Session Management**: Automatic session loading and refresh with Supabase
- **User State**: Complete user profile including admin status, membership tier, onboarding status
- **Error Handling**: Structured error responses with user-friendly messages
- **Session Persistence**: Automatic session hydration with timeout protection

#### Key Features:

- ✅ Automatic session refresh
- ✅ Admin role bypass logic
- ✅ Subscription status checking
- ✅ Graceful error recovery
- ✅ Loading states prevent race conditions

#### Usage:

```typescript
const { user, isLoading, authError, login, signOut } = useAuth();

// Login with error handling
const { user, error } = await login(email, password);
if (error) {
  console.error(error.userMessage); // User-friendly message
}
```

### Protected Routes (`src/app/components/ProtectedRoute.tsx`)

Middleware component that:

- ✅ Waits for auth to fully load before rendering
- ✅ Checks admin status FIRST (admins bypass all other checks)
- ✅ Validates subscription status for non-admins
- ✅ Enforces tier requirements
- ✅ Handles onboarding completion
- ✅ Shows loading spinner during auth checks

#### Route Protection Hierarchy:

1. **Authentication** - User must be logged in
2. **Admin Check** - Admins skip all remaining checks
3. **Subscription** - Active subscription required (non-admins)
4. **Onboarding** - Username created (if required)
5. **Tier Access** - Correct membership tier (if specified)

---

## Error Handling

### Centralized Error System (`src/utils/errorHandling.ts`)

All errors flow through a unified system that provides:

- **Structured Errors**: Consistent AppError interface across the platform
- **User-Friendly Messages**: Automatic conversion of technical errors to readable messages
- **Error Logging**: Centralized logging with context and timestamps
- **Retry Logic**: Automatic retry for transient network errors
- **Type Safety**: TypeScript error types for different error categories

#### Error Types:

- `auth` - Authentication/authorization errors
- `network` - Connection and timeout errors
- `database` - Supabase query errors
- `validation` - Input validation errors
- `subscription` - Stripe/subscription errors
- `verification` - Email/code verification errors
- `realtime` - Websocket connection errors
- `stripe` - Payment processing errors

#### Key Functions:

```typescript
// Create user-friendly error
const appError = createAppError(error, 'auth', 'Custom message');

// Fetch with automatic retry
const response = await fetchWithRetry(url, options, maxRetries);

// Wrap async operations with error handling
const { data, error } = await withErrorHandling(
  () => supabase.from('profiles').select(),
  'loadProfiles',
  'database'
);
```

### Error Boundary (`src/app/components/ErrorBoundary.tsx`)

React error boundary that:

- ✅ Catches component rendering errors
- ✅ Displays user-friendly fallback UI
- ✅ Logs errors with full context
- ✅ Allows retry or page refresh
- ✅ Shows stack trace in development

---

## Database & Queries

### Query Utilities (`src/utils/supabase/queries.ts`)

Centralized Supabase queries with built-in error handling:

#### User Management:

```typescript
// Check username availability (with debounce on frontend)
const { available, error } = await checkUsernameAvailability(username);

// Create username
const { data, error } = await createUsername(userId, username);

// Get user profile
const { data, error } = await getUserProfile(userId);

// Update profile
const { data, error } = await updateUserProfile(userId, updates);
```

#### Content:

```typescript
// Get community posts with authors
const { data, error } = await getCommunityPosts(limit);

// Get saved posts
const { data, error } = await getSavedPosts(userId);

// Create post
const { data, error } = await createPost(authorId, content, postType);
```

#### Storage:

```typescript
// List files in bucket
const { data, error } = await getStorageFiles(bucketName, path);

// Upload file
const { data, error } = await uploadFile(bucketName, path, file);
```

### Database Schema:

#### Profiles Table:

- `id` (uuid, PK)
- `email` (text, unique)
- `full_name` (text)
- `username` (text, unique)
- `membership_type` (text) - "blueprint" | "gold-standard"
- `membership_status` (text) - "active" | "canceled" | "past_due" | "expired"
- `is_admin` (boolean, default false)
- `stripe_customer_id` (text)
- `stripe_subscription_id` (text)
- `created_at` (timestamptz)

---

## Realtime Systems

### Realtime Manager (`src/utils/realtime/manager.ts`)

Manages Supabase realtime subscriptions with:

- ✅ Automatic cleanup on unmount
- ✅ Duplicate subscription prevention
- ✅ Connection status monitoring
- ✅ Error handling and recovery
- ✅ Centralized subscription tracking

#### Usage:

```typescript
// Subscribe to table changes
const unsubscribe = realtimeManager.subscribe('posts-feed', {
  table: 'posts',
  event: 'INSERT',
  callback: (payload) => {
    console.log('New post:', payload.new);
  },
});

// Cleanup
unsubscribe();

// Or use React hook
useRealtimeSubscription('posts-feed', {
  table: 'posts',
  event: '*',
  callback: handlePostUpdate,
}, [dependencies]);
```

#### Features:

- Prevents memory leaks
- Handles reconnection automatically
- Tracks active channels
- Logs connection status
- Proper async cleanup

---

## Testing & QA

### Admin QA Page (`src/app/pages/admin/AdminQAPage.tsx`)

Comprehensive testing dashboard with:

#### Automated Tests:

1. **Database Connection** - Verifies Supabase connection
2. **Auth System** - Tests session and authentication
3. **Session Persistence** - Checks session expiration and refresh
4. **Membership Permissions** - Validates tier-based access
5. **Username Validation** - Tests username checking system
6. **Stripe Integration** - Verifies payment integration
7. **Storage Buckets** - Checks file storage access
8. **Realtime Updates** - Tests websocket connections
9. **Error Handling** - Validates error system
10. **Admin Access** - Confirms admin permissions

#### Debug Panel:

- **Session Information**: Current user, email, expiration
- **Database Statistics**: Profile count, posts count
- **Realtime Connections**: Active channels and status
- **Individual Test Triggers**: Run specific tests on demand

#### Test Results:

- ✅ Success (green)
- ✗ Error (red)
- ⋯ Pending (yellow)
- ⚠ Warning (orange)

Each test result includes:

- Status indicator
- Descriptive message
- Additional details (when available)
- Timestamp

---

## Best Practices

### Error Handling:

1. **Always use centralized utilities** for consistent error messages
2. **Never show generic errors** like "Failed to fetch"
3. **Provide context** in error logs for debugging
4. **Use retry logic** for network errors
5. **Display user-friendly messages** while logging technical details

### Authentication:

1. **Wait for auth to load** before rendering protected content
2. **Check admin status first** in route guards
3. **Always handle errors** from login/signup
4. **Refresh user data** after profile updates
5. **Clear errors** when appropriate

### Realtime:

1. **Use realtime manager** instead of direct Supabase subscriptions
2. **Always cleanup** subscriptions on unmount
3. **Handle connection errors** gracefully
4. **Avoid duplicate subscriptions** to same channel
5. **Monitor active channels** in development

### Database:

1. **Use query utilities** instead of direct Supabase calls
2. **Handle both data and error** from every query
3. **Validate input** before database operations
4. **Use transactions** for related updates
5. **Index frequently queried fields**

---

## Environment Variables

Required environment variables (set in Supabase):

- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server only)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `RESEND_API_KEY` - Resend email API key
- `EMAIL_FROM` - From email address

---

## Security Considerations

1. **Row Level Security (RLS)**: All database tables have RLS policies
2. **Admin Service Key**: Only used in Edge Functions, never exposed to frontend
3. **Session Tokens**: Stored securely in httpOnly cookies
4. **Input Validation**: All user input validated before database operations
5. **CORS**: Properly configured for production domains
6. **Rate Limiting**: Applied to sensitive operations (login, signup, etc.)

---

## Debugging

### Common Issues:

**"useAuth must be used within an AuthProvider"**

- Ensure page is wrapped in RootLayout
- Check routes.tsx structure

**"Multiple GoTrueClient instances"**

- Use singleton client from `@/utils/supabase/client`
- Don't create new Supabase clients

**"Failed to fetch"**

- Check network connection
- Verify Edge Function deployment
- Check CORS configuration
- Review error handling implementation

**Redirect loops**

- Verify admin status in database
- Check ProtectedRoute hierarchy
- Ensure auth finished loading

**Session not persisting**

- Clear browser cookies
- Check session expiration
- Verify auth state refresh

### Debug Tools:

1. **Admin Debug Page** (`/admin-debug`) - Shows auth and database state
2. **Admin QA Page** (`/admin/qa`) - Comprehensive system tests
3. **Browser Console** - Structured error logs with context
4. **Network Tab** - Monitor Supabase requests
5. **React DevTools** - Inspect component state

---

## Future Enhancements

- [ ] Offline mode with service worker
- [ ] Advanced analytics tracking
- [ ] A/B testing framework
- [ ] Performance monitoring
- [ ] Automated integration tests
- [ ] GraphQL API layer
- [ ] Mobile app with React Native
- [ ] Advanced caching strategies
- [ ] CDN integration for assets
- [ ] Multi-language support

---

Last Updated: May 11, 2026
