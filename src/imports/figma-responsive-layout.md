what you want is called responsive layout. You don’t want to manually redesign everything — you want Figma to adapt the desktop layout to tablet and mobile sizes. Here’s the practical workflow designers use.

1. Use Auto Layout (Most Important Step)

Auto Layout allows elements to resize and stack automatically.

How to apply it

Select a section or frame.

Press Shift + A

Figma adds Auto Layout.

Now elements inside the frame will:

stack vertically or horizontally

adjust spacing automatically

resize based on screen width.

For example:

Desktop layout:

[ Image ] [ Text ]

Mobile layout (auto layout wraps):

[ Image ]
[ Text ]
2. Create Device Frames

Instead of one canvas, you design multiple breakpoints.

Common ones:

Desktop
1440px

Tablet
768px

Mobile
375px or 390px

How to create

Press F

Choose device presets on the right panel.

Examples:

iPhone 14 (390px)

iPad (768px)

3. Duplicate Your Desktop Frame

Don’t redesign from scratch.

Select the desktop frame

Duplicate it

Resize the duplicate to mobile width

Now adjust spacing.

4. Change Layout Direction for Mobile

Some sections should change from horizontal to vertical.

Example:

Desktop:

[ Text ]   [ Image ]

Mobile:

[ Image ]
[ Text ]

To do this:

Select Auto Layout frame

Change direction to vertical

5. Adjust Constraints

Constraints tell Figma how elements behave when resizing.

Select an element → Right panel → Constraints

Common settings:

Left + Right → stretches across screen
Center → stays centered
Scale → scales with frame

Example:

Navigation bar:

Menu        Logo        Cart

Set:

Menu → Left
Logo → Center
Cart → Right

So it stays aligned on all devices.

6. Test by Resizing the Frame

Drag the frame width smaller.

If your layout is correct:

text wraps

images resize

elements stack properly

7. Mobile-Specific Adjustments

Even with responsive layout, you should tweak for mobile.

Typical changes:

Desktop:

3 columns

Mobile:

1 column

Desktop hero text:

72px

Mobile hero text:

36px–42px

Spacing also increases vertically.

8. Use Figma’s Preview

Click Present (▶).

Then toggle between:

Desktop

Tablet

Mobile frames

This shows the flow.

Quick Example for Your Site

Desktop gallery:

[ Image ] [ Image ] [ Image ]

Tablet:

[ Image ] [ Image ]
[ Image ]

Mobile:

[ Image ]
[ Image ]
[ Image ]
One Important Tip for Your AVERRA Layout

Since your site is visual gallery driven, use:

Auto Layout + Fill Container

for images.

This lets the gallery scale across screen sizes.