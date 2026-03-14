Fix it by (1) using frames for common mobile widths, (2) setting image scaling to Fill, and (3) using constraints / auto-layout so the hero section can stretch to the frame height. In code, the equivalent is min-height: 100vh + object-fit: cover.

1) Fix it in FIGMA (so it previews correctly)
A) Design for viewports (not “devices”)

Create separate top-level frames for your breakpoints, e.g.:

Mobile: 375×812 (iPhone X-ish), 390×844 (iPhone 14-ish)

Small mobile: 360×800 (common Android)

Tablet: 768×1024

Desktop: 1440×900

In Figma:

Press F → pick a preset (or set custom width/height)

Name them like Mobile-375, Mobile-390, etc.

B) Make the hero image actually fill the frame

Select the hero image layer:

In the right panel → Fill:

If it’s an Image Fill, set it to Fill (not Fit)

If it’s an <Image> inside a frame:

Set width/height behavior to Fill container (or equivalent) if you’re using Auto Layout

C) Use constraints so it stretches on different heights

Select the hero container frame (the section holding the image + text):

Constraints: set to Left & Right and Top & Bottom

Avoid hard-coded hero heights like 700px inside the design. Prefer:

Hero section frame height = the device frame height, or

Auto-layout with the image set to fill remaining space

D) Prototype preview settings (this matters)

In Prototype panel:

Device: choose a phone (for preview chrome)

Scale: prefer Actual size or Fit width

“Fit” can visually hide layout issues; “Actual size” reveals them.

2) Fix it in CODE (because Figma → build can still break)

That “Fixed! … object-cover …” message suggests your builder/dev already changed image behavior. The remaining black gaps usually mean the container isn’t 100vh (or something is forcing extra padding/height).

Use a hero pattern like this:

<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1" />

<section class="hero">
  <img class="hero__img" src="/path/to/hero.jpg" alt="" />
  <div class="hero__overlay">
    <h1>Beauty’s New Blueprint</h1>
    <p>Hesitation Is Expensive.</p>
    <button>Start your brand quiz</button>
  </div>
</section>
/* styles.css */
.hero {
  position: relative;
  min-height: 100svh; /* better on mobile than 100vh */
  width: 100%;
  overflow: hidden;
}

.hero__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__overlay {
  position: relative;
  z-index: 1;
  min-height: 100%;
  display: grid;
  place-content: center;
  text-align: center;
  padding: 24px;
}

Key points

min-height: 100svh prevents “mobile address bar” viewport weirdness.

Absolutely-positioned image with object-fit: cover guarantees no letterboxing.

If you have a fixed header/cookie bar, ensure the hero isn’t also getting extra padding/margins that create those black bands.

3) The most common “why is there black space?” checklist

Hero wrapper has fixed height in px → change to min-height: 100svh.

Image uses contain / fit → change to cover / fill.

Parent container has padding-top/padding-bottom or a spacer div.

You’re using 100vh on iOS Safari → use 100svh (or 100dvh).

Header is position: fixed and you added a spacer that’s too tall.