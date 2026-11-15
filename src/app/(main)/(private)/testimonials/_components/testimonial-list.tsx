"use client";

import { api } from "@convex/_generated/api";
import { usePaginatedQuery, useQuery } from "convex/react";
import Link from "next/link";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { CollectionLink } from "@/components/collection-link";
import { MediaFrame } from "@/components/media-frame";
import { useProject } from "@/components/project-context";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TestimonialActions } from "./testimonial-actions";
import { type Testimonial, TestimonialCard } from "./testimonial-card";

const STATUSES = ["pending", "approved", "archived"] as const;
type Status = (typeof STATUSES)[number];

const LABELS: Record<Status, string> = {
  pending: "Pending",
  approved: "Approved",
  archived: "Archived",
};

const EMPTY: Record<Status, { title: string; description: string }> = {
  pending: {
    title: "You're all caught up",
    description:
      "New testimonials land here first. Nothing shows on your site until you approve it.",
  },
  approved: {
    title: "Nothing approved yet",
    description: "Approved testimonials are the ones your widget shows.",
  },
  archived: {
    title: "Nothing archived",
    description:
      "Archive testimonials you don't want to show. They stay here in case you change your mind.",
  },
};

const GRID = "grid gap-x-4 gap-y-10 md:grid-cols-2 xl:grid-cols-3";

/** First-run state: nothing collected yet, so the next step is sharing the link. */
function GetStarted() {
  return (
    <div className="flex max-w-xl flex-col gap-6 py-6">
      <MediaFrame still="dusk" className="aspect-video w-full max-w-sm" />
      <div className="flex flex-col gap-2">
        <h2 className="type-title text-fg-2">Collect your first testimonial</h2>
        <p className="text-sm text-muted-foreground">
          Send this link to a happy customer, or put it in an email or your app. Their words land
          here for you to approve, then show up wherever you{" "}
          <Link href="/display" className="underline underline-offset-4">
            embed the widget
          </Link>
          .
        </p>
      </div>
      <CollectionLink id="first-run-link" />
    </div>
  );
}

function EmptyQueue({ status }: { status: Status }) {
  return (
    <div className="flex max-w-sm flex-col gap-2 py-6">
      <h2 className="type-title text-fg-2">{EMPTY[status].title}</h2>
      <p className="text-sm text-muted-foreground">{EMPTY[status].description}</p>
      {status === "approved" && (
        <Link
          className={buttonVariants({ size: "sm", variant: "secondary", className: "mt-4 w-fit" })}
          href="/display"
        >
          Set up the widget
        </Link>
      )}
    </div>
  );
}

function Queue({ status }: { status: Status }) {
  const { project } = useProject();
  const { ref, inView } = useInView();
  const {
    results,
    status: loading,
    loadMore,
  } = usePaginatedQuery(
    api.testimonials.list,
    { projectId: project._id, status },
    { initialNumItems: 12 },
  );

  useEffect(() => {
    if (inView && loading === "CanLoadMore") {
      loadMore(12);
    }
  }, [inView, loading, loadMore]);

  if (loading === "LoadingFirstPage") {
    return (
      <div className={GRID}>
        {[1, 2, 3].map((key) => (
          <div key={key} className="flex flex-col gap-4 border-t pt-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-40" />
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return <EmptyQueue status={status} />;
  }

  return (
    <div className="flex flex-col gap-10">
      <div className={GRID}>
        {results.map((testimonial: Testimonial) => (
          <TestimonialCard
            key={testimonial._id}
            testimonial={testimonial}
            actions={<TestimonialActions testimonial={testimonial} />}
          />
        ))}
      </div>
      <div ref={ref} className="flex min-h-8 justify-center">
        {loading === "LoadingMore" && <Spinner className="text-muted-foreground" />}
      </div>
    </div>
  );
}

/** The review queue: pending first, then what is live, then what was set aside. */
export function TestimonialList() {
  const { project } = useProject();
  const counts = useQuery(api.testimonials.counts, { projectId: project._id });
  const [status, setStatus] = useQueryState(
    "status",
    parseAsStringLiteral(STATUSES).withDefault("pending"),
  );

  if (counts === undefined) {
    return <Skeleton className="h-9 w-72" />;
  }

  if (counts.pending + counts.approved + counts.archived === 0) {
    return <GetStarted />;
  }

  const label = (value: number) => (value >= counts.cap ? `${counts.cap}+` : String(value));

  return (
    <Tabs
      value={status}
      onValueChange={(value) => {
        const next = STATUSES.find((candidate) => candidate === value);
        if (next !== undefined) {
          void setStatus(next);
        }
      }}
      className="gap-8"
    >
      <TabsList>
        {STATUSES.map((value) => (
          <TabsTrigger key={value} value={value} className="gap-2">
            {LABELS[value]}
            <span className="text-muted-foreground tabular-nums">{label(counts[value])}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {STATUSES.map((value) => (
        <TabsContent key={value} value={value}>
          <Queue status={value} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
