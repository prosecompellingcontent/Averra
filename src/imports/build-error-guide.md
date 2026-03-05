You Forgot a Closing Brace } or Parenthesis ) Above

Check lines 1–16 carefully.

You likely have:

An unclosed {

An unclosed (

An unfinished arrow function

A missing ; after a dynamic import

Or an invalid lazy() statement

You showed:

const MobileDebug = lazy(() => 
  import("@/app/components/MobileDebug")
    .then(m => ({ default: m.MobileDebug })));

This looks correct if and only if:

All parentheses close

There isn’t stray JSX above

There isn’t accidental JSX outside a component

2️⃣ You Accidentally Put Code Inside Another Function

Example of what breaks this:

const Something = () => {
  const MobileDebug = lazy(() => import(...))

export function HomePage() {   // ❌ illegal because you're still inside Something

If that’s happening, close the function before export:

const Something = () => {
  ...
};

export function HomePage() {
3️⃣ You Have JSX Outside a Component

Example:

<div>Test</div>   // ❌ illegal outside component

export function HomePage() {

If JSX exists before your export, move it inside the component.

4️⃣ Wrong File Type or Build Target

Make sure:

File is .tsx

You’re not mixing CommonJS (module.exports) and ES modules

No require() statements in the same file

🎯 What To Do Right Now

Open:

src/app/pages/HomePage.tsx

Then:

Step 1

Scroll to line 1.

Step 2

Check everything from line 1–16.

You're looking for:

Missing }

Missing )

Unclosed >

A function that never ends

JSX sitting outside a component

🔥 Quick Debug Trick

Temporarily comment out everything above the export:

// comment lines 1-16

export function HomePage() {
  return <div>Test</div>
}

If it builds → problem is above.
If it still fails → something else is structurally wrong.

⚠️ One More Important Thing

You are deploying on Vercel, but your build script is:

> @figma/my-make-file@0.0.1 build
> vite build

This means you’re exporting a Figma/Vite project, not a Next.js app.

Make sure:

Your tsconfig.json supports ES modules

"module": "ESNext"

"jsx": "react-jsx"