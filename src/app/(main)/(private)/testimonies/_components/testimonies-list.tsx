"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation, usePaginatedQuery } from "convex/react";
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
import { useProject } from "@/components/project-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TestimonieCard } from "./testimonie-card";

type TestimonyFilter = "all" | "approved" | "pending" | "featured";

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

  const handleToggleFeatured = (id: Id<"testimonials">, value: boolean) => {
    setFeatured({ id, value }).catch(() =>
      toast.error("Failed to update featured status"),
    );
  };

  const handleToggleApproved = (id: Id<"testimonials">, value: boolean) => {
    setApproved({ id, value }).catch(() =>
      toast.error("Failed to update approval status"),
    );
  };

  // Only show full loading state on initial load
  if (status === "LoadingFirstPage") {
    return (
      <section className="flex h-full flex-1 flex-col items-center justify-center">
        <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
      </section>
    );
  }

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
        <div className="space-y-4">
          {testimonies.map((testimony) => (
            <TestimonieCard
              key={testimony._id}
              testimony={testimony}
              onToggleFeatured={handleToggleFeatured}
              onToggleApproved={handleToggleApproved}
            />
          ))}

          <div ref={ref} className="flex justify-center py-4">
            {status === "LoadingMore" && (
              <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
            )}
            {status === "Exhausted" && testimonies.length > 0 && (
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
