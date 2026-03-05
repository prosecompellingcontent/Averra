# React #306 Diagnostic - Simplified RootLayout

## Problem Identified

Console shows TWO separate errors:
1. ✅ `/about-hero.png` 404 error (NOT causing the crash - this is old code from cache)
2. ❌ React Error #306 - Component is undefined (THIS is the crash)

## Hypothesis

The undefined component is likely one of:
- `CartPreviewWrapper`
- `CookieConsent`

These were the only components being rendered by RootLayout besides `<Outlet />`.

## Test Applied

**Simplified RootLayout to ONLY `<Outlet />`**

```tsx
// /src/app/layouts/RootLayout.tsx
import { Outlet } from 'react-router-dom';

export function RootLayout() {
  return <Outlet />;
}
```

## Expected Results

### If site loads successfully after this:
✅ **The undefined component was in RootLayout** (CartPreviewWrapper or CookieConsent)

**Next Step:** Add back components one by one:
1. Add back `<CartPreviewWrapper />` → test
2. If works, add back `<CookieConsent />` → test
3. Whichever breaks it = the culprit

### If site STILL shows React #306:
❌ **The undefined component is inside a PAGE** (HomePage, ServicesPage, etc.)

**Next Step:** Test individual pages by commenting out sections

---

## Commands to Deploy

```bash
git add .
git commit -m "Diagnostic: Simplify RootLayout to isolate React #306"
git push origin main
```

Then in Vercel:
1. Go to your project
2. Find latest deployment
3. Click "..." menu → "Redeploy" → Check "Use existing Build Cache" = OFF
4. Redeploy

---

## Status: WAITING FOR TEST RESULTS

After deploying, check the deployed site:
- ✅ **Site loads?** → Bug was in RootLayout components
- ❌ **Still crashes?** → Bug is in a page component

---

**DO NOT TOUCH REACT ROUTER** ✅ (Routes unchanged - only simplified RootLayout)
