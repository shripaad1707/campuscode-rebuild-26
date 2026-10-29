# CampusCode — ReBuild '26 Dashboard Recreation

A ground-up recreation of the [CampusCode](https://campus-code-ten.vercel.app) landing dashboard for **ReBuild '26 — The Dashboard Recreation Hackathon**, rebuilt as a dark, cinematic "Night Arena" experience while keeping CampusCode's logo, copy and section flow intact.

## Highlights

- **Interactive hero** — WebGL fluid background that reacts to the cursor, variable-weight headline (letters thin out near the pointer), and a 3D-tilting phone mockup showing a live CampusCode app (countdown, activity feed, floating notifications).
- **Crossing marquee bands** that speed up and skew with scroll velocity.
- **Bento ecosystem grid** (Students · Teams · Organizers · Hackathons · IdeaCheck · Certificates) with spotlight, border glow and tilt.
- **Scroll-scrubbed Experience** — a pinned "story" that plays as you scroll (00:00 → 00:30 timecode).
- **Horizontal How-it-works strip** — vertical scroll drives the cards sideways.
- **Enter the Arena** — hackathon rows with a hover marquee band.
- **Mission** with light rays and a scroll-lit statement, **Network** graph, animated **CTA** threads and a cursor-reveal footer wordmark.
- Loader, smooth inertial scrolling, masked headline reveals, click sparks, scroll progress.
- Fully responsive (desktop → mobile) and respects `prefers-reduced-motion`.

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | React 19 + Vite |
| Motion | Motion (`motion/react`), GSAP, Lenis smooth scroll |
| Components | [React Bits](https://reactbits.dev) — LiquidEther, MagicBento, FlowingMenu, ScrollVelocity, SpotlightCard, Silk, Threads, LightRays, CircularText, DecryptedText, VariableProximity, Magnet, ClickSpark, LogoLoop, GradualBlur |
| Type | Inter Variable, Cormorant Garamond, Geist, Geist Mono (self-hosted via Fontsource) |
| Hosting | Vercel |

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Structure

```
src/
  App.jsx               # shell: loader, smooth scroll, sections
  lib/motion.jsx        # motion tokens, masked headings, reveals
  sections/             # Hero, Phone, Marquee, About (bento), Experience,
                        # HowItWorks, Arena, Mission, Community, Cta, Footer
  components/rb/        # React Bits components used in the build
  styles.css            # design tokens + all section styles
```

## Credits

Original design and brand © CampusCode. Animated components from React Bits by David Haz. Recreated for ReBuild '26 by Shripaad.
