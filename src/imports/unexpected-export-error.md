✗ Build failed in 685ms
error during build:
[vite:esbuild] Transform failed with 1 error:
/vercel/path0/src/app/pages/HomePage.tsx:17:0: ERROR: Unexpected "export". 15 |  const MobileDebug = lazy(() => import("@/app/components/MobileDebug").then(m => ({ default: m.MobileDebug })));
16 |  
17 |  export function HomePage() {
   |  ^
18 |    const isMobile = useIsMobile();
19 |    const [heroImageError, setHeroImageError] = useState(false); Error: Command "npm run build" exited with 1

This error means:

The JavaScript parser hit export at line 17, but syntactically it wasn’t allowed to be there.

It does NOT mean export is invalid.
It means something above it is broken, so the parser thinks it’s still inside something.

What “Unexpected export” Actually Means

ESBuild is reading your file like this:

…some code...
(still inside something...)
export function HomePage() {  ❌

export is only valid at the top level of a file.

So if you're:

Inside another function

Inside an object

Inside an unclosed block {

Inside JSX accidentally

Then export becomes illegal.

The Error Location

It’s pointing here:

15 | const MobileDebug = lazy(() =>
       import("@/app/components/MobileDebug")
         .then(m => ({ default: m.MobileDebug })));

17 | export function HomePage() {

Line 17 is just where it noticed the problem.

The actual mistake is almost certainly above it.

Most Common Causes (Ranked)
1️⃣ Missing closing brace } above

Example of what breaks it:

const Something = () => {
  const MobileDebug = lazy(() => import(...))
// ❌ forgot to close }

export function HomePage() {

Fix:

const Something = () => {
  const MobileDebug = lazy(() => import(...))
};

export function HomePage() {
2️⃣ JSX outside a component

This will break the file:

<div>Hello</div>   // ❌ not allowed at top level

export function HomePage() {
3️⃣ You’re inside a lazy() incorrectly

If you accidentally wrote:

const MobileDebug = lazy(() => {
  import("@/app/components/MobileDebug")
  .then(...)

That’s wrong — arrow body must return.

Correct version:

const MobileDebug = lazy(() =>
  import("@/app/components/MobileDebug")
    .then(m => ({ default: m.MobileDebug }))
);
4️⃣ You mixed CommonJS and ESM

If somewhere above you used:

module.exports = ...

and also used export, that can break builds depending on config.

Important: This Is NOT

Not a Vercel issue

Not a Stripe issue

Not a mobile crash issue

Not image-related

Not backend-related

This is purely a syntax error in HomePage.tsx.

How To Fix Fast

Open:

src/app/pages/HomePage.tsx

Check lines 1–16.

You’re looking for:

An unclosed {

An unclosed (

An arrow function that never ends

JSX outside a function

A missing ;