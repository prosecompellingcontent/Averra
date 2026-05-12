CONTINUE BUILDING THE AVERRA WEBSITE AND MEMBERSHIP ECOSYSTEM.

SECTION 1:
SERVICE PAGE HERO IMAGE

On the Services page:

Replace the current hero image with:

public/services-hero.png

Make sure:
— The image is fully responsive
— Properly optimized for mobile
— Maintains luxury/editorial cropping
— Does not stretch or distort
— Keeps text readable over the image

SECTION 2:
REMOVE ALL DASHES SITEWIDE

Remove all unnecessary dashes throughout the site.

THIS INCLUDES:
— Headings
— Pricing sections
— Navigation sections
— Membership descriptions
— Community sections
— Buttons
— Dashboard labels
— Service layouts

Replace the formatting with:
— Proper spacing
— Clean typography hierarchy
— Section dividers if needed
— Simpler visual separation

The site should feel cleaner and easier to read.

SECTION 3:
EBOOK SALES SECTION

AFTER THIS TEXT:

Building Beyond The Chair — by AVERRA

ADD:
A visual ebook cover image.

This should feel like:
— Premium
— Editorial
— High-end
— Cinematic

UNDER THE COVER DISPLAY:

The Gold
Standard

The eBook for beauty professionals who are done trading hours for money and ready to build something that actually scales.

DISPLAY PRICING:

$147
$97

DISPLAY:

Founder Pricing Limited Time

DISPLAY:
Instant access. Read it today.

SECTION 4:
EBOOK PURCHASE BUTTON

WHEN USERS CLICK:

“Get The Gold Standard”

Automatically redirect directly into Stripe Checkout.

DO NOT:
— Open another info page
— Open another modal
— Require extra navigation

FLOW:
Click button →
Stripe Checkout →
Payment complete →
Return to AVERRA ebook library

SECTION 5:
MEMBERSHIP BUTTON REDIRECTS

WHEN USERS CLICK:

“Join The Blueprint”

Redirect directly to:

```bash id="u2t5hm"
/enroll/blueprint
```

WHEN USERS CLICK:

“Join The Gold Standard”

Redirect directly to:

```bash id="j7k34s"
/enroll/goldstandard
```

SECTION 6:
POST ENROLLMENT FLOW

AFTER USERS COMPLETE:
— Enrollment
— Onboarding
— Payment

Automatically redirect directly into the portal.

DO NOT require users to login again unless they manually sign out.

FLOW:
Enrollment →
Stripe checkout →
Payment success →
Portal unlock →
Automatic authenticated session →
Redirect directly into portal dashboard

The user should already be logged in automatically.

SECTION 7:
PROFILE ICON + ACCOUNT SYSTEM

Add a profile icon throughout the ecosystem similar to:
Instagram + LinkedIn.

This should be accessible on:
— Mobile
— Desktop
— Dashboard
— Community pages
— Messaging pages

WHEN CLICKED:
Open profile/account dropdown.

ALLOW USERS TO:
— Edit username
— Change password
— Upload/change profile photo
— Edit profile information
— Update bio
— Logout
— Upgrade membership
— Downgrade membership
— View billing
— Manage notifications

SECTION 8:
PROFILE PHOTO UPLOADS

Users should be able to:
— Upload profile pictures
— Crop profile images
— Replace profile images
— Remove profile images

The experience should feel:
— Modern
— Mobile friendly
— Smooth
— Similar to LinkedIn or Instagram

SECTION 9:
MEMBERSHIP UPGRADES + DOWNGRADES

If a user upgrades or downgrades memberships during an active billing cycle:

The NEXT billing cycle should reflect the updated membership pricing automatically.

This must sync directly with Stripe subscriptions.

WHEN A USER CHANGES MEMBERSHIPS:
— Update Stripe subscription
— Update Supabase membership type
— Update portal permissions
— Update billing amount
— Update access rights

DO NOT:
Immediately charge unexpected pricing changes unless prorated intentionally.

SECTION 10:
MOBILE OPTIMIZATION

IMPORTANT:
Most users will be on mobile.

EVERYTHING must be fully mobile optimized.

THIS INCLUDES:
— Community feed
— Ebook reader
— Messaging
— Group chats
— Enrollment forms
— Billing pages
— Profile editing
— Dashboard layouts
— Sidebar navigation
— Stripe checkout redirects
— Read aloud ebook controls

MOBILE EXPERIENCE SHOULD FEEL:
— App-like
— Smooth
— Fast
— Thumb-friendly
— Clean
— Easy to navigate

SECTION 11:
EBOOK READER EXPERIENCE

Both:
— Standalone ebook buyers
— Gold Standard members

must use the SAME reader layout.

The reader should visually feel like:
Apple Books × Kindle × Modern Editorial Publication

NOT:
— A PDF dumped into a page
— Tiny text sections
— Blog posts
— Course modules

THE READER MUST INCLUDE:
— Progress bar
— Chapter navigation
— Continue reading
— Last scroll position
— Reading percentage
— Notes/highlights
— Read aloud voice feature
— Fullscreen mode
— Mobile reading mode
— Smooth transitions

WHEN USERS RETURN:
Automatically resume from:
— Last chapter
— Last reading position
— Last audio timestamp

SECTION 12:
MESSAGING + COMMUNITY EXPERIENCE

The messaging system should feel similar to:
Instagram + LinkedIn + Private Founder Network.

MEMBERS SHOULD BE ABLE TO:
— Send DMs
— Create group chats
— Search usernames
— View profiles
— Join discussions
— Share posts
— React to posts/messages
— See typing indicators
— See online status
— Receive notifications

USERNAMES SHOULD:
— Be unique
— Be searchable
— Display in comments
— Display in DMs
— Display in forums
— Display on profiles

EXAMPLES:
@jaylamay
@beautybyalex
@luxelashco

SECTION 13:
REAL-TIME SYSTEMS

Use Supabase Realtime for:
— Messages
— Group chats
— Comments
— Likes
— Notifications
— Active users
— Typing indicators
— Online/offline status

Everything should update LIVE without page refreshes.

FINAL GOAL:
The AVERRA ecosystem should feel like:
A luxury private founder network built specifically for beauty professionals.

The platform should feel:
— Alive
— Premium
— Interactive
— Community-driven
— Easy to use
— Mobile-first
— Modern
— Immersive

NOT:
Just another membership site.
