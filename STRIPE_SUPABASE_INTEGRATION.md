# 🎨 AVERRA Stripe + Supabase Integration Guide

## ✅ What's Already Built

Your complete **Stripe + Supabase client onboarding automation** is now live! Here's everything that's working:

---

## 🔄 **Complete Integration Flow**

```
Customer fills Brand Intake Form 
    ↓
Adds service tier to cart
    ↓
Checkout via Stripe Checkout
    ↓
Payment Success → Stripe Webhook Fires
    ↓
Server captures all data → Stores in Supabase KV
    ↓
Confirmation email sent via Resend
    ↓
Data available for Calendly/Google Cal automation
```

---

## 🛠️ **What I Built For You**

### **1. Stripe Payment Integration** ✅
- ✅ Checkout session creation for all service tiers & digital products
- ✅ Secure payment processing
- ✅ Webhook handler to capture completed payments
- ✅ Automatic receipt emails via Resend

### **2. Supabase Data Storage** ✅
- ✅ Complete order data stored in KV store with prefix `sale_`
- ✅ Customer information (name, email, phone)
- ✅ Full brand intake form responses
- ✅ Service tier purchased
- ✅ Payment amount and timestamp
- ✅ Onboarding status tracking

### **3. Analytics Dashboard** ✅
- ✅ Real-time revenue tracking at `/analytics`
- ✅ Total sales by service tier
- ✅ Average order value
- ✅ Pending onboarding queue (clients who need to book strategy session)
- ✅ Recent sales list
- ✅ Quiz completion analytics

### **4. API Endpoints For Your Automation** ✅

#### **Get Pending Onboarding Clients**
```
GET /make-server-61755bec/pending-onboarding
```
Returns all clients who paid but haven't booked their strategy session yet.

Response includes:
- Customer name, email, phone
- Service tier (for routing to correct Calendly link)
- All brand intake form data
- Payment amount
- Timestamp

#### **Update Onboarding Status**
```
POST /make-server-61755bec/update-onboarding-status
Body: {
  "saleId": "sale_123...",
  "strategySessionBooked": true,
  "calendlyEventId": "evt_123...",
  "onboardingStatus": "session_booked"
}
```
Call this when a Calendly booking is confirmed to update the client's status.

---

## 🎯 **What You Need To Do**

### **Calendly + Email Automation Setup**

You handle the Calendly and Google Calendar integration. Here's exactly what you need:

#### **Option 1: Zapier/Make.com Automation** (Recommended)
1. Create a webhook trigger in Zapier/Make
2. Poll the `/pending-onboarding` endpoint every hour
3. For each pending client:
   - Send personalized email with Calendly booking link
   - Use `serviceTier` field to route to correct Calendly link:
     - AVERRA Essentials → Calendly Link 1
     - AVERRA Signature → Calendly Link 2
     - AVERRA Muse → Calendly Link 3
4. When client books on Calendly:
   - Calendly webhook fires
   - Call `/update-onboarding-status` to mark as booked
   - Add to Google Calendar

#### **Option 2: Direct Calendly API Integration**
If you want to build it yourself:
1. Fetch pending clients from `/pending-onboarding`
2. Use Calendly API to send scheduling links
3. Listen for Calendly webhooks when booking is confirmed
4. Call `/update-onboarding-status` to update status

---

## 📊 **Data Structure**

Each sale record in Supabase includes:

```json
{
  "saleId": "sale_1234567890_abc123",
  "orderId": "cs_test_...",
  "customerName": "Jane Doe",
  "customerEmail": "jane@example.com",
  "customerPhone": "+1234567890",
  "serviceTier": "AVERRA Signature",
  "totalPrice": "2997.00",
  "onboardingStatus": "payment_complete",
  "strategySessionBooked": false,
  "calendlyEventId": null,
  "brandName": "Jane's Beauty Studio",
  "industry": "Beauty & Wellness",
  "targetAudience": "Women 25-45 seeking luxury services",
  "goals": "Expand online presence, Launch product line",
  "instagramHandle": "@janesbeauty",
  "website": "janesbeauty.com",
  "businessStage": "Established, Looking to scale",
  "brandPerception": "Affordable but professional",
  "misalignedAspects": "Pricing doesn't reflect quality",
  "aiStance": "Open to AI for efficiency",
  "urgentNotes": "Need to launch by Q2",
  "fullBrandIntakeData": { /* complete form */ },
  "createdAt": "2026-03-05T10:30:00Z",
  "updatedAt": "2026-03-05T10:30:00Z"
}
```

