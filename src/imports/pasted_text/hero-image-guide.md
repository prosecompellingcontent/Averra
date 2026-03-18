Use the Image Itself (Not a Background Fill)

Right now your hero likely works like this:

Rectangle
→ Fill → Image
→ Fill mode = Fill

That always crops the image.

Instead:

Delete the rectangle image fill.

Drag the actual image file into the frame.

Resize the image proportionally.

This prevents forced cropping.

Step 2 — Scale the Image Correctly

Select the image and set constraints to:

Left + Right
Top

Or:

Scale

Then resize the width to the mobile frame.

Example:

Frame width: 390
Image width: 390
Height adjusts automatically

Now the entire image remains visible.

Step 3 — Allow the Section to Grow

Your hero frame is probably locked to something like:

390 × 700

But your image might actually be:

390 × 900

So Figma crops it.

Instead:

Make the hero section auto-height.

Just drag the frame bottom until the full image shows.

Example:

390 × 980

Luxury sites actually do this a lot on mobile.

Step 4 — Move Your Text On Top

Your text:

Beauty's New Blueprint
Hesitation Is Expensive
Start Your Brand Quiz

should be absolutely positioned over the image, not inside the image frame.

Structure it like this:

Hero Frame
 ├── Image
 ├── Text Container
 └── Button

Then center the text.

What Your Mobile Layout Should Become

Instead of:

[ Cropped Image ]

You’ll have:

[ FULL IMAGE ]
        Beauty's New Blueprint
        Hesitation Is Expensive
        [ Start Your Brand Quiz ]

Exactly like desktop.

One Important AVERRA Detail

Your hero image is portrait-oriented, which actually works well for mobile. If you let the height expand, the composition will stay intact.

The mistake most people make is forcing mobile images into short hero sections.

For beauty brands, taller heroes look more premium.