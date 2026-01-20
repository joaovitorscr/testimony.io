"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  BuildingIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  QuoteIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { TestimonyFilter } from "@/server/api/routers/testimonie";
import { api } from "@/trpc/react";
import type { Testimonial } from "../../../../../generated/prisma/client";

const FILTERS: {
  label: string;
  value: TestimonyFilter;
  icon: React.ReactNode;
}[] = [
  { label: "All", value: "all", icon: null },
  {
    label: "Approved",
    value: "approved",
    icon: <CheckCircle2Icon className="size-3.5" />,
  },
  {
    label: "Pending",
    value: "pending",
    icon: <ClockIcon className="size-3.5" />,
  },
  {
    label: "Featured",
    value: "featured",
    icon: <SparklesIcon className="size-3.5" />,
  },
];

export function TestimoniesList() {
  const [filter, setFilter] = useState<TestimonyFilter>("all");
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isError,
  } = api.testimonie.infinite.useInfiniteQuery(
    { limit: 10, filter },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 1000 * 60 * 5,
      placeholderData: keepPreviousData,
    },
  );

  const utils = api.useUtils();

  const toggleFeaturedMutation = api.testimonie.toggleFeatured.useMutation();
  const toggleApprovedMutation = api.testimonie.toggleApproved.useMutation();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const testimonies = data?.pages.flatMap((page) => page.items) ?? [];

  const handleToggleFeatured = (id: string) => {
    toast.promise(toggleFeaturedMutation.mutateAsync({ id }), {
      loading: "Toggling featured status...",
      success: () => {
        utils.testimonie.infinite.invalidate();
        return "Featured status toggled successfully!";
      },
      error: "Failed to toggle featured status",
    });
  };

  const handleToggleApproved = (id: string) => {
    toast.promise(toggleApprovedMutation.mutateAsync({ id }), {
      loading: "Toggling approved status...",
      success: () => {
        utils.testimonie.infinite.invalidate();
        return "Approved status toggled successfully!";
      },
      error: "Failed to toggle approved status",
    });
  };

  // Only show full loading state on initial load
  if (isLoading) {
    return (
      <section className="flex h-full flex-1 flex-col items-center justify-center">
        <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex h-full flex-1 flex-col items-center justify-center space-y-4">
        <div className="space-y-1 text-center">
          <h2 className="font-medium text-lg text-muted-foreground">
            Error Loading Testimonies
          </h2>
          <p className="text-muted-foreground text-sm">
            Something went wrong while loading testimonies.
          </p>
        </div>
      </section>
    );
  }

  const isFilterLoading = isFetching && !isFetchingNextPage && !isLoading;

  return (
    <section className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <ButtonGroup>
          {FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.value)}
              className="gap-1.5"
            >
              {f.icon}
              {f.label}
            </Button>
          ))}
        </ButtonGroup>

        {isFilterLoading && (
          <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {testimonies.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center space-y-4">
          <div className="space-y-1 text-center">
            <h2 className="font-medium text-lg text-muted-foreground">
              {filter === "all"
                ? "No Testimonies Found"
                : `No ${filter} testimonies`}
            </h2>
            <p className="text-muted-foreground text-sm">
              {filter === "all"
                ? "No testimonies have been collected yet."
                : `There are no ${filter} testimonies at the moment.`}
            </p>
          </div>
          {filter === "all" && (
            <Link
              className={buttonVariants({ variant: "default" })}
              href="/collect-link"
            >
              Start Collecting Testimonies
            </Link>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "space-y-4 transition-opacity",
            isFilterLoading && "opacity-60",
          )}
        >
          {testimonies.map((testimony) => (
            <TestimonieCard
              key={testimony.id}
              testimony={testimony}
              onToggleFeatured={handleToggleFeatured}
              onToggleApproved={handleToggleApproved}
            />
          ))}

          <div ref={ref} className="flex justify-center py-4">
            {isFetchingNextPage && (
              <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
            )}
            {!hasNextPage && testimonies.length > 0 && (
              <p className="text-muted-foreground text-sm">
                No more testimonies to load
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

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
        <div className="flex items-end justify-between border-t pt-4">
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
          <div className="flex items-center gap-6">
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

function RatingStars({ value }: { value: number }) {
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
