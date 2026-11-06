# CampusCode · ReBuild '26 — Round 2 "Event Pass"

A redesign of CampusCode's four pages — Landing, Login, Register and Student Dashboard (My Events + Events) — built around one idea: **every surface is a ticket.** Light background, white cards, CampusCode purple and lime, Inter + DM Mono, and the official logo file.

> Built with AI assistance (Claude), as disclosed in the organizer note.

## Pages
- **Landing** — a giant boarding pass hero (cursor tilt + print-in reveal), a split-flap "departures board" of live events, a scroll-filled route for *How it works*, passport stamps for the platform features, count-up stats and a tear-off CTA.
- **Login** — "Check in" gate with validation, a quick math captcha, show/hide password, demo account button and a live Round 2 countdown.
- **Register** — 3-step form (Details → Profile → Verify) with a Digital ID pass that prints live as you type, password strength meter, role cards and an "ISSUED" stamp at the end.
- **Student dashboard**
  - *Overview*: live event pass with round tracker + countdown, flip-able Digital ID with QR, stats, agenda and recommendations.
  - *My Events*: a wallet of passes with filters and progress.
  - *Events*: search, track filters, sort, event details modal and one-click register (adds to My Events).

## Tech
React 19 + Vite, Motion (`motion/react`), Lenis smooth scroll, React Bits (CountUp, SpotlightCard, ScrollVelocity, Magnet, ClickSpark), plain CSS. Mock data in `src/data/events.js`. State saved in `localStorage`. Hash routing (`#/login`, `#/register`, `#/dashboard/events`).

## Run
```bash
npm install
npm run dev
```
