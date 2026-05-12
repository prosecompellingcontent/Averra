CONTINUE BUILDING THE AVERRA MEMBERSHIP ECOSYSTEM.

IMPORTANT:
The language across the entire experience should be simple, clear, and easy to understand.
Do NOT use overly corporate, technical, or intellectual wording.
The user should never feel confused or overwhelmed.

Everything should feel:
— Smooth
— Modern
— Premium
— Easy to navigate
— Easy to read
— Emotionally warm
— Organized

SECTION 1:
USE THE EBOOK CONTENT PROVIDED.

The ebook is:
“The Gold Standard: Building Beyond The Chair”

The ebook content has already been uploaded and should become part of the Gold Standard membership experience.

DO NOT treat this like a downloadable PDF only.

Instead:
Build this as a full digital reading experience inside the portal.

THE EBOOK SHOULD INCLUDE:
— Continue reading
— Save progress
— Bookmark pages
— Read aloud option
— Fullscreen reading
— Mobile reading mode
— Smooth page transitions
— Notes/highlights
— Chapter navigation
— Reading progress bar
— Continue where you left off

The ebook should open INSIDE the ecosystem.

The experience should feel like:
Apple Books × Kindle × Masterclass

NOT:
A basic PDF viewer.

The ebook should become:
— The core framework
— The founder playbook
— The business curriculum
— The main learning experience inside Gold Standard

SECTION 2:
REAL-TIME COMMUNITY SYSTEM

Supabase is already connected to the backend.

Build the community as a REAL-TIME LIVE MEMBER NETWORK.

THIS IS NOT A STATIC FORUM.

MEMBERS SHOULD BE ABLE TO:
— Post in real time
— Comment in real time
— Like posts in real time
— See active members live
— Network with each other
— Message each other directly
— Receive live updates
— See typing indicators
— See read receipts for messages
— Receive notifications
— Edit/delete their own posts
— Upload profile photos
— View member profiles

COMMUNITY FEATURES:
— Live feed
— Live comments
— Live likes
— Online/offline indicators
— Direct messaging
— Group discussions
— Pinned posts
— Saved posts
— Search
— Member tags
— Notifications center

DIRECT MESSAGES:
Members should be able to:
— Start conversations
— Continue conversations
— Send messages instantly
— Send emojis
— Send images/files if possible
— See when someone is typing
— See when messages are delivered/read

USE SUPABASE REALTIME FOR:
— Posts
— Comments
— Likes
— Notifications
— DMs
— Typing indicators
— Active members

SECTION 3:
TEXT INPUT COLOR FIX

CURRENT ISSUE:
The text is too light against the white background.

FIX:
Every text field across the ecosystem should use:

#251218

This includes:
— Input fields
— Community posts
— Comments
— DMs
— Search bars
— Billing fields
— Login fields
— Signup forms
— Notes
— Chat boxes

Darken the typing areas enough for readability while keeping the luxury aesthetic.

SECTION 4:
DUPLICATE EMAIL DETECTION

ON SIGNUP:
If someone enters an email that already exists in the database:

DO NOT create another account.

DISPLAY MESSAGE:

“This email is already enrolled.
Please login using your existing account.”

UNDER THAT:
Display hyperlink:

“Forgot Password?”

WHEN CLICKED:
Redirect user to:
/members/login

SECTION 5:
FORGOT PASSWORD FLOW

CREATE A COMPLETE PASSWORD RESET EXPERIENCE.

FLOW:

STEP 1:
User clicks:
“Forgot Password?”

Redirect them to:
NEW PASSWORD RESET PAGE

THIS PAGE INCLUDES:
— Email input field
— Continue button

TEXT:
“Enter the email connected to your membership account.”

WHEN USER PRESSES CONTINUE:
Automatically send verification email.

AFTER EMAIL IS SENT:
Redirect user to:
CONFIRMATION CODE SCREEN

THIS SCREEN SHOULD INCLUDE:
— Code input fields
— Continue button

TEXT:
“We sent a confirmation code to your email.”

DISPLAY:
“Didn’t receive a code?”

UNDER THAT:
DISPLAY:
— Resend Code
— Change Email

