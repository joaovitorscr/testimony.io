"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation, usePaginatedQuery } from "convex/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

import { MediaFrame } from "@/components/media-frame";
import { useProject } from "@/components/project-context";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

import { TestimonieCard } from "./testimonie-card";

type TestimonyFilter = "all" | "approved" | "pending" | "featured";

const FILTERS: { label: string; value: TestimonyFilter }[] = [
  { label: "All", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "Featured", value: "featured" },
];

const GRID = "grid gap-x-4 gap-y-10 md:grid-cols-2 xl:grid-cols-3";

export function TestimoniesList() {
  const [filter, setFilter] = useState<TestimonyFilter>("all");
  const { ref, inView } = useInView();

  const { project } = useProject();
  const {
    results: testimonies,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.testimonials.list,
    { projectId: project._id, filter },
    { initialNumItems: 10 },
  );

  const setFeatured = useMutation(api.testimonials.setFeatured);
  const setApproved = useMutation(api.testimonials.setApproved);

  useEffect(() => {
    if (inView && status === "CanLoadMore") {
      loadMore(10);
    }
  }, [inView, status, loadMore]);

  const handleToggleFeatured = async (id: Id<"testimonials">, value: boolean) => {
    try {
      await setFeatured({ id, value });
    } catch {
      toast.error("Failed to update featured status");
    }
  };

  const handleToggleApproved = async (id: Id<"testimonials">, value: boolean) => {
    try {
      await setApproved({ id, value });
    } catch {
      toast.error("Failed to update approval status");
    }
  };

  return (
    <section className="flex flex-1 flex-col gap-8">
      <nav aria-label="Filter testimonies" className="flex flex-wrap items-center gap-1">
        {FILTERS.map((option) => (
          <Button
            key={option.value}
            variant={filter === option.value ? "secondary" : "ghost"}
            size="sm"
            aria-pressed={filter === option.value}
            onClick={() => {
              setFilter(option.value);
            }}
            className={filter === option.value ? undefined : "text-muted-foreground"}
          >
            {option.label}
          </Button>
        ))}
      </nav>

      {status === "LoadingFirstPage" && (
        <div className={GRID}>
          {[1, 2, 3].map((key) => (
            <div key={key} className="flex flex-col gap-4 border-t pt-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-40" />
            </div>
          ))}
        </div>
      )}

      {status !== "LoadingFirstPage" && testimonies.length === 0 && (
        <div className="flex max-w-sm flex-col gap-6 py-6">
          <MediaFrame still="dusk" className="aspect-video w-full" />
          <div className="flex flex-col gap-2">
            <h2 className="type-title text-fg-2">
              {filter === "all" ? "No testimonies yet" : `No ${filter} testimonies`}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filter === "all"
                ? "Send a collection link to a customer and their words will show up here."
                : `There are no ${filter} testimonies at the moment.`}
            </p>
          </div>
          {filter === "all" && (
            <Link
              className={buttonVariants({ size: "sm", className: "w-fit" })}
              href="/collect-link"
            >
              Create a collection link
            </Link>
          )}
        </div>
      )}

      {status !== "LoadingFirstPage" && testimonies.length > 0 && (
        <div className="flex flex-col gap-10">
          <div className={GRID}>
            {testimonies.map((testimony) => (
              <TestimonieCard
                key={testimony._id}
                testimony={testimony}
                onToggleFeatured={(id, value) => {
                  void handleToggleFeatured(id, value);
                }}
                onToggleApproved={(id, value) => {
                  void handleToggleApproved(id, value);
                }}
              />
            ))}
          </div>

          <div ref={ref} className="flex justify-center py-4">
            {status === "LoadingMore" && <Spinner className="text-muted-foreground" />}
            {status === "Exhausted" && (
              <p className="type-caption text-muted-foreground">No more testimonies to load</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
