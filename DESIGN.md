---
version: "alpha"
name: "Runaway"
description: "White gallery paper, cinematic 12px film-still panels, quiet grey tab rails, small semibold ink buttons and an ink footer."
colors:
  primary: "#262626"
  on-primary: "#ffffff"
  surface: "#ffffff"
  surface-container: "#eef1f5"
  on-surface: "#0c0c0c"
  on-surface-variant: "#7c7c7c"
  outline: "#e6e6e6"
  bg3: "#f7f7f7"
  fg2: "#404040"
  fg-faint: "#a8a8a8"
  light: "#ffffff"
  night: "#0c0c0c"
  promo: "#2b22fa"
  promo2: "#7a3cf0"
  ember: "#ff7a2e"
  dusk: "#c89a6a"
  moss: "#4d5e46"
  sky: "#9fb0c0"
typography:
  headline-display:
    fontFamily: "Inter Tight"
    fontSize: 56px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: -0.015em
  headline-hero:
    fontFamily: "Inter Tight"
    fontSize: 40px
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: -0.5px
  body-md:
    fontFamily: "Inter Tight"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: "Inter Tight"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
rounded:
  sm: 4px
  md: 6px
  lg: 16px
  media: 12px
spacing:
  unit: 4px
  section: 128px
  max-width: 1600px
---

# Runaway

> A white screening-room wall hung with cinematic stills, captioned in soft grey grotesk and operated with tiny dark buttons.

Source: https://flavors.design/f/runaway

## Overview

