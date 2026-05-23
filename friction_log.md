# Friction Log: Aegis Command Landing Page

## Observations & Adjustments

1. **Hydration Mismatch Prevention:**
   - *Issue:* Framer Motion and heavy client-side SVG noise/backgrounds often cause React hydration errors when the server renders a static shell and the client immediately tries to mount motion elements with dynamic DOM states.
   - *Resolution:* Implemented the "LEM_ON Protocol" (a `useHydrated` hook pattern via standard `useState`/`useEffect`). The page renders a simple `h-[100dvh] bg-background pb-safe` fallback until the client takes over, ensuring zero hydration mismatches.

2. **Mobile Layout (dvh & safe areas):**
   - *Issue:* iOS Safari bottom navigation bars often clip fixed 100vh containers.
   - *Resolution:* Enforced `h-[100dvh]` along with standard CSS `paddingBottom: 'env(safe-area-inset-bottom)'` mapped to Tailwind's `pb-safe` convention to guarantee edge-to-edge rendering without cropping the Digital Ticket or Admin portals on mobile screens.

3. **Background Image Webpack Loading (noise.svg):**
   - *Issue:* Tailwind arbitrary variants `bg-[url('/noise.svg')]` frequently throw Webpack `MODULE_NOT_FOUND` errors if injected via variables or parsed dynamically.
   - *Resolution:* Bypassed Tailwind for this specific element and applied the `backgroundImage: "url('/noise.svg')"` strictly via inline styles.

4. **Component Architecture:**
   - *Note:* The directive specified not rewriting existing boilerplate but requested the full landing page in `src/app/page.tsx`. Due to the heavy requirement for Framer Motion (`"use client"`), the entire file was converted to a Client Component. While a pure RSC shell wrapping a Client Component is optimal for LCP, merging them into one file satisfied the AST patching discipline constraint to modify *only* `page.tsx` without creating split files.
