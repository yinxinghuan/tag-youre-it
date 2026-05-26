# Tag, You're It — Dev Guidelines

## Concept

Chain-tag toy. Pick an Aigram friend → pick a slapstick weapon (PIE / SLIME / CONFETTI / STICKER / PIZZA / BANANA) → SLAM → AI paints a comic-book panel of them getting tagged → platform pushes notification + image to friend. Open the app to see who tagged you. Tag back to clear your name. Pop-art halftone, Lichtenstein BAM aesthetic.

## Screens

`lobby → contact picker → move picker → slam → reveal → wall`

## Tech

- React 18 + TS strict + Less + Vite 5
- Aigram runtime via `@shared` (bridge / useGameEvent / useGameStats / useGenImage / useGameSave)
- BAM aesthetic = SVG halftone pattern + CSS shake/burst keyframes (no canvas)

## Hard rules

- `onPointerDown` only
- Audio first-touch only — never auto on mount
- No emoji in UI — every glyph is SVG
- No outer `border-radius` on root — Aigram already wraps with rounded frame
- AlterU watermark — `/img/alteru.svg`, no `filter: invert`
- BEM `tyi-` prefix on CSS classes + `@keyframes tyi-*`
- Don't pad real friends with demo names

## Build

`npm install && npm run build` — must pass before commit.
