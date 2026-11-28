"use client";

import { StarIcon } from "lucide-react";
import { useState } from "react";

import { FieldLegend, FieldSet } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const STARS = [1, 2, 3, 4, 5];
const SENTIMENT = ["", "Poor", "Okay", "Good", "Great", "Amazing"];

/** Optional 1-5 star rating. 0 means no rating; picking the same star again clears it. */
export function RatingField({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  // The star under the pointer or keyboard focus, previewed before it is picked.
  const [preview, setPreview] = useState(0);
  const shown = preview === 0 ? value : preview;

  return (
    <FieldSet className="gap-0">
      <FieldLegend variant="label">
        How would you rate it? <span className="font-normal text-muted-foreground">(optional)</span>
      </FieldLegend>
      <div className="flex items-center gap-3">
        <div
          className="flex gap-0.5"
          onPointerLeave={() => {
            setPreview(0);
          }}
        >
          {STARS.map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`${star} out of 5, ${SENTIMENT[star]}`}
              aria-pressed={value === star}
              onClick={() => {
                onChange(value === star ? 0 : star);
              }}
              onPointerEnter={() => {
                setPreview(star);
              }}
              onFocus={() => {
                setPreview(star);
              }}
              onBlur={() => {
                setPreview(0);
              }}
              className={cn(
                "rounded-md p-1 transition-colors duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                shown >= star ? "text-warning" : "text-muted-foreground/35",
              )}
            >
              <StarIcon className={cn("size-7", shown >= star && "fill-current")} />
            </button>
          ))}
        </div>
        <span
          aria-live="polite"
          className={cn(
            "text-sm font-medium tabular-nums",
            preview === 0 ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {shown === 0 ? "" : SENTIMENT[shown]}
        </span>
      </div>
      {value > 0 && (
        <p className="mt-1.5 text-xs text-muted-foreground">Pick the same star again to clear.</p>
      )}
    </FieldSet>
  );
}
