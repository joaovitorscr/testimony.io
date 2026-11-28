---
version: "alpha"
name: "Cursory"
description: "Warm paper and one small grotesque under big product windows floating on a painted wash. Orange links, pill buttons, and a five-column footer that stays quiet. An agent that starts the work."
colors:
  primary: "#f54e00"
  on-primary: "#fff9f4"
  surface: "#f7f7f4"
  surface-container: "#f2f1ed"
  on-surface: "#26251e"
  on-surface-variant: "#7b7a71"
  outline: "#e2e1db"
  panel: "#fbfbfa"
  chrome: "#e6e5e0"
  wash-a: "#c9cec8"
  wash-b: "#ded2be"
  wash-c: "#b3bab3"
  success: "#3f7d4e"
typography:
  headline-display:
    fontFamily: "Geist"
    fontSize: 112px
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: -0.045em
  headline-lg:
    fontFamily: "Geist"
    fontSize: 34px
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: -0.02em
  headline-md:
    fontFamily: "Geist"
    fontSize: 22px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: -0.005em
  body-md:
    fontFamily: "Geist"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.005em
  body-sm:
    fontFamily: "Geist"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
  label-md:
    fontFamily: "IBM Plex Mono"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.12em
  serif-quote:
    fontFamily: "EB Garamond"
    fontSize: 21px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: -0.01em
rounded:
  sm: 2px
  md: 4px
  lg: 10px
  full: 9999px
spacing:
  unit: 4px
  section: 120px
  max-width: 1300px
---

# Cursory

> A warm-paper developer page that lets the product do the talking: a small headline, a giant editor window on a painted wash, then quiet hairline rows and orange links. Restraint first, one loud surface per screen.

Source: https://flavors.design/f/cursory

Fonts are Google stand-ins picked by skeleton: **Geist** at 400 for the tight grotesque display and body, **IBM Plex Mono** for every label and line of code, **EB Garamond** for editorial pull quotes.

## Overview

Warm off-white paper (`#f7f7f4`) fills the viewport; flat surface cards (`#f2f1ed`) sit directly on paper with `4px` corners and no drop shadows. The only saturated color is **Cursory Orange (`#f54e00`)**, reserved sparingly for links, active tab underlines, focus rings, and a single active indicator. Product previews float as physical `10px` windows with a `34px` chrome bar and traffic lights on top of a soft blurred painterly wash (`#c9cec8`, `#ded2be`, `#b3bab3`).

## Colors

- **Paper `#f7f7f4`** — the page (`--background`). Slightly green-warm, never pure white.
- **Surface `#f2f1ed`** — cards, sidebar, testimonial panels (`--card`, `--sidebar`). One step darker, same warm temperature.
- **Muted / Hover `#e4e4e1`** — subtle pills, active nav fills, secondary buttons (`--secondary`, `--muted`, `--accent`).
- **Ink `#26251e`** — body, headings, primary pill buttons (`--foreground`). Soft near-black with a brown cast, never `#000`.
- **Muted Ink `#5f5e58` / `#7b7a71`** — secondary copy, captions, mono labels (`--muted-foreground`).
- **Orange `#f54e00`** — links, active tab rule, focus ring (`--primary`, `--ring`). Used sparingly; never stack competing oranges on one screen.
- **Outline `#e2e1db`** — 1px hairlines (`--border`, `--input`). No 2px borders.
- **Panel `#fbfbfa` & Chrome `#e6e5e0`** — inside and outside of product windows (`--panel`, `--chrome`).
- **Wash `#c9cec8`, `#ded2be`, `#b3bab3`** — sage, ochre, and grey-green blurred radial backdrop behind product media.
- **Success `#3f7d4e`** — approved/live badges, passing states, status dots (`--success`).

### Schemes

- **Paper (`:root`)** — default warm off-white paper, `#f54e00` orange accent.
- **Carbon (`.dark`)** — charcoal `#17181a` paper, `#1f2023` cards, `#ff6a2b` ember accent.
- **Blueprint (`[data-flavor-scheme="blueprint"]`)** — cool grey-blue `#eef1f4` paper, `#1f5fd0` cobalt accent.
- **Sepia (`[data-flavor-scheme="sepia"]`)** — aged cream `#f3ead9` paper, `#b4461a` burnt sienna accent.

## Typography

- **Geist** (`--font-geist`) is the whole voice. Headers are **`400` weight**, never bold. `500` appears only in navigation pills, button labels, and small captions.
- **IBM Plex Mono** (`--font-ibm-plex-mono`) at `10–12px` with wide tracking (`0.12em`) for eyebrow labels, dates, file names, sidebar headers, and code snippets.
- **EB Garamond** (`--font-eb-garamond`) for editorial pull quotes only; never in UI chrome.

## Elevation, Shapes & Components

- **Flat page:** Cards have no shadow; separation comes from `#f2f1ed` on `#f7f7f4` and 1px `#e2e1db` hairlines.
- **Product windows:** `10px` radius, `34px` chrome bar with three `9px` dots, `--panel` interior, and `--shadow-window` depth floating on `.cursory-wash`.
- **Buttons:** Full pills (`rounded-full`), `500` weight, no shadows. Primary is ink background (`bg-foreground`) with warm paper text (`text-background`); Ghost/Secondary is `#f2f1ed`/`#e4e4e1` with ink text.
- **Tags / Badges:** `2px` radius (`rounded-[2px]`) in monospace so they read as labels, not buttons.
- **Tabs:** Hairline bottom rule (`border-b border-border`) with an orange active underline (`border-primary`).
- **Inputs:** `4px` radius on `--panel` (`#fbfbfa`) with 1px `#e2e1db` border.