Gen-video lab restraint. The page is plain white paper with a 20px gutter that
runs almost edge to edge (1600px container), and everything interesting is a
**rounded 12px frame of footage**: the hero is one enormous night-street film still (wet
cobbles, one open doorway spilling ember light) with the copy anchored bottom-left, platforms are 16:9
stills, the research block is a blurred painterly field. Type is a single
light grotesk at weight 400 — headings are big but never bold, and the
secondary headings are _grey_ (#404040), not black. The only chrome is a small
set of 6px-radius semibold buttons: ink, pale blue-grey, or transparent. Then a
solid ink footer with 12px grey column labels. It is for AI media, film and
creative-tool products that want the work to be the brand. It is NOT a SaaS
page: no icons in coloured circles, no gradient text, no drop shadows, no
bold headlines, no card grids with borders everywhere.

## Colors

| Role                      | Value                                   | Notes                                                      |
| ------------------------- | --------------------------------------- | ---------------------------------------------------------- |
| bg                        | `#ffffff`                               | paper                                                      |
| bg-2                      | `#eef1f5`                               | pale blue-grey fill of secondary buttons ("Learn more")    |
| bg-3                      | `#f7f7f7`                               | off-white surface                                          |
| fg                        | `#0c0c0c`                               | "off-black"; display heads, nav labels, button text        |
| fg-2                      | `#404040`                               | body copy and the grey section titles ("Runaway Studio")   |
| fg-muted                  | `#7c7c7c`                               | captions, logo-strip sentence, stat labels                 |
| fg-faint                  | `#a8a8a8`                               | inactive tabs in the rail and the use-case list            |
| accent                    | `#262626`                               | neutral-800 primary buttons; hover goes to fg              |
| accent-fg                 | `#ffffff`                               | text on accent                                             |
| border                    | `#e6e6e6`                               | hairlines: tab rail, 16px card, stats rules, FAQ           |
| light                     | `#ffffff`                               | text and outlines on footage, always light in every scheme |
| night                     | `#0c0c0c`                               | hero/CTA panels and the footer                             |
| promo                     | `#2b22fa`                               | electric-blue announcement bar (fades toward promo-2)      |
| ember / dusk / moss / sky | `#ff7a2e` `#c89a6a` `#4d5e46` `#9fb0c0` | the footage palette: CSS-painted stills only               |

Scheme: light. Contrast rule: body `#404040` on white ≥ 10:1, captions `#7c7c7c` ≥ 4.5:1; inactive tabs at `#a8a8a8` are deliberately low.
Color rules: colour lives only inside media frames and the promo bar. The UI itself is greyscale.

## Typography

- Display: `"Inter Tight", "ABC Normal", system-ui, sans-serif` — weight 400 for every heading, tracking -0.015em (56px) to -0.5px (40px hero), sentence case
- Body: same stack, 16px/1.5; 14px/1.55 for platform body copy; 12px captions
- Mono: none
- Scale: 11 / 12 / 13 / 14 / 16 / 20 / 22 / 24 / 40 / 56
- Load: `<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;800&display=swap">`
- Rules: headings 400, section titles and tabs 500 at 24px in grey; buttons are the only 600; the lowercase wordmark is the only heavy type (800, -0.055em). Footer legal line is 11px uppercase.

Inter Tight stands in for the site's commercial ABC Normal (Dinamo): both are
narrow-set neo-grotesks with single-storey g, flat terminals and tight default
spacing.

## Layout

- Max width 1600px, gutters 20px; the page feels full-bleed on laptops
- Base unit 4px; scale 4 / 8 / 12 / 16 / 24 / 32 / 64 / 128
- Section rhythm 128px (88px on phones)
- Grid: 3 equal columns with a 16px gap for platforms, quotes and plans; 2 columns for the news grid (still + text side by side); a 26% / 1fr split inside the use-case card
- Density: airy — very large white gaps, content packed only inside each block.
- Hero: 600px tall, copy max 580px wide, bottom-left, 44px padding.
- Centred display heads are capped at 1024px and balanced.

## Elevation & Depth

Flat paper with photographs laid on it; the footage is the only depth.

- No box shadows anywhere (`--shadow: none`).
- Hairlines are `1px solid #e6e6e6`: the 16px-radius use-case card, the rules between tab-rail titles (`flex:1; height:1px`), the top of each stat column, plan cards and FAQ rows.
- Media frames stack their own light: layered `radial-gradient` / `linear-gradient` fills, then a `::after` of SVG fractal noise at `opacity: var(--grain)` (0.16) with `mix-blend-mode: overlay` for film grain.
- The research field is a set of radial gradients under `filter: blur(var(--haze))` (46px), extended 60px past the frame so the edges stay soft.
- Buttons on footage are glass: `background: color-mix(white 5%)`, `outline: 1px solid color-mix(white 75%)` with `outline-offset: -1px`, `backdrop-filter: blur(8px)`.
- Research rows are separated by 1px 85%-white rules on the footage.

## Shapes

- Radius: 6px buttons (`--radius`), 4px ghost/nav and promo buttons, 8px for the big white hero button and small stills, 12px for hero/research/CTA frames (`--media-radius`), 16px for the bordered use-case card and plan cards (`--radius-lg`)
- Media aspect ratios: 16:9 platform and use-case stills, 4:3 testimonial stills, 19:10 news stills
- Chevrons are 10-14px open strokes; arrows in the research list are 11px north-east strokes

## Components

- Buttons: `padding: 6px 10px`, 600 14px/20px, 6px radius. **Ink** (`#262626` → `#0c0c0c` hover), **pale** (`#eef1f5`), **ghost** (transparent, 4px radius, pale on hover), **white** on footage (8px 12px, 16px text, 8px radius, with a chevron), **glass outline** on footage. Rows of 2-3 buttons with 8px gaps.
- Nav: a 48px electric-blue promo bar with a small outlined button, then a 64px sticky white bar: lowercase heavy wordmark, centred 16px/500 menu with tiny chevrons, then pale / ghost / ink buttons on the right.
- Platform columns: grey 24px/500 title → 16:9 still → 24px/400 black lede (≈24ch) → 14px body → button row → 12px caption.
- Tab rail + card: three grey titles joined by hairlines; the active one is `#404040`, the others `#a8a8a8`. Under it a 16px-radius hairline card with a left list of 24px use cases (same active/faint logic) and a big 16:9 still with a centred white caption.
- Research block: blurred field frame, small label, 24px white statement, glass button; right column is a ruled list of models (20px title, 13px 60%-white body, NE arrow).
- News: still left, 24px grey title + 14px body + "Learn more ›" right.
- Footer: ink block, 4 columns with 12px grey labels, 16px white links (↗ for external), lowercase wordmark + 11px uppercase legal line + three outline channel icons (newsletter, community, feed).

## Do's and Don'ts

- Do let footage carry the colour; keep the UI greyscale.
- Do set every heading at weight 400 and use grey (#404040) for secondary titles.
- Do keep buttons small: 14px semibold, 6px 10px padding, 6px corners.
- Do anchor hero copy bottom-left inside one big rounded black frame.
- Do fade inactive tabs to #a8a8a8 and join rail titles with hairlines.
- Do put a light grain overlay on every media frame.

- Don't bold headlines or use weight 700 anywhere except the wordmark.
- Don't add drop shadows, gradient text or coloured icon tiles.
- Don't frame every block in a border; only the use-case card and plans get one.
- Don't use pure grey #808080 or pure black for body text.
- Don't make buttons pills or larger than 40px tall.
- Don't use the promo blue anywhere but the announcement bar.

## Motion

- Duration 150ms, easing `cubic-bezier(0.4, 0, 0.2, 1)`; research rows fade colour linearly
- What animates: button backgrounds, tab/list colour, nav label opacity, the "Learn more" chevron nudging 3px, the FAQ plus rotating 45°
- Signature move: a 40s linear marquee of partner wordmarks masked to transparent at both ends
- Never: scroll reveals, parallax, lifts. All motion inside `prefers-reduced-motion: no-preference`.

## Tweaks

- Signature knobs: media radius (0–32px), research haze (8–90px blur), film grain (0–0.5).
- Alternate schemes: **Screening Room** (dark), **Blue Hour**, **Magic Hour**, **Greenroom**.

## Reference CSS

```css
:root {
  --bg:#ffffff;
  --bg-2:#eef1f5;
  --bg-3:#f7f7f7;
  --fg:#0c0c0c;
  --fg-2:#404040;
  --fg-muted:#7c7c7c;
  --fg-faint:#a8a8a8;
  --accent:#262626;
  --accent-fg:#ffffff;
  --border:#e6e6e6;
  --light:#ffffff;
  --night:#0c0c0c;
  --promo:#2b22fa;
  --promo-2:#7a3cf0;
  --ember:#ff7a2e;
  --dusk:#c89a6a;
  --moss:#4d5e46;
  --sky:#9fb0c0;
  --font-display:"Inter Tight", "ABC Normal", system-ui, sans-serif;
  --font-body:"Inter Tight", "ABC Normal", system-ui, sans-serif;
  --radius:6px;
  --radius-sm:4px;
  --radius-md:8px;
  --radius-lg:16px;
  --media-radius:12px;
  --haze:46px;
  --grain:0.16;
  --space-1:4px;
  --space-2:8px;
  --space-3:12px;
  --space-4:16px;
  --space-5:24px;
  --space-6:32px;
  --space-7:64px;
  --space-8:128px;
  --shadow:none;
  --ease:cubic-bezier(0.4, 0, 0.2, 1);
  --dur:150ms;
  --max-width:1600px;
  --gut:20px;
  --noise:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
:root {--space-8:88px}
.promo{font-size:13px}
.nav-r .lt,.nav-r .gh{display:none}
.burger{display:block}
.nav-r{margin-left:auto}
.promo{justify-content:space-between;text-align:left}
.hero{min-height:620px;padding:28px 24px}
h1{font-size:34px}
.hero p{font-size:18px}
.tabs{gap:12px}
.tabs button{font-size:17px}
.tabs i{display:none}
.list button{font-size:20px}
.stats b{font-size:44px}
.news article{grid-template-columns:1fr}
.legal{flex-wrap:wrap;gap:24px;margin-top:80px}
.plat .body{margin-bottom:28px}
}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:var(--space-2);padding:6px 10px;border-radius:var(--radius);font:600 14px/20px var(--font-body);white-space:nowrap;transition:all var(--dur) var(--ease)}
.dk{background:var(--accent);color:var(--accent-fg)}
.lt{background:var(--bg-2);color:var(--fg)}
.media{position:relative;overflow:hidden;border-radius:var(--media-radius);background:var(--night);isolation:isolate}
.media::after{content:"";position:absolute;inset:0;z-index:1;background:var(--noise);opacity:var(--grain);mix-blend-mode:overlay;pointer-events:none}
```

## Reference markup

```html
<div class="plat">
  <div>
    <h3>Runaway Studio</h3>
    <div class="media mono"></div>
    <p class="lede">An editing suite that finishes the shot you ran out of daylight for.</p>
    <p class="body">
      Extend a take by 40 seconds, move the sun, add a street that was never built.
    </p>
    <div class="row">
      <a class="btn dk" href="#">Try now</a>
      <a class="btn lt" href="#">Learn more</a>
    </div>
    <p class="fine">Used by 2.3m editors. Free for your first 125 seconds.</p>
  </div>
</div>
```

## How to apply this flavor

1. Replace the target page's design tokens with the palette, font and spacing above; widen the container to 1600px with 20px gutters.
2. Turn the hero into one rounded black media frame with copy bottom-left and a white chevron button.
3. Replace icon cards with stills (real footage or CSS-painted frames with grain) above grey titles and small button rows.
4. Add the tab rail with hairline joins and the bordered use-case card; finish with an ink footer.
5. Keep motion to 150ms colour fades; check the Don't list before finishing.
