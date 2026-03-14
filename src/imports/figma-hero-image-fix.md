Your “jump” is almost always Figma resizing the viewport (device chrome / address bar) while your hero image is set up in a way that recomputes as “fit/contain” instead of staying “cover.”
Fix it by making the hero image a background fill on a rectangle that’s pinned to all 4 sides of the top-level frame, and preview with Fit width / 100% (not Fit).

Fix the prototype so the image always “covers” the device
1) Make the top-level screen frame truly “the device”

Select your top-level mobile frame (the whole screen).

In Prototype panel:

Device: pick the phone you’re designing for.

Scale: set to Fit width (or 100%).
✅ Avoid Fit (that’s the #1 cause of “jumping” because it changes based on viewport height).

2) Convert the hero image into a pinned background (this stops jumping)

Do this for the section that’s freaking out (your hero area).

Draw a Rectangle exactly covering the hero area (or the whole frame if it’s a full-screen hero).

Apply your image as the rectangle’s Fill:

Right panel → Fill → choose Image

Set image mode to Fill (NOT Fit).

Adjust the crop once to the framing you want.

With that rectangle selected:

Set Constraints to Left + Right + Top + Bottom

Turn Clip content ON on the parent frame (hero frame or page frame).

Put your text/buttons above that rectangle and lock the rectangle (optional but helps).

✅ This makes your hero behave like background-size: cover; and it won’t reflow when the viewer height changes.

3) If you’re using Auto Layout anywhere in the hero

Auto Layout can cause weird re-measuring if the image layer is “Hug contents” or has fixed sizing.

Select the hero container (the frame holding image + text):

Set Height to Fixed (or explicitly match the screen if it’s a full-screen hero)

Select the image rectangle inside:

Width: Fill container

Height: Fill container

4) Kill layout shift from overlays (cookie bar)

Your cookie banner can change the available height and make the image recalc.

In prototype:

Make the cookie banner an Overlay (Prototype → “Open overlay”)

Enable Fix position when scrolling

Don’t let it be part of the normal layout stack (otherwise it pushes content / changes heights)

Quick sanity checks (these cause exactly your screenshots)

Image layer is an Image object (not a filled rectangle) → convert to rectangle background fill.

Prototype viewer is on Fit → switch to Fit width / 100%.

Parent frame Clip content is OFF → turn it ON.

Hero frame/image constraints aren’t pinned on all sides → set L/R/T/B.