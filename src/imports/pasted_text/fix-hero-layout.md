the image is showing fully, but the hero container is still fixed to the viewport height, so the extra image height is getting pushed above and below the visible area, creating those black gaps.

You need to make the hero container grow with the image instead of forcing the image to fit the container.

Here’s the correct fix.

Fix the Mobile Hero Layout in Figma
1. Select the Hero Frame

The frame that contains:

the image

“Beauty’s New Blueprint”

the button

Right now its height is probably something like:

390 × 844

That’s locking the image to screen height.

2. Let the Frame Grow

Instead of fixed height:

Drag the bottom of the hero frame down until the entire image is visible.

Example:

390 × 1050

or whatever the image height is.

Now the frame matches the image.

3. Center the Text Over the Image

Your structure should look like this:

Hero Frame
 ├── Image
 ├── Overlay Text
 └── CTA Button

Then position the text group centered vertically over the image, not centered in the frame.

4. Check the Image Constraints

Select the image and set constraints to:

Left + Right
Top

This ensures the image:

stretches to mobile width

keeps full height

never crops.

Why the Black Areas Appeared

Right now your layout behaves like:

Viewport
 ├── empty space
 ├── image center
 └── empty space

because the hero is trying to center the image inside a fixed-height container.

Instead you want:

Hero Frame
 └── Full Image
      └── Text overlay
What the Final Mobile Hero Should Look Like

You should see:

[ FULL IMAGE ]

Beauty’s New Blueprint
Hesitation Is Expensive
[ Start Your Brand Quiz ]

(no large black bars)
One Small Improvement for AVERRA

Your navbar is currently sitting on a black bar above the image.

A more premium layout is:

Navbar over image

Like:

[ AVERRA     ABOUT     CONTACT ]
           (on top of image)

Luxury beauty sites almost always do this.