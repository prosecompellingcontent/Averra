# Stripe Payment Integration Setup Guide

## Overview
Your AVERRA AI MODEL STUDIO site now has a complete Stripe payment integration! Here's how to set it up and start accepting real payments.

## What's Been Built

✅ **Checkout Page** - Professional payment form with Stripe Elements
✅ **Backend Payment Processing** - Secure server-side payment intent creation
✅ **Order Confirmation** - Automatic order logging and storage
✅ **Success Page** - Beautiful confirmation page after payment
✅ **Cart Integration** - "Proceed to Checkout" button linked to payment flow

## Setup Steps

### 1. Get Your Stripe Keys

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Create a free Stripe account (takes 2 minutes)
3. Navigate to **Developers → API keys**
4. You'll see two keys:
   - **Publishable key** (starts with `pk_test_...`) - Safe to use in frontend
   - **Secret key** (starts with `sk_test_...`) - Must stay private on backend

### 2. Add Your Stripe Secret Key

1. In your Figma Make project, go to **Settings/Environment Variables**
2. Add a new environment variable:
   - **Name:** `STRIPE_SECRET_KEY`
   - **Value:** Your secret key (the one starting with `sk_test_...`)
3. Save the environment variable

### 3. Update the Frontend with Your Publishable Key

Open `/src/app/pages/CheckoutPage.tsx` and replace this line:

```typescript
const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY');
```

With your actual publishable key:

```typescript
const stripePromise = loadStripe('pk_test_51abc123...');
```

### 4. Test the Payment Flow

#### Using Stripe Test Cards:

| Card Number | Description | Result |
|------------|-------------|---------|
| `4242 4242 4242 4242` | Visa | ✅ Success |
| `4000 0025 0000 3155` | 3D Secure | Requires authentication |
| `4000 0000 0000 9995` | Declined | ❌ Card declined |

**Use any:**
- Future expiry date (e.g., `12/25`)
- Any 3-digit CVC (e.g., `123`)
- Any postal code (e.g., `12345`)

## How It Works

### Payment Flow:
1. Customer adds items to cart
2. Clicks "Proceed to Checkout"
3. Fills out contact info and card details
4. Frontend creates payment intent via your server
5. Stripe securely processes the payment
6. Order details are stored and logged
7. Customer sees success page

### Where to Find Orders:

**In Supabase Logs:**
1. Go to your Supabase project dashboard
2. Navigate to **Functions → make-server-61755bec → Logs**
3. You'll see formatted order details like:
```
=== NEW ORDER RECEIVED ===
Order ID: order_1234567890
Customer: Jane Doe
Email: jane@example.com
Items:
  1. AVERRA Essentials - $100
Total: $100
===========================
```

**In Stripe Dashboard:**
1. Go to [https://dashboard.stripe.com/test/payments](https://dashboard.stripe.com/test/payments)
2. See all transactions with customer details
3. View full payment history and refund options

## Going Live (When Ready)

### Switch from Test Mode to Live Mode:

1. **In Stripe Dashboard:**
   - Complete Stripe account verification
   - Activate your live account
   - Get your **live keys** (start with `pk_live_...` and `sk_live_...`)

2. **Update Your Keys:**
   - Replace test publishable key with live key in `CheckoutPage.tsx`
   - Replace `STRIPE_SECRET_KEY` environment variable with live secret key

3. **That's it!** Your site will now process real payments.

## Order Notifications

Currently, orders are logged to Supabase console. To receive email notifications:

### Option 1: Check Supabase Logs Regularly
- Set up log monitoring in Supabase
- Check Function logs daily

### Option 2: Add Email Service (Future Enhancement)
- Integrate with SendGrid, Mailgun, or Resend
- Automatically send order confirmations to your email

## Pricing & Fees

**Stripe Fees (Standard):**
- 2.9% + $0.30 per successful charge
- No monthly fees
- No setup fees

**Example:**
- $100 sale = You receive $96.80
- Stripe takes $3.20

## Security Features

✅ **PCI Compliance** - Stripe handles all card data securely
✅ **No card storage** - Card details never touch your server  
✅ **SSL/TLS encryption** - All data encrypted in transit
✅ **3D Secure support** - Extra authentication when needed
✅ **Fraud detection** - Stripe's built-in fraud prevention

## Support

**Stripe Issues:**
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)

**Test Your Integration:**
- Use test cards from: https://stripe.com/docs/testing

## Files Modified

- ✅ `/src/app/pages/CheckoutPage.tsx` - Payment form
- ✅ `/src/app/pages/CheckoutSuccessPage.tsx` - Success page
- ✅ `/src/app/pages/CartPage.tsx` - Added checkout link
- ✅ `/src/app/routes.ts` - Added checkout routes
- ✅ `/supabase/functions/server/index.tsx` - Payment backend
- ✅ `/package.json` - Added Stripe packages

---

**Ready to accept your first payment?** 🎉

Just add your Stripe keys and you're all set!
