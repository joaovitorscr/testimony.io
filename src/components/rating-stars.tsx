import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function RatingStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      <span className="sr-only">Rated {value} out of 5</span>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          aria-hidden="true"
          className={cn(
            "size-3.5",
            star <= value ? "fill-warning text-warning" : "fill-muted text-border",
          )}
        />
      ))}
      <span aria-hidden="true" className="ml-1.5 text-xs text-muted-foreground tabular-nums">
        {value}/5
      </span>
    </div>
  );
}
