"use client";

import { keepPreviousData } from "@tanstack/react-query";
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { TestimonyFilter } from "@/server/api/routers/testimonie";
import { api } from "@/trpc/react";
import { TestimonieCard } from "./testimonie-card";

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

  const isMobile = useIsMobile();

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
        <ButtonGroup
          orientation={isMobile ? "vertical" : "horizontal"}
          className={cn(isMobile && "w-full")}
        >
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
