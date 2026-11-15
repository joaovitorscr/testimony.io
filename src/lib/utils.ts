import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The `type-*` utilities in globals.css set size, weight, leading and tracking,
// so a `type-*` class passed to a component replaces its built-in text classes.
const twMerge = extendTailwindMerge<"type-scale">({
  extend: {
    classGroups: {
      "type-scale": [{ type: ["display", "hero", "title", "lede", "caption", "legal"] }],
    },
    conflictingClassGroups: {
      "type-scale": ["font-size", "font-weight", "leading", "tracking"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
