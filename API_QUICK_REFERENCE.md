# 🚀 AVERRA API Quick Reference

## Base URL
```
https://[your-project-id].supabase.co/functions/v1/make-server-61755bec
```

## Headers (All Requests)
```
Authorization: Bearer [SUPABASE_ANON_KEY]
Content-Type: application/json
```

---

## 📊 Analytics & Sales Endpoints

### Get Analytics Summary
```http
GET /analytics-summary
```
**Returns:** Quiz completions, tier recommendations, user actions

---

### Get All Sales Data
```http
GET /sales-data
```
**Returns:**
```json
{
  "sales": [...],
  "totalSales": 15,
  "totalRevenue": 29970.00,
  "lastUpdated": "2026-03-05T10:30:00Z"
}
```

---

### Get Pending Onboarding Clients ⭐
```http
GET /pending-onboarding
```
**Returns:** Clients who paid but haven't booked strategy session
```json
{
  "pendingClients": [
    {
      "saleId": "sale_...",
      "customerName": "Jane Doe",
      "customerEmail": "jane@example.com",
      "customerPhone": "+1234567890",
      "serviceTier": "AVERRA Signature",
      "totalPrice": "2997.00",
      "brandName": "Jane's Beauty Studio",
      "industry": "Beauty & Wellness",
      "targetAudience": "Women 25-45",
      "goals": "Expand online presence",
      "instagramHandle": "@janesbeauty",
      "website": "janesbeauty.com",
      "businessStage": "Established",
      "brandPerception": "Affordable but professional",
      "onboardingStatus": "payment_complete",
      "strategySessionBooked": false,
      "createdAt": "2026-03-05T10:30:00Z"
    }
  ],
  "totalPending": 3
}
```

---

## 🔄 Onboarding Management

### Update Onboarding Status ⭐
```http
POST /update-onboarding-status
```
**Body:**
```json
{
  "saleId": "sale_1234567890_abc123",
  "strategySessionBooked": true,
  "calendlyEventId": "evt_abc123",
  "onboardingStatus": "session_booked"
}
```
**Use Cases:**
- Mark strategy session as booked
- Track Calendly event ID
- Update onboarding progress

**Status Options:**
- `payment_complete` - Initial state after payment
- `session_booked` - Calendly booking confirmed
- `session_completed` - Strategy session done
- `production_started` - Design work began
- `final_delivered` - Project complete

---

## 💳 Stripe Integration

### Get Stripe Config
```http
GET /stripe-config
```
**Returns:** Stripe publishable key for frontend

---

### Create Checkout Session
```http
POST /create-checkout-session
```
**Body:**
```json
{
  "items": [
    {
      "id": "averra-signature",
      "name": "AVERRA Signature",
      "price": 2997,
      "type": "service"
    }
  ],
  "customerInfo": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1234567890"
  },
  "brandIntakeData": {
    "businessName": "Jane's Beauty Studio",
    "servicesOffering": "Beauty & Wellness",
    // ... all brand intake fields
  },
  "successUrl": "https://yoursite.com/success?session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "https://yoursite.com/cart"
}
```
**Returns:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

---

### Webhook Handler (Stripe)
```http
POST /webhooks/stripe
```
**Headers Required:**
```
stripe-signature: [webhook signature]
```
**Handles Events:**
- `checkout.session.completed` - Main event, creates sale record
- `payment_intent.succeeded` - Alternative payment flow

---

## 📧 Communication

### Submit Contact Form
```http
POST /contact-submission
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I have a question about..."
}
```

---

### Send Order Confirmation
```http
POST /send-order-confirmation
```
**Body:**
```json
{
  "customerInfo": {
    "name": "Jane Doe",
    "email": "jane@example.com"
  },
  "items": [...],
  "totalPrice": "2997.00",
  "paymentIntentId": "pi_..."
}
```

---

## 🎯 Quiz Tracking

