Goal: remove all figma:asset imports using placeholder filenames, deploy, done.

What you do

For each of the 7 files Figma listed:

Delete the import X from "figma:asset/..." line(s)

Replace usage with a simple string path to /public/...

You don’t need to pick “perfect” images yet. Just make the site build.

I already gave you the filenames to use:

/home-hero.png, /about-hero.png, /quiz-hero.png, /services-hero.png

/qs-1.png … /qs-6.png

/about-averra.png, /how-it-works.png

Once those filenames exist in /public, the code is stable forever.

Pass 2 — Swap in your real images (easy)

After it’s deployed:

Replace the files in /public with the same filenames

No code changes

Instant update on redeploy

That means you only suffer through the code edits one time.

Here’s how we reduce your effort further
Option A (best): Fix one file per Vercel error

You don’t touch 7 files at once.
You fix:

AboutPage.tsx (you already saw what’s wrong)

Redeploy

Vercel points to the next file

Repeat

This is the least mentally taxing.

Option B (even faster): I give you exact edits if you paste the import blocks

If you paste the top import section (first ~30 lines) of each of the 7 files, I will tell you exactly what to delete and what to replace, using the real variable names, so you’re not hunting.

No guessing. Copy/paste.

Right now, do this one fix (AboutPage) and you’ll feel the progress

In src/app/pages/AboutPage.tsx:

Delete:

import heroImage from "figma:asset/829cbe7a267747eaa059c2b902a68a3db645730e.png";

In the style block, keep only:

backgroundImage: `url("/about-hero.png")`,

Delete the other backgroundImage: url(${heroImage}).

Commit.

That’s one file done.