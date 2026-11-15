import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function RatingStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={cn(
            "size-3.5",
            star <= value ? "fill-foreground text-foreground" : "fill-fg-faint text-fg-faint",
          )}
        />
      ))}
      <span className="ml-1.5 type-caption text-muted-foreground tabular-nums">{value}/5</span>
    </div>
  );
}