### Track Quiz Completion
```http
POST /track-quiz-completion
```
**Body:**
```json
{
  "recommendedTier": "AVERRA Signature",
  "answers": [3, 4, 2, 5, 4, 3],
  "timestamp": "2026-03-05T10:30:00Z"
}
```

---

### Track User Action
```http
POST /track-action
```
**Body:**
```json
{
  "actionType": "button_click",
  "actionData": {
    "button": "View Services",
    "page": "homepage"
  },
  "timestamp": "2026-03-05T10:30:00Z"
}
```

---

## 🎨 Brand Intake

### Submit Brand Intake Form
```http
POST /submit-brand-intake
```
**Body:**
```json
{
  "tier": "AVERRA Signature",
  "fullName": "Jane Doe",
  "businessName": "Jane's Beauty Studio",
  "instagramHandle": "@janesbeauty",
  "website": "janesbeauty.com",
  "servicesOffering": "Beauty & Wellness",
  "businessStage": ["Established", "Looking to scale"],
  "misalignedAspects": ["Pricing doesn't reflect quality"],
  "brandPerception": "Affordable but professional",
  "idealClient": "Women 25-45 seeking luxury services",
  "futureGoals": ["Expand online presence", "Launch product line"],
  "aiStance": "Open to AI for efficiency",
  "urgentNotes": "Need to launch by Q2",
  "customerEmail": "jane@example.com"
}
```

---

## 💰 Discounts

### Apply Discount Code
```http
POST /apply-discount
```
**Body:**
```json
{
  "discountCode": "LAUNCH25"
}
```
**Valid Codes:**
- `LAUNCH10` - 10% off
- `LAUNCH25` - 25% off
- `LAUNCH50` - 50% off

---

## 🔥 Most Important Endpoints For Automation

### 1. Poll for new clients
```bash
curl -X GET \
  https://[project-id].supabase.co/functions/v1/make-server-61755bec/pending-onboarding \
  -H "Authorization: Bearer [ANON_KEY]"
```

### 2. Send them Calendly invitation
(Use data from response to personalize email)

### 3. Update when they book
```bash
curl -X POST \
  https://[project-id].supabase.co/functions/v1/make-server-61755bec/update-onboarding-status \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '{
    "saleId": "sale_...",
    "strategySessionBooked": true,
    "calendlyEventId": "evt_...",
    "onboardingStatus": "session_booked"
  }'
```

---

## 🧪 Testing

### Test Stripe Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

### Test Webhook Locally
```bash
stripe listen --forward-to localhost:3000/webhooks/stripe
```

---

## 📱 Environment Variables Needed

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  (for production webhooks)
SUPABASE_URL=https://[project].supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...  (for emails)
```

---

## ✅ Status Codes

- `200` - Success
- `400` - Bad Request (missing fields)
- `401` - Unauthorized (check API key)
- `404` - Not Found
- `500` - Server Error

---

## 🎯 Quick Start Automation Flow

```javascript
// 1. Fetch pending clients (run every hour)
const response = await fetch(
  'https://[project].supabase.co/functions/v1/make-server-61755bec/pending-onboarding',
  { headers: { 'Authorization': 'Bearer [ANON_KEY]' } }
);
const { pendingClients } = await response.json();

// 2. For each client, send Calendly email
for (const client of pendingClients) {
  await sendCalendlyEmail({
    to: client.customerEmail,
    name: client.customerName,
    tier: client.serviceTier,
    calendlyLink: getCalendlyLinkForTier(client.serviceTier)
  });
}

// 3. When Calendly webhook fires, update status
await fetch(
  'https://[project].supabase.co/functions/v1/make-server-61755bec/update-onboarding-status',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer [ANON_KEY]',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      saleId: client.saleId,
      strategySessionBooked: true,
      calendlyEventId: calendlyEvent.id,
      onboardingStatus: 'session_booked'
    })
  }
);
```

---

**Need help?** All endpoints are tested and production-ready! 🚀