---

## 🔐 **Environment Variables**

Already configured:
- ✅ `STRIPE_SECRET_KEY` - Your Stripe test secret key
- ✅ `STRIPE_PUBLISHABLE_KEY` - Your Stripe test publishable key
- ✅ `SUPABASE_URL` - Supabase project URL
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - For server-side database access
- ✅ `RESEND_API_KEY` - For sending confirmation emails

**To enable webhooks in production:**
You need to set: `STRIPE_WEBHOOK_SECRET`

Get this from:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Create webhook endpoint: `https://YOUR_PROJECT.supabase.co/functions/v1/make-server-61755bec/webhooks/stripe`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy the webhook signing secret
5. Add it to Figma Make environment variables as `STRIPE_WEBHOOK_SECRET`

---

## 🚀 **Testing The Integration**

1. **Test a Purchase:**
   - Go to your site
   - Fill out Brand Intake Form
   - Add a service tier to cart
   - Complete checkout with test card: `4242 4242 4242 4242`
   - Check `/analytics` dashboard for the sale

2. **Check Pending Onboarding:**
   - Visit `/analytics`
   - Look for "Pending Strategy Sessions" section
   - You'll see the client listed

3. **Fetch Data For Automation:**
   ```bash
   curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-61755bec/pending-onboarding \
     -H "Authorization: Bearer YOUR_ANON_KEY"
   ```

4. **Update After Calendly Booking:**
   ```bash
   curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-61755bec/update-onboarding-status \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "saleId": "sale_123...",
       "strategySessionBooked": true,
       "calendlyEventId": "evt_123...",
       "onboardingStatus": "session_booked"
     }'
   ```

---

## 📧 **Email Automation Suggestions**

### **Confirmation Email** (Already Sent)
Automatically sent after payment via Resend:
- Order summary
- Total amount paid
- Next steps
- Project ID

### **Calendly Invitation Email** (You Build)
Send 1 hour after payment:
```
Subject: ✨ Schedule Your AVERRA Strategy Session - [Customer Name]

Hi [Customer Name],

Welcome to AVERRA! Your payment for [Service Tier] has been confirmed.

The next step is to schedule your personalized strategy session where we'll:
- Define your brand direction
- Align on your vision
- Set clear project goals

Click here to book your session: [Calendly Link]

[Include any prep questions they should think about]

Looking forward to working with you!

— The AVERRA Team
```

### **Reminder Email** (Optional)
If session not booked after 3 days, send reminder.

---

## 🎨 **Dashboard Features**

Visit `/analytics` to see:
- 💰 Total Revenue
- 📊 Sales by Service Tier
- 🚀 Pending Client Onboarding Queue
- 📈 Recent Sales
- 🎯 Quiz Completion Analytics
- ✅ Session Booking Status

---

## 🔄 **Next Steps For Full Automation**

1. **Connect Calendly:**
   - Set up Zapier/Make webhook to poll `/pending-onboarding`
   - Send automated emails with booking links
   - Listen for Calendly booking webhooks

2. **Google Calendar Integration:**
   - When Calendly webhook fires
   - Create Google Calendar event
   - Send calendar invite to client

3. **Set Up Production Webhooks:**
   - Add `STRIPE_WEBHOOK_SECRET` to environment variables
   - Test with Stripe CLI: `stripe listen --forward-to localhost:3000/webhooks/stripe`

4. **Monitor Dashboard:**
   - Check `/analytics` daily for pending onboarding
   - Track conversion from quiz → purchase

---

## 🆘 **Need Help?**

The integration is complete on my end! If you need help with:
- Calendly API integration
- Zapier/Make automation setup
- Custom email templates

Just let me know!

---

## ✅ **Summary**

**You have:**
- ✅ Complete Stripe checkout integration
- ✅ Webhook handler capturing all payment data
- ✅ Supabase storage with full brand intake responses
- ✅ Analytics dashboard with real-time metrics
- ✅ API endpoints ready for automation
- ✅ Automated confirmation emails

**You need to build:**
- 📅 Calendly scheduling automation (using the endpoints I provided)
- 📧 Follow-up email sequences (using pending client data)
- 📆 Google Calendar integration (when Calendly booking confirmed)

All the backend infrastructure is ready for your automation! 🎉
