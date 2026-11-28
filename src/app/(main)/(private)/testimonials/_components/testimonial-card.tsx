import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { format } from "date-fns";
import type { ReactNode } from "react";

import { RatingStars } from "@/components/rating-stars";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export type Testimonial = FunctionReturnType<typeof api.testimonials.list>["page"][number];

const STATUS_BADGE = {
  pending: { label: "Pending", variant: "warning" },
  approved: { label: "Approved", variant: "mint" },
  archived: { label: "Archived", variant: "secondary" },
} as const satisfies Record<Testimonial["status"], { label: string; variant: string }>;

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
  const badge = STATUS_BADGE[testimonial.status];

  return (
    <article className="flex flex-col rounded-[var(--radius)] border border-border/80 bg-card">
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-3">
          {testimonial.rating === undefined ? (
            <span className="font-mono text-[11px] text-muted-foreground">No rating</span>
          ) : (
            <RatingStars value={testimonial.rating} />
          )}
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>

        <blockquote className="text-[15px] leading-relaxed text-pretty [overflow-wrap:anywhere] whitespace-pre-line text-foreground">
          {testimonial.text}
        </blockquote>

        <div className="mt-auto flex items-center gap-3 pt-1">
          <Avatar className="size-7">
            <AvatarImage src={testimonial.avatarUrl ?? undefined} alt="" />
            <AvatarFallback className="bg-secondary font-mono text-[11px] text-foreground">
              {testimonial.customerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <p className="truncate text-xs font-medium text-foreground">
              {testimonial.customerName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {role === "" ? "" : `${role} · `}
              <time
                className="font-mono text-[11px] tabular-nums"
                dateTime={new Date(testimonial._creationTime).toISOString()}
              >
                {format(testimonial._creationTime, "MMM d, yyyy")}
              </time>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-1.5 border-t border-border bg-panel/60 px-3 py-2">
        {actions}
      </div>
    </article>
  );
}
