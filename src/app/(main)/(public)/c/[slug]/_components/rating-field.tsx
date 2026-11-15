"use client";

import { StarIcon } from "lucide-react";

import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const STARS = [1, 2, 3, 4, 5];

/** Optional 1-5 star rating. 0 means no rating; picking the same star again clears it. */
export function RatingField({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <FieldSet className="gap-3">
      <FieldLegend variant="label">
        Rating <span className="text-muted-foreground">(optional)</span>
      </FieldLegend>
      <div className="flex gap-1">
        {STARS.map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star} out of 5`}
            aria-pressed={value === star}
            onClick={() => {
              onChange(value === star ? 0 : star);
            }}
            className={cn(
              "rounded-sm p-0.5 transition-colors duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              value >= star ? "text-foreground" : "text-fg-faint hover:text-fg-2",
            )}
          >
            <StarIcon className={cn("size-7", value >= star && "fill-current")} />
          </button>
        ))}
      </div>
      {value > 0 && <FieldDescription>Tap the same star again to clear.</FieldDescription>}
    </FieldSet>
  );
}
