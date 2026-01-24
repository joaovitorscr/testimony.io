import { format } from "date-fns";
import {
  BuildingIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  QuoteIcon,
  SparklesIcon,
} from "lucide-react";
import { RatingStars } from "@/components/rating-stars";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { Testimonial } from "../../../../../generated/prisma/client";

export function TestimonieCard({
  testimony,
  onToggleFeatured,
  onToggleApproved,
}: {
  testimony: Testimonial;
  onToggleFeatured: (id: string) => void;
  onToggleApproved: (id: string) => void;
}) {
  return (
    <Card className="group relative overflow-hidden border-border bg-card transition-all hover:shadow-md">
      {/* Status indicators */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {testimony.isFeatured && (
          <Badge
            variant="default"
            className="gap-1 bg-amber-500 hover:bg-amber-500"
          >
            <SparklesIcon className="size-3" />
            Featured
          </Badge>
        )}
        <Badge
          variant={testimony.isApproved ? "default" : "secondary"}
          className={cn(
            "gap-1",
            testimony.isApproved
              ? "bg-emerald-500 hover:bg-emerald-500"
              : "bg-muted text-muted-foreground",
          )}
        >
          {testimony.isApproved ? (
            <>
              <CheckCircle2Icon className="size-3" />
              Approved
            </>
          ) : (
            <>
              <ClockIcon className="size-3" />
              Pending
            </>
          )}
        </Badge>
      </div>

      <CardContent className="px-6">
        {/* Quote section */}
        <div className="mb-6">
          <QuoteIcon className="mb-3 size-8 text-primary/20" />
          <p className="text-foreground leading-relaxed">{testimony.text}</p>
        </div>

        {/* Rating */}
        {testimony.rating && (
          <div className="mb-6">
            <RatingStars value={testimony.rating} />
          </div>
        )}

        {/* Customer info and controls */}
        <div className="flex flex-col items-start justify-between border-t pt-4 lg:flex-row lg:items-end">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 ring-2 ring-background">
              <AvatarImage
                src={testimony.customerAvatarUrl || undefined}
                alt={testimony.customerName}
              />
              <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                {testimony.customerName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="font-semibold text-foreground text-sm">
                {testimony.customerName}
              </p>
              {testimony.customerTitle && (
                <p className="text-muted-foreground text-xs">
                  {testimony.customerTitle}
                </p>
              )}
              <div className="flex items-center gap-3 pt-1 text-muted-foreground text-xs">
                {testimony.customerCompany && (
                  <span className="flex items-center gap-1">
                    <BuildingIcon className="size-3" />
                    {testimony.customerCompany}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <CalendarIcon className="size-3" />
                  {format(testimony.createdAt, "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>

          {/* Toggle controls */}
          <div className="mt-8 flex items-center gap-6 lg:mt-0">
            <div className="flex items-center gap-2">
              <Label
                htmlFor={`featured-${testimony.id}`}
                className="cursor-pointer text-muted-foreground text-xs"
              >
                Featured
              </Label>
              <Switch
                id={`featured-${testimony.id}`}
                checked={testimony.isFeatured}
                onCheckedChange={() => onToggleFeatured(testimony.id)}
                className="data-[state=checked]:bg-amber-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label
                htmlFor={`approved-${testimony.id}`}
                className="cursor-pointer text-muted-foreground text-xs"
              >
                Approved
              </Label>
              <Switch
                id={`approved-${testimony.id}`}
                checked={testimony.isApproved}
                onCheckedChange={() => onToggleApproved(testimony.id)}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
