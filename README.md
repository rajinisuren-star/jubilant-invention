# Golden Years Wellness

A senior-friendly wellness companion web app. Everything is designed for
readability and ease of use: large touch targets, high-contrast mode,
adjustable text size, and a simple bottom navigation bar.

## Features

- **Dashboard** — a daily overview of medications due, the next appointment,
  today's check-in status, and your primary emergency contact.
- **Medications** — track medications, dosages, and reminder times, and mark
  each dose as taken throughout the day.
- **Appointments** — keep upcoming and past doctor appointments organized
  with date, time, location, and notes.
- **Wellness Check-In** — a daily log for mood, water intake, sleep, and
  activity minutes, with a 14-day history view.
- **Emergency Contacts** — one-tap calling for a 911 shortcut and saved
  contacts, with a designated primary contact.
- **Settings** — adjustable text size and a high-contrast dark theme, plus
  data export/reset. All data stays on-device in `localStorage` — nothing is
  sent to a server.

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- lucide-react icons

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run lint     # run oxlint
```

## Accessibility notes

- Base font size is scaled up from the browser default, and further
  adjustable in Settings (100%–140%).
- All interactive controls have a minimum 44–48px touch target.
- High-contrast mode swaps to a black background with bright, WCAG-checked
  text/button colors.
- Focus states are always visible (`:focus-visible` outline).
