# AVERRA Admin Quick Start

## Critical First Step: Set Admin Status

You MUST set admin status before you can access admin routes. There are two methods:

### Method 1: Using the Admin Setup Page (Recommended if server is deployed)

1. Navigate to `/admin-setup`
2. Enter your email address
3. Click "Set Admin Status"
4. **Log out completely**
5. **Log back in**

If you get "Failed to fetch" error, the Supabase Edge Function is not deployed. Use Method 2 instead.

### Method 2: Direct SQL in Supabase Studio (Always works)

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste this SQL:

```sql
-- First, add the column if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Then set admin status for YOUR email
UPDATE profiles
SET is_admin = true
WHERE email = 'your@email.com';  -- Replace with YOUR actual email
```

5. Replace `'your@email.com'` with your actual email address
6. Click "Run" or press Ctrl+Enter
7. **Log out completely from the app**
8. **Log back in**

## Verify Admin Access

After setting admin and logging back in:

1. Navigate to `/admin/dashboard`
2. If you see the admin dashboard with no redirects → **SUCCESS!**
3. If you get redirected to login → Admin status not set or you didn't log out/in

## Troubleshooting

### Issue: Still redirecting to login after setting admin

**Solution:**
1. Clear browser cookies and cache
2. Log out completely
3. Close all browser tabs with the app
4. Open a fresh browser tab
5. Log in again
6. Try `/admin/dashboard` again

### Issue: "Multiple GoTrueClient instances" warning

**Solution:** This is now fixed. If you still see it:
1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. All admin pages now use the singleton Supabase client

### Issue: "Failed to fetch" when using admin setup page

**Solution:** 
1. The Supabase Edge Function is not deployed
2. Use Method 2 (Direct SQL) instead
3. This is the most reliable method anyway

### Issue: Admin column doesn't exist

**Solution:**
1. Run this SQL in Supabase Studio:
```sql
ALTER TABLE profiles
ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
```
2. Then set your admin status with the UPDATE query above

## After Setup

Once you're an admin:

- ✅ Access `/admin/dashboard` - Main admin interface
- ✅ Access `/admin/members` - Member management
- ✅ Access `/admin/community` - Community moderation
- ✅ Access `/admin/content` - Content uploads
- ✅ Access `/admin/analytics` - Analytics dashboard
- ✅ Access `/admin/qa` - QA testing tools
- ✅ Access `/admin/preview` - Preview member dashboards

## Security

**IMPORTANT:** After you set your admin account:

1. Remove the `/admin-setup` route from `src/app/routes.tsx`
2. Or restrict access to it in your production environment
3. Keep the SQL method for future admin account creation

## Quick Verification Test

Run this to verify your admin status:

```sql
SELECT email, is_admin
FROM profiles
WHERE email = 'your@email.com';
```

Should return:
```
email               | is_admin
--------------------|----------
your@email.com      | true
```

If `is_admin` is `false` or `NULL`, run the UPDATE query again.

## Common Admin Tasks

### Add Another Admin
```sql
UPDATE profiles
SET is_admin = true
WHERE email = 'newadmin@email.com';
```

### Remove Admin Status
```sql
UPDATE profiles
SET is_admin = false
WHERE email = 'formeradmin@email.com';
```

### List All Admins
```sql
SELECT email, full_name, is_admin
FROM profiles
WHERE is_admin = true;
```

## Next Steps

Once admin access is working:

1. Create test member accounts for both tiers
2. Test the preview mode at `/admin/preview`
3. Run QA tests at `/admin/qa`
4. Explore all admin features
5. Read `ADMIN_SETUP_GUIDE.md` for full documentation
