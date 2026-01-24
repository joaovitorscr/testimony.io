import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={cn(
            "size-4 transition-colors",
            star <= value
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted",
          )}
        />
      ))}
      <span className="ml-2 font-medium text-muted-foreground text-sm">
        {value}/5
      </span>
    </div>
  );
}
