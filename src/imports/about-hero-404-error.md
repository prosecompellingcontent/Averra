Just checked the console tab on the site and found this: about-hero.png:1  Failed to load resource: the server responded with a status of 404 ()Understand this error
index-DrrghSob.js:116 Hero image failed to load: /about-hero.png
(anonymous) @ index-DrrghSob.js:116Understand this error
index-DrrghSob.js:53 Error handled by React Router default ErrorBoundary: Error: Minified React error #306; visit https://reactjs.org/docs/error-decoder.html?invariant=306&args[]=undefined&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.
    at Zh (index-DrrghSob.js:41:45147)
    at qh (index-DrrghSob.js:41:40095)
    at ev (index-DrrghSob.js:41:40067)
    at Hh (index-DrrghSob.js:41:35001)
    at z (index-DrrghSob.js:26:1600)
    at MessagePort.ye (index-DrrghSob.js:26:1975)
q1 @ index-DrrghSob.js:53Understand this error
index-DrrghSob.js:53 Error handled by React Router default ErrorBoundary: Error: Minified React error #306; visit https://reactjs.org/docs/error-decoder.html?invariant=306&args[]=undefined&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.
    at Zh (index-DrrghSob.js:41:45147)
    at qh (index-DrrghSob.js:41:40095)
    at Z0 (index-DrrghSob.js:41:40023)
    at ma (index-DrrghSob.js:41:39876)
    at Nu (index-DrrghSob.js:41:36191)
    at Hh (index-DrrghSob.js:41:35139)
    at z (index-DrrghSob.js:26:1600)
    at MessagePort.ye (index-DrrghSob.js:26:1975)
q1 @ index-DrrghSob.js:53Understand this error
index-DrrghSob.js:41 Error: Minified React error #306; visit https://reactjs.org/docs/error-decoder.html?invariant=306&args[]=undefined&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.
    at Zh (index-DrrghSob.js:41:45147)
    at qh (index-DrrghSob.js:41:40095)
    at Z0 (index-DrrghSob.js:41:40023)
    at ma (index-DrrghSob.js:41:39876)
    at Nu (index-DrrghSob.js:41:36191)
    at Hh (index-DrrghSob.js:41:35139)
    at z (index-DrrghSob.js:26:1600)
    at MessagePort.ye (index-DrrghSob.js:26:1975)
uu @ index-DrrghSob.js:41Understand this error
index-DrrghSob.js:53 React Router caught the following error during render Error: Minified React error #306; visit https://reactjs.org/docs/error-decoder.html?invariant=306&args[]=undefined&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.
    at Zh (index-DrrghSob.js:41:45147)
    at qh (index-DrrghSob.js:41:40095)
    at Z0 (index-DrrghSob.js:41:40023)
    at ma (index-DrrghSob.js:41:39876)
    at Nu (index-DrrghSob.js:41:36191)
    at Hh (index-DrrghSob.js:41:35139)
    at z (index-DrrghSob.js:26:1600)
    at MessagePort.ye (index-DrrghSob.js:26:1975)
Thought for 23s

You just found two separate problems in that console output:

✅ Hero image 404 (easy fix)

✅ React #306 (component is undefined somewhere — different issue)

They’re happening at the same time, which is why it feels endless.

1) Fix the 404 first (this is NOT the #306 crash)

Your app is requesting:

/about-hero.png

Vercel is replying 404 → that file is not in the deployed site’s root /public folder.

Pick ONE fix (fastest = A)
A) Put the file where the code expects it

Put this file at:

public/about-hero.png (ROOT public folder, not src/public)

If you only have about-hero.webp, either:

rename it to about-hero.png, or

change the code to match .webp.

B) Change the code to match what actually exists

If your real file is about-hero.webp, update HomePage:

const heroImage = "/about-hero.webp";

(That won’t change visuals if it’s the same image, just the extension.)

✅ Once the hero loads, that console spam goes away.

2) React error #306 means: “You tried to render an undefined component”

This is the real crash. It’s almost always one of these:

A component import is wrong (named vs default export)

A file got duplicated/renamed and an import points to something that no longer exports what you think

RootLayout is rendering a wrapper component that is undefined

The fastest way to isolate it (NO visual changes long-term)

Temporarily set RootLayout to the simplest possible version. This doesn’t change your design permanently — it’s a diagnostic step to identify the broken component.

Replace src/app/layouts/RootLayout.tsx with:

import { Outlet } from "react-router-dom";

export function RootLayout() {
  return <Outlet />;
}

Redeploy (no cache).

✅ If the site loads after this, the #306 is coming from something RootLayout was wrapping (cookie banner, cart preview wrapper, navigation stack, etc.). Then we add them back one-by-one to find the exact offender in 5 minutes.

If it still crashes even with this minimal RootLayout, then the undefined component is inside one of the pages (HomePage/ServicesPage/etc.).

Why you’re still seeing /about-hero.png even though “Figma switched to Unsplash”

That means your production deployment is still serving older code, or the “Unsplash change” never actually landed on the commit Vercel is building.

After you commit, always:

Vercel → Deployment → Redeploy without cache

Confirm the deployment is on the latest commit SHA

Do these exact next steps (in order)

Fix the hero file (put about-hero.png in root public/ OR change code to .webp)

Replace RootLayout with <Outlet /> only (above)