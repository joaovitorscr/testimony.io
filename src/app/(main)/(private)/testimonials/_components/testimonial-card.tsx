import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { format } from "date-fns";
import type { ReactNode } from "react";

import { RatingStars } from "@/components/rating-stars";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type Testimonial = FunctionReturnType<typeof api.testimonials.list>["page"][number];

/** One quote in the review grid: rating, the words, who said it, then `actions`. */
export function TestimonialCard({
  testimonial,
  actions,
}: {
  testimonial: Testimonial;
  actions: ReactNode;
}) {
  const role = [testimonial.customerTitle, testimonial.customerCompany]
    .filter((part) => part !== undefined && part !== "")
    .join(", ");

  return (
    <article className="flex flex-col gap-5 border-t pt-5">
      {testimonial.rating !== undefined && <RatingStars value={testimonial.rating} />}

      <blockquote className="text-pretty [overflow-wrap:anywhere] whitespace-pre-line text-foreground">
        {testimonial.text}
      </blockquote>

      <div className="mt-auto flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarImage src={testimonial.avatarUrl ?? undefined} alt="" />
          <AvatarFallback className="text-sm text-muted-foreground">
            {testimonial.customerName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <p className="truncate text-sm font-medium text-foreground">{testimonial.customerName}</p>
          <p className="truncate type-caption text-muted-foreground">
            {role === "" ? "" : `${role} · `}
            {format(testimonial._creationTime, "MMM d, yyyy")}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">{actions}</div>
    </article>
  );
}
