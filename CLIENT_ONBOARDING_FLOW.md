# 🔄 AVERRA Client Onboarding Automation - Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CUSTOMER JOURNEY                             │
└─────────────────────────────────────────────────────────────────────┘

1️⃣ BRAND INTAKE FORM
   └─> Customer fills comprehensive form
       • Business name, services, target audience
       • Instagram handle, website
       • Business stage, goals, AI stance
       • Urgent notes
   
2️⃣ ADD TO CART
   └─> Select service tier:
       • AVERRA Essentials ($997)
       • AVERRA Signature ($2,997)
       • AVERRA Muse ($8,997)
       + Optional digital products

3️⃣ CHECKOUT
   └─> Stripe Checkout Session
       • Secure payment processing
       • Brand intake data attached to metadata
       • Customer details captured

4️⃣ PAYMENT SUCCESS
   └─> Stripe Webhook: checkout.session.completed
       ↓
   ┌───────────────────────────────────────────────────┐
   │  SERVER SIDE (Supabase Edge Function)            │
   ├───────────────────────────────────────────────────┤
   │  ✅ Extract customer data                         │
   │  ✅ Extract brand intake responses                │
   │  ✅ Determine service tier                        │
   │  ✅ Store in Supabase KV with prefix "sale_"     │
   │  ✅ Send confirmation email via Resend           │
   │  ✅ Set onboardingStatus: "payment_complete"     │
   │  ✅ Set strategySessionBooked: false             │
   └───────────────────────────────────────────────────┘

5️⃣ STORED DATA STRUCTURE
   └─> Supabase KV Store Record:
       {
         saleId: "sale_1234567890_abc123"
         customerName: "Jane Doe"
         customerEmail: "jane@example.com"
         customerPhone: "+1234567890"
         serviceTier: "AVERRA Signature"
         totalPrice: "2997.00"
         
         // Brand Intake Data
         brandName: "Jane's Beauty Studio"
         industry: "Beauty & Wellness"
         targetAudience: "Women 25-45"
         goals: "Expand online, Launch products"
         instagramHandle: "@janesbeauty"
         website: "janesbeauty.com"
         businessStage: "Established"
         brandPerception: "Affordable but professional"
         
         // Onboarding Status
         onboardingStatus: "payment_complete"
         strategySessionBooked: false
         calendlyEventId: null
         
         createdAt: "2026-03-05T10:30:00Z"
       }

6️⃣ YOUR CALENDLY AUTOMATION (You Build This)
   
   ┌─────────────────────────────────────────────────────┐
   │  OPTION A: Zapier/Make.com (Recommended)           │
   ├─────────────────────────────────────────────────────┤
   │  1. Webhook: Poll /pending-onboarding every hour   │
   │  2. Filter: strategySessionBooked === false        │
   │  3. Send Email: Personalized Calendly invitation   │
   │  4. Route by tier:                                 │
   │     • Essentials → Calendly Link A                 │
   │     • Signature → Calendly Link B                  │
   │     • Muse → Calendly Link C                       │
   │  5. Wait for Calendly booking webhook              │
   │  6. Update: POST /update-onboarding-status         │
   │  7. Add to Google Calendar                         │
   └─────────────────────────────────────────────────────┘
   
   ┌─────────────────────────────────────────────────────┐
   │  OPTION B: Direct API Integration                  │
   ├─────────────────────────────────────────────────────┤
   │  1. Cron job: Fetch /pending-onboarding            │
   │  2. Use Calendly API to send invite                │
   │  3. Listen to Calendly webhook                     │
   │  4. Update status via API                          │
   └─────────────────────────────────────────────────────┘

7️⃣ ANALYTICS DASHBOARD (/analytics)
   └─> Real-time tracking:
       • Total Revenue
       • Sales by Tier
       • Pending Onboarding Queue
       • Recent Sales
       • Session Booking Status

```

---

## 📡 API Endpoints Ready For Your Use

### **1. Get Pending Clients**
```bash
GET https://[project-id].supabase.co/functions/v1/make-server-61755bec/pending-onboarding

Response:
{
  "pendingClients": [
    {
      "saleId": "sale_...",
      "customerName": "Jane Doe",
      "customerEmail": "jane@example.com",
      "serviceTier": "AVERRA Signature",
      "brandName": "Jane's Beauty Studio",
      // ... all other data
    }
  ],
  "totalPending": 3
}
```

### **2. Update Onboarding Status**
```bash
POST https://[project-id].supabase.co/functions/v1/make-server-61755bec/update-onboarding-status

Body:
{
  "saleId": "sale_1234567890_abc123",
  "strategySessionBooked": true,
  "calendlyEventId": "evt_abc123",
  "onboardingStatus": "session_booked"
}
```

### **3. Get All Sales Data**
```bash
GET https://[project-id].supabase.co/functions/v1/make-server-61755bec/sales-data

Response:
{
  "sales": [...],
  "totalSales": 15,
  "totalRevenue": 29970.00
}
```

---

## 🎯 Calendly Email Template

Use this template when sending booking invitations:

```html
Subject: ✨ Schedule Your AVERRA Strategy Session

Hi {{customerName}},

Welcome to AVERRA! 🎨

Your payment for {{serviceTier}} has been confirmed (${{totalPrice}}).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 NEXT STEP: Book Your Strategy Session

Your strategy session is where we:
• Review your brand intake responses
• Define your visual direction
• Align on your {{goals}}
• Create a custom project timeline

Click here to schedule: {{calendlyLink}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 WHAT WE KNOW ABOUT YOUR BRAND:

Business: {{brandName}}
Industry: {{industry}}
Target Audience: {{targetAudience}}
Instagram: {{instagramHandle}}
Website: {{website}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before your session, think about:
• 3 brands you admire and why
• Colors/styles that resonate with you
• Any specific must-haves for your brand

Looking forward to creating something beautiful together!

— The AVERRA Team

P.S. If you have questions, just reply to this email.
```

---

## 🔄 Onboarding Status States

Track client progress through these states:

```
payment_complete       → Just paid, needs to book session
session_booked         → Calendly booking confirmed
session_completed      → Strategy session done
production_started     → Design work in progress  
first_draft_sent       → Initial concepts delivered
revisions_in_progress  → Client feedback being incorporated
final_delivered        → Project complete
```

Update these via the `/update-onboarding-status` endpoint as client progresses.

---

## 🎨 What You Can Do Next

**Immediate:**
- View real-time data at `/analytics`
- Test a purchase and see it appear
- Check `/pending-onboarding` endpoint

**Soon:**
- Set up Zapier/Make automation
- Configure Calendly webhook listener
- Customize email templates
- Add Google Calendar sync

**Later:**
- Add SMS reminders (Twilio integration ready)
- Create client portal for project updates
- Add automated follow-ups at each stage
- Build reporting dashboard for monthly metrics

---

All backend infrastructure is production-ready! 🚀
