import type { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { FunctionReturnType } from "convex/server";
import { format } from "date-fns";

import { RatingStars } from "@/components/rating-stars";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Testimonial = FunctionReturnType<typeof api.testimonials.list>["page"][number];

/** One quote in the testimonies grid: rating and status, the words, who said it, then its toggles. */
export function TestimonieCard({
  testimony,
  onToggleFeatured,
  onToggleApproved,
}: {
  testimony: Testimonial;
  onToggleFeatured: (id: Id<"testimonials">, value: boolean) => void;
  onToggleApproved: (id: Id<"testimonials">, value: boolean) => void;
}) {
  const role = [testimony.customerTitle, testimony.customerCompany]
    .filter((part) => part !== undefined && part !== "")
    .join(", ");

  return (
    <article className="flex flex-col gap-5 border-t pt-5">
      <div className="flex min-h-5 items-center justify-between gap-3">
        {testimony.rating === undefined ? <span /> : <RatingStars value={testimony.rating} />}
        <div className="flex items-center gap-1.5">
          {testimony.isFeatured && <Badge variant="outline">Featured</Badge>}
          <Badge variant={testimony.isApproved ? "outline" : "secondary"}>
            {testimony.isApproved ? "Approved" : "Pending"}
          </Badge>
        </div>
      </div>

      <blockquote className="text-pretty text-foreground">{testimony.text}</blockquote>

      <div className="mt-auto flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarImage src={testimony.avatarUrl ?? undefined} alt={testimony.customerName} />
          <AvatarFallback className="text-sm text-muted-foreground">
            {testimony.customerName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <p className="truncate text-sm font-medium text-foreground">{testimony.customerName}</p>
          <p className="truncate type-caption text-muted-foreground">
            {role === "" ? "" : `${role} · `}
            {format(testimony._creationTime, "MMM d, yyyy")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id={`featured-${testimony._id}`}
            checked={testimony.isFeatured}
            onCheckedChange={(value) => {
              onToggleFeatured(testimony._id, value);
            }}
          />
          <Label
            htmlFor={`featured-${testimony._id}`}
            className="cursor-pointer text-xs font-normal text-muted-foreground"
          >
            Featured
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id={`approved-${testimony._id}`}
            checked={testimony.isApproved}
            onCheckedChange={(value) => {
              onToggleApproved(testimony._id, value);
            }}
          />
          <Label
            htmlFor={`approved-${testimony._id}`}
            className="cursor-pointer text-xs font-normal text-muted-foreground"
          >
            Approved
          </Label>
        </div>
      </div>
    </article>
  );
}
