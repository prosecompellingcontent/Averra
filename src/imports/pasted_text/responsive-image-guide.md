Create:

Desktop Frame

1440px or 1920px width

Mobile Frame

375px or 390px width

Example:

Desktop
1440 × 900

Mobile
390 × 844

Then you manually reposition images for mobile.

Luxury brands do this because composition changes completely on mobile.

2. Re-Crop the Image for Mobile

Instead of shrinking the desktop image, do this:

Duplicate the image

Place it inside the mobile frame

Double click the image

Move it to keep the important part visible (usually the face)

This mimics what object-fit: cover does in code.

3. Use Figma Constraints

Set the image constraints so it behaves like a responsive element.

Select the image → Right sidebar → Constraints:

Left + Right
Top

Or for hero images:

Scale

This lets the image expand across the screen properly.

4. Use Fill Instead of Fixed Images

For hero sections:

Draw a rectangle

Apply image as Fill

Set fill mode to Fill

This allows you to move the crop without resizing the frame.

This is the closest equivalent to object-fit: cover.

5. Design Mobile Images Slightly Taller

Desktop images usually work like:

16:9

But mobile should be:

4:5
or
3:4

Example:

Desktop hero
1920 × 1080

Mobile hero
1080 × 1350

That keeps the model’s face centered on mobile.

6. Prototype to Test

In Figma:

Prototype → iPhone 14

Scroll through and see how images feel on mobile.

Sometimes images that look fine on desktop feel too zoomed or too cropped on phones.

What I Recommend for AVERRA

Because your brand is editorial beauty, use this structure:

Desktop

wide hero images

full body or environment shots

Mobile

tighter crops

face or service focus

This will make the site feel far more premium.