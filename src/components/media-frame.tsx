import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/*
 * CSS-painted film stills. Colour in the UI lives only here (DESIGN.md):
 * night is the hero street with an ember doorway, the rest are quieter frames.
 */
const STILLS = {
  night: [
    "radial-gradient(ellipse 9% 22% at 71% 52%, color-mix(in srgb, var(--ember) 95%, white) 0%, var(--ember) 35%, transparent 100%)",
    "radial-gradient(ellipse 30% 45% at 71% 55%, color-mix(in srgb, var(--ember) 45%, transparent), transparent 70%)",
    "radial-gradient(ellipse 45% 14% at 66% 92%, color-mix(in srgb, var(--ember) 30%, transparent), transparent 70%)",
    "radial-gradient(ellipse 60% 40% at 15% 10%, color-mix(in srgb, var(--sky) 18%, transparent), transparent 70%)",
    "linear-gradient(180deg, #15171b 0%, #0c0c0c 55%, #17110d 100%)",
  ],
  dusk: [
    "radial-gradient(ellipse 70% 35% at 50% 78%, color-mix(in srgb, var(--ember) 55%, transparent), transparent 70%)",
    "radial-gradient(ellipse 90% 60% at 50% 100%, color-mix(in srgb, var(--dusk) 70%, transparent), transparent 75%)",
    "linear-gradient(180deg, #2a2733 0%, #6b5a52 55%, var(--dusk) 100%)",
  ],
  moss: [
    "radial-gradient(ellipse 50% 40% at 30% 30%, color-mix(in srgb, var(--dusk) 35%, transparent), transparent 70%)",
    "radial-gradient(ellipse 70% 50% at 80% 90%, color-mix(in srgb, var(--night) 70%, transparent), transparent 70%)",
    "linear-gradient(160deg, #6f7f62 0%, var(--moss) 45%, #1d241b 100%)",
  ],
  sky: [
    "radial-gradient(ellipse 60% 30% at 70% 20%, color-mix(in srgb, white 45%, transparent), transparent 70%)",
    "radial-gradient(ellipse 80% 40% at 30% 100%, color-mix(in srgb, var(--moss) 45%, transparent), transparent 70%)",
    "linear-gradient(180deg, #c9d3dc 0%, var(--sky) 50%, #5d6b78 100%)",
  ],
} as const;

export type Still = keyof typeof STILLS;

/**
 * A 12px rounded frame of "footage" with film grain. Children sit above the
 * grain; position them yourself (e.g. `flex items-end p-11` for bottom-left copy).
 * The frame is a night surface, so it opts its children into the dark scheme.
 */
export function MediaFrame({
  still = "night",
  className,
  style,
  children,
  ...props
}: ComponentProps<"div"> & { still?: Still }) {
  return (
    <div
      className={cn(
        "dark relative isolate overflow-hidden rounded-media bg-night text-light",
        "after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:bg-(image:--noise) after:opacity-(--grain) after:mix-blend-overlay",
        className,
      )}
      style={{ backgroundImage: STILLS[still].join(", "), ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
