VERVIEW OF WHAT WE ARE BUILDING

When client pays:

Stripe
→ sends webhook
→ Supabase verifies it
→ Supabase updates database
→ Supabase sends onboarding email
→ Email includes correct Calendly link
→ Client books
→ Calendly writes to Google Calendar
→ You wake up and execute

That’s the system.

PHASE 1 — PREP YOUR STRIPE PRODUCTS CORRECTLY
Step 1: Go to Stripe Dashboard

Products → Create Product

For each tier:

Create product:

Name:
AVERRA Essentials – Starter Brand Kit

Price:
$100 (or your current price)

One-time payment.

Then add metadata:

product_type = custom_service
tier = essentials

Repeat for:

Signature

Muse

Each with correct tier metadata.

This matters for automation routing.

PHASE 2 — CREATE SUPABASE DATABASE TABLES

Go to Supabase → Table Editor → Create Table

Create table:

Table: clients

Fields:

id (uuid, primary key)
email (text)
full_name (text)
tier (text)
alignment_id (text)
payment_status (text)
created_at (timestamp)

Create table:

Table: brand_alignment_forms

id (uuid, primary key)
full_name
business_name
instagram
services
business_stage
brand_misalignment
brand_feel
ideal_client
future_plans
ai_stance
urgent_notes
payment_status
created_at

This table stores pre-payment data.

PHASE 3 — CREATE STRIPE WEBHOOK ENDPOINT IN SUPABASE

Go to Supabase → Edge Functions

Click “Create new function”

Name it:

stripe-webhook

Supabase generates URL:

https://yourproject.supabase.co/functions/v1/stripe-webhook

Copy this.

PHASE 4 — REGISTER WEBHOOK IN STRIPE

Go to Stripe:

Developers → Webhooks → Add endpoint

Paste your Supabase function URL.

Select event:

checkout.session.completed

Click Add Endpoint.

Stripe generates:

Webhook Signing Secret

Copy it.

PHASE 5 — ADD ENVIRONMENT VARIABLES IN SUPABASE

Go to:

Supabase → Settings → Environment Variables

Add:

STRIPE_SECRET_KEY = your live secret key
STRIPE_WEBHOOK_SECRET = webhook signing secret

Save.

PHASE 6 — WRITE THE WEBHOOK LOGIC

Inside Supabase Edge Function, logic should do:

Verify Stripe signature

Check event type

Confirm payment_status = paid

Extract:

email

metadata.tier

metadata.alignment_id

Update database

Send onboarding email

Pseudo-logic:

IF event.type = checkout.session.completed
AND payment_status = paid

THEN

Update brand_alignment_forms
Set payment_status = paid

Insert into clients table:
email
tier
alignment_id

Send onboarding email with correct Calendly link.

PHASE 7 — SET UP CALENDLY

Create Calendly account.

Connect Google Calendar.

Create 3 event types:

AVERRA Essentials Strategy (60 min)
AVERRA Signature Strategy (75 min)
AVERRA Muse Executive Strategy (90 min)

Each event type:

Auto-add Zoom link

Send reminders

Sync with Google Calendar

Copy each event link.

PHASE 8 — ROUTE CLIENTS TO CORRECT CALENDLY LINK

In your webhook email logic:

If tier = essentials
→ include Essentials Calendly link

If tier = signature
→ include Signature link

If tier = muse
→ include Muse link

This is automatic tier routing.

PHASE 9 — BUILD BRAND ALIGNMENT FORM FLOW

When client clicks Get Started:

Form submits to Supabase.

After submit:
Redirect to Stripe Checkout.

When creating Stripe Checkout session, include metadata:

tier
alignment_id
client_email

This connects payment to form.

PHASE 10 — TEST EVERYTHING

Use Stripe Test Mode.

Complete test payment.

Confirm:

Webhook fires
Database updates
Email sends
Calendly link correct
Booking appears on Google Calendar

If all of that works:
Switch to Live Mode.

WHAT IS NOW FULLY AUTOMATIC

Client fills form
Client pays
Webhook triggers
Email sends
Client books
Calendar updates

You touch nothing.

WHAT YOU DO DAILY

Wake up.
Open Google Calendar.
Execute sessions.

No admin chaos.

WHAT YOU DO NOT NEED

Zapier
Manual emails
Manual confirmation
Custom calendar build
Stripe scheduling (doesn’t exist)

FINAL STRUCTURE MAP

Stripe = Payment Engine
Webhook = Event Trigger
Supabase = Logic + Data Storage
Calendly = Scheduling Engine
Google Calendar = Execution View

That is your infrastructure.