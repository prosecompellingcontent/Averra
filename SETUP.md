# AVERRA Ecosystem Setup Guide

This guide will help you configure Stripe and Supabase for the AVERRA membership ecosystem.

## Supabase Setup

### 1. Database Migration

Run the database migration to create all necessary tables:

```bash
cd supabase
supabase db push
```

This will create:
- `profiles` - Member profiles and membership status
- `subscriptions` - Stripe subscription tracking
- `posts` - Community posts
- `comments` - Post comments
- `likes` - Post likes
- `saved_posts` - Saved posts
- `conversations` - Direct message conversations
- `messages` - DM messages
- `typing_indicators` - Real-time typing indicators
- `notifications` - Member notifications
- `ebook_progress` - Reading progress tracking
- `ebook_bookmarks` - Bookmarked chapters

### 2. Authentication Configuration

In your Supabase dashboard, go to **Authentication** → **URL Configuration** and add:

**Site URL:**
```
https://averraaistudio.com
```

**Redirect URLs:**
```
https://averraaistudio.com/members/reset-password
https://averraaistudio.com/members/login
https://averraaistudio.com/auth/callback
https://averraaistudio.com/members/onboarding
```

### 3. Enable Realtime

In your Supabase dashboard, go to **Database** → **Replication** and enable realtime for:
- posts
- comments
- likes
- messages
- typing_indicators
- profiles (for online status)
- notifications

### 4. Environment Variables

Make sure these environment variables are set in your Supabase Edge Functions:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Stripe Setup

### 1. Create Products

Create these products in your Stripe Dashboard:

**The Blueprint Membership**
- Type: Recurring
- Price: $30/month (founder pricing)
- Price ID: Save this for webhook configuration

**The Gold Standard Membership**
- Type: Recurring
- Price: $75/month (founder pricing)
- Price ID: Save this for webhook configuration

**The Gold Standard eBook**
- Type: One-time payment
- Price: Set your price
- Price ID: Save this for product configuration

### 2. Configure Webhooks

In your Stripe Dashboard, go to **Developers** → **Webhooks** and add a new endpoint:

**Endpoint URL:**
```
https://your-project.supabase.co/functions/v1/stripe-webhook
```

**Events to listen for:**
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

Save the webhook signing secret and add it to your Supabase environment variables.

### 3. Test Webhook

Use Stripe CLI to test webhooks locally:

```bash
stripe listen --forward-to https://your-project.supabase.co/functions/v1/stripe-webhook
stripe trigger checkout.session.completed
```

## Deployment

### 1. Deploy Edge Functions

```bash
cd supabase
supabase functions deploy stripe-webhook
```

### 2. Update Frontend Environment Variables

Make sure your frontend has access to:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Testing the Flow

### Membership Purchase Flow

1. User selects membership tier on `/membership-options`
2. User completes enrollment form
3. Stripe checkout session is created
4. User completes payment on Stripe
5. Webhook fires → `checkout.session.completed`
6. Supabase creates/updates profile
7. Subscription record is created
8. User is redirected to `/members/dashboard`

### Real-Time Features

Test these features in the community:

1. **Live Posts**: Create a post and watch it appear instantly for other users
2. **Live Comments**: Add comments and see them update in real-time
3. **Live Likes**: Click like and see the count update immediately
4. **Online Status**: Check online/offline indicators
5. **Direct Messages**: Send DMs with typing indicators
6. **Notifications**: Test notification delivery

### Password Reset Flow

1. User clicks "Forgot Password?" on login page
2. Enters email → Verification code sent
3. Enters 6-digit code
4. Creates new password
5. Redirected to login with success message

## Monitoring

### Stripe Dashboard

Monitor:
- Successful payments
- Failed payments
- Active subscriptions
- Churned subscriptions

### Supabase Dashboard

Monitor:
- Database size and performance
- Realtime connections
- Edge function logs
- Authentication events

## Troubleshooting

### Webhook Not Firing

1. Check Stripe webhook logs
2. Verify endpoint URL is correct
3. Check Supabase function logs
4. Verify webhook secret matches

### Realtime Not Working

1. Check if realtime is enabled for the table
2. Verify RLS policies allow access
3. Check browser console for connection errors
4. Verify Supabase project is not paused

### Payment Not Activating Membership

1. Check webhook logs in Stripe
2. Verify Supabase function executed successfully
3. Check database for profile and subscription records
4. Verify price IDs match in webhook handler

## Support

For issues with:
- **Stripe**: Check Stripe Dashboard logs and documentation
- **Supabase**: Check Supabase Dashboard logs and documentation
- **Application**: Check browser console and network tab