IF USER CLICKS:
“Change Email”

Allow them to:
— Edit email
— Send new confirmation

ONCE CODE IS VERIFIED:
Redirect user to:
RESET PASSWORD PAGE

THIS PAGE INCLUDES:
— New Password
— Confirm New Password

PASSWORD RULES:
— Minimum six characters
— Must include special character

AFTER PASSWORD RESET:
Redirect user back to:
/members/login

DISPLAY:
“Your password has been updated successfully.”

SECTION 6:
HELP LINK

UNDER:
“Don’t have an account? Join AVERRA”

ADD:
“Need Help?”

THIS SHOULD BE A HYPERLINK.

WHEN CLICKED:
Redirect user directly to:
CONTACT PAGE

SECTION 7:
SUPABASE AUTHENTICATION FLOW

SUPABASE IS ALREADY CONNECTED.

SETUP REQUIRED:
Authentication → URL Configuration

SITE URL:
https://averraaistudio.com

REDIRECT URLS:
— https://averraaistudio.com/members/reset-password
— https://averraaistudio.com/members/login
— https://averraaistudio.com/auth/callback
— https://averraaistudio.com/members/onboarding

This allows:
— Email confirmations
— Password resets
— Login callbacks
— Verification redirects
— Returning users back to the site automatically

SECTION 8:
STRIPE SETUP

Use Stripe for ALL payments.

ONE-TIME PAYMENTS:
Use for:
— eBook
— Brand Ready Visuals
— Digital products

RECURRING SUBSCRIPTIONS:
Use for:
— Blueprint Membership
— Gold Standard Membership

CREATE STRIPE PRODUCTS:
— The Blueprint
— The Gold Standard
— The Gold Standard eBook
— Brand Ready Visuals

THE BLUEPRINT:
$30/month founder pricing

THE GOLD STANDARD:
$75/month founder pricing

USE:
Stripe Checkout Sessions for one-time purchases.

USE:
Stripe Subscriptions for memberships.

SECTION 9:
STRIPE WEBHOOKS

Create Stripe webhooks using Supabase Edge Functions.

REQUIRED EVENTS:
— checkout.session.completed
— customer.subscription.created
— customer.subscription.updated
— customer.subscription.deleted
— invoice.paid
— invoice.payment_failed

THESE EVENTS SHOULD:
— Activate memberships
— Unlock portal access
— Unlock the community
— Unlock the ebook
— Handle failed payments
— Handle cancellations
— Update billing status
— Lock/unlock content automatically

SECTION 10:
EBOOK PURCHASE FLOW

FLOW:

User buys ebook →
Stripe payment succeeds →
Webhook fires →
Supabase updates database →
Resend sends email →
User receives:
“Open Your Library”

WHEN CLICKED:
Redirect user back to:
The internal ebook library inside the portal.

DO NOT immediately download a PDF.

SECTION 11:
MEMBERSHIP ACTIVATION FLOW

FLOW:

User purchases membership →
Stripe subscription activates →
Webhook fires →
Supabase updates:
membership_status = active
membership_type = blueprint OR gold_standard

THEN:
— Portal access unlocks
— Community unlocks
— Ebook unlocks
— Billing center unlocks
— Protected routes unlock

SECTION 12:
FAILED PAYMENT FLOW

IF:
invoice.payment_failed

THEN:
Automatically update:
membership_status = past_due

REDIRECT USER TO:
Billing page

DISPLAY:
“Your membership payment needs attention.”

OPTIONS:
— Update payment method
— Retry payment
— Cancel membership

SECTION 13:
DATABASE TABLES

CREATE DATABASE STRUCTURE FOR:

profiles
subscriptions
posts
comments
conversations
messages
notifications

The system should support:
— Real-time updates
— Live messaging
— Community activity
— Membership states
— Billing status
— Protected content
— Saved progress
— Ebook tracking

FINAL GOAL:
The AVERRA ecosystem should feel like:
A real private business network for beauty professionals.

Not just content.
Not just courses.
Not just a membership.

A live ecosystem where members:
— Learn
— Network
— Build relationships
— Grow businesses
— Communicate live
— Read the Gold Standard framework
— Stay connected
— Feel part of something real
