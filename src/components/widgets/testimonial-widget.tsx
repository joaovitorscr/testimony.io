import type { WidgetSettings, WidgetTestimonial } from "./types";
import { WidgetCard } from "./widget-card";

const PALETTES = {
  light: { bg: "#ffffff", fg: "#18181b", muted: "#71717a", border: "rgba(24, 24, 27, 0.1)" },
  dark: { bg: "#18181b", fg: "#fafafa", muted: "#a1a1aa", border: "rgba(250, 250, 250, 0.12)" },
};

function palette(name: keyof typeof PALETTES) {
  const colors = PALETTES[name];
  return `--tm-bg:${colors.bg};--tm-fg:${colors.fg};--tm-muted:${colors.muted};--tm-border:${colors.border};color-scheme:${name};`;
}

// Scoped to `.tm-root`, so the same markup works in the embed and inside the
// dashboard preview. Cards fill the width and wrap; there is no column knob.
const STYLES = `
.tm-root{${palette("light")}font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:2px;}
.tm-root[data-theme="dark"]{${palette("dark")}}
@media (prefers-color-scheme: dark){.tm-root[data-theme="auto"]{${palette("dark")}}}
.tm-root[data-layout="grid"]{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,18rem),1fr));gap:16px;align-items:start;}
.tm-root[data-layout="list"]{display:flex;flex-direction:column;gap:12px;}
`;

const HEX = /^#[\da-f]{6}$/iu;

/** The embeddable list or grid of testimonial cards. */
export function TestimonialWidget({
  testimonials,
  settings,
}: {
  testimonials: WidgetTestimonial[];
  settings: WidgetSettings;
}) {
  return (
    <>
      <style>{`${STYLES}.tm-root{--tm-accent:${HEX.test(settings.accentColor) ? settings.accentColor : "#71717a"};}`}</style>
      <div className="tm-root" data-theme={settings.theme} data-layout={settings.layout}>
        {testimonials.map((testimonial) => (
          <WidgetCard key={testimonial._id} testimonial={testimonial} settings={settings} />
        ))}
      </div>
    </>
  );
}
