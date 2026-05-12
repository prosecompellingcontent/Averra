# AVERRA Admin System Setup Guide

## Overview
The AVERRA platform now has a complete admin ecosystem with role-based access control, member management, community moderation, content management, analytics, and QA testing tools.

## Initial Setup

### Step 1: Set Your Admin Account

1. Navigate to `/admin-setup` in your browser
2. Enter your email address (the email you use to log in)
3. Click "Set Admin Status"
4. **Log out completely** and log back in for the admin status to take effect

**IMPORTANT**: After setting your admin account, you should remove public access to `/admin-setup` for security.

### Step 2: Verify Admin Access

1. Log in with your admin account
2. Navigate to `/admin/dashboard`
3. You should now see the AVERRA Admin dashboard with no redirects

## Admin Features

### Admin Dashboard (`/admin/dashboard`)
- Real-time member statistics
- Blueprint vs Gold Standard member counts
- Community activity overview
- Quick action cards for common tasks
- Navigation to all admin sections

### Member Management (`/admin/members`)
- View all members with real Supabase data
- Search members by name, email, or username
- Filter by membership type (Blueprint/Gold Standard)
- Filter by status (Active/Canceled/Past Due)
- View member details including Stripe integration
- Direct messaging capability (backend ready)

### Community Moderation (`/admin/community`)
- View all posts and comments
- Create announcements (pinned automatically)
- Pin/unpin posts
- Feature/unfeature posts
- Delete posts and comments
- Real-time community feed

### Content Management (`/admin/content`)
- Upload files to Supabase Storage
- Organize by category (ebooks, templates, PDFs, videos, resources, replays)
- Set membership level access
- Download and delete files
- Automatic storage bucket creation

### Analytics (`/admin/analytics`)
- Total member count and engagement rate
- Blueprint vs Gold Standard breakdown
- Community activity (posts and comments)
- Recent activity timeline
- Top contributors leaderboard
- Customizable date ranges

### QA Testing (`/admin/qa`)
- Run automated system tests
- Test database connection
- Test auth system
- Test membership permissions
- Test Stripe integration
- Test storage buckets
- Test realtime updates
- Individual test runners available

### Preview Mode (`/admin/preview`)
- Preview Blueprint dashboard experience
- Preview Gold Standard dashboard experience
- Test both membership tiers without switching accounts
- Opens in new tabs for easy comparison

## Role-Based Access System

### Admin Role
- Bypasses ALL membership checks and restrictions
- Can access admin routes
- Can preview both membership tiers
- Has full visibility into the platform
- Session persists across routes and refreshes

### Blueprint Members
- Access to Blueprint dashboard
- Community access
- Blueprint resources only
- NO ebook access
- Upgrade prompts for locked content

### Gold Standard Members
- Access to Gold Standard dashboard
- All Blueprint features PLUS:
  - Full ebook library
  - Audiobook access
  - Strategy call access
  - Premium resources
  - Advanced features

## Dashboard Architecture

### Blueprint Dashboard (`/members/blueprint/dashboard`)
Standalone dashboard for Blueprint members featuring:
- Community feed
- Quick access to resources
- Monthly framework drops
- Implementation checklists
- Upgrade prompts for premium features

### Gold Standard Dashboard (`/members/goldstandard/dashboard`)
Premium dashboard for Gold Standard members featuring:
- All Blueprint features
- Continue reading (ebook progress)
- Premium resource access
- Strategy call scheduling
- Progress tracking
- Audiobook player
- Premium community access

### Smart Routing (`/members/dashboard`)
Automatically routes to the correct dashboard based on:
- Member's subscription tier
- Admin preview mode (if admin is previewing)
- Authentication status

## Server Endpoints

### Admin Management
- `POST /make-server-61755bec/admin/set-admin` - Set admin status for a user
- `POST /make-server-61755bec/admin/send-message` - Send direct message to member
- `POST /make-server-61755bec/admin/send-notification` - Send notification to all members
- `POST /make-server-61755bec/admin/send-mass-email` - Send mass email via Resend

All endpoints use Supabase service role key for admin operations.

## Database Schema

### Required Column
The system requires an `is_admin` column in the `profiles` table:

```sql
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
```

This column is automatically created when you use the `/admin-setup` endpoint.

## Testing the System

### Test Admin Access
1. Set admin status via `/admin-setup`
2. Log out and log back in
3. Navigate to `/admin/dashboard`
4. Verify you can access all admin sections
5. Verify no redirect loops

### Test Preview Mode
1. Go to `/admin/preview`
2. Select Blueprint or Gold Standard
3. Click "Preview Dashboard →"
4. Verify the correct dashboard renders in a new tab
5. Try switching between tiers
6. Verify preview works without login redirects

### Test Member Routing
1. Create a test Blueprint member account
2. Log in as that member
3. Verify you see the Blueprint dashboard
4. Verify you cannot access Gold Standard features
5. Create a test Gold Standard member account
6. Log in as that member
7. Verify you see the Gold Standard dashboard
8. Verify you have access to all premium features

### Test QA Tools
1. Navigate to `/admin/qa`
2. Click "Run All Tests"
3. Verify all tests pass
4. Check for any errors in the console
5. Fix any failing tests

## Troubleshooting

### Redirect Loop Issue
If you experience redirect loops:
1. Clear your browser cache and cookies
2. Log out completely
3. Log back in
4. Verify your admin status by checking `/admin/qa` (Database Connection test shows your user data)

### Admin Status Not Working
If admin status isn't applying:
1. Verify the `is_admin` column exists in the `profiles` table
2. Check the database directly to confirm `is_admin = true` for your account
3. Log out and log back in (session needs to refresh)
4. Check browser console for auth errors

### Preview Mode Not Working
If preview mode redirects instead of rendering:
1. Verify you're logged in as an admin
2. Check that `user.isAdmin` is `true` in the auth context
3. Verify the preview links open in new tabs
4. Check browser console for routing errors

### Auth Context Issues
If auth context isn't loading properly:
1. Check `/utils/supabase/info.ts` exists with correct credentials
2. Verify Supabase connection in `/admin/qa`
3. Check browser console for Supabase errors
4. Verify session is persisting (check Application > Cookies in DevTools)

## Security Notes

1. **Remove `/admin-setup` access** after initial setup
2. **Admin status** should only be granted to trusted users
3. **Service role key** is used server-side only (never exposed to frontend)
4. **Admin routes** are protected with `requireAdmin` prop
5. **Session persistence** uses Supabase auth cookies

## Next Steps

After setup:
1. Test all admin features thoroughly
2. Create test member accounts for both tiers
3. Verify permission boundaries
4. Test preview mode extensively
5. Run QA tests regularly
6. Monitor analytics for platform health

## Support

If you encounter issues:
1. Check browser console for errors
2. Run `/admin/qa` tests
3. Verify database schema
4. Check Supabase logs
5. Review auth context state
