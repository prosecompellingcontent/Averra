My website crashes or freezes on mobile, but I do NOT want any visual changes to the design, layout, spacing, typography, or styling.

The desktop version works fine.

Your task is to improve mobile performance and stability without altering visual appearance.

Constraints:

Do NOT change layout structure

Do NOT change fonts

Do NOT change spacing

Do NOT simplify the design visually

Do NOT remove luxury effects unless absolutely required

Maintain pixel-perfect visual output

Focus only on:

Performance optimization

Memory reduction

Render efficiency

Asset compression

Code-level fixes

Audit for:

Oversized images (suggest optimal compression without quality loss)

Improper image formats (recommend WebP/AVIF if supported)

Excessive DOM depth

Unnecessary wrapper divs

Heavy blur/drop-shadow rendering cost

Large background videos (optimize instead of remove)

Unoptimized SVG files

Duplicate components

Inefficient animations

Render-blocking scripts

Layout thrashing

Improper overflow handling

Fixed-width containers breaking mobile memory

Provide:

Immediate no-visual-impact fixes

Code-level performance improvements

Image size thresholds for mobile (max KB per image)

Total recommended page weight for smooth mobile load

Memory-safe animation practices

Lazy loading strategy

GPU acceleration recommendations (if applicable)

Assume this is a high-end, minimal, editorial luxury brand. The aesthetic must remain intact.

Now let me challenge something:

If your mobile is crashing, that’s not a “design” issue.
It’s almost always:

• Too many 3–5MB images
• Background video not compressed
• 200+ layers inside nested auto layout
• Blur effects stacking
• No lazy loading
• Exporting 2x when 1x is enough
• Heavy prototype animations

You can preserve the exact same look while reducing load by 40–70%.