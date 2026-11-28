"use client";

import { api } from "@convex/_generated/api";
import { usePaginatedQuery, useQuery } from "convex/react";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { type ReactNode, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { CollectionLink } from "@/components/collection-link";
import { useProject } from "@/components/project-context";
import { buttonVariants } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
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

const GRID = "grid grid-cols-1 gap-3 xl:grid-cols-2";

/** Dashed well for empty and first-run states. */
function EmptyWell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-[var(--radius)] border border-dashed border-border bg-card px-6 py-10 sm:px-10">
      {children}
    </div>
  );
}

/** First-run state: nothing collected yet, so the next step is sharing the link. */
function GetStarted() {
  return (
    <EmptyWell>
      <div className="flex max-w-xl flex-col gap-1.5">
        <h2 className="font-display text-[20px] font-normal tracking-[-0.01em] text-foreground">
          Collect your first testimonial
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Send this link to a happy customer, or put it in an email or your app. Their words land
          here for you to approve, then show up wherever you{" "}
          <Link
            href="/display"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            embed the widget
          </Link>
          .
        </p>
      </div>
      <div className="w-full max-w-xl">
        <CollectionLink id="first-run-link" />
      </div>
    </EmptyWell>
  );
}

function EmptyQueue({ status, searching }: { status: Status; searching: boolean }) {
  return (
    <EmptyWell>
      <div className="flex max-w-md flex-col gap-1.5">
        <h2 className="font-display text-[20px] font-normal tracking-[-0.01em] text-foreground">
          {searching ? "No matches" : EMPTY[status].title}
        </h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          {searching
            ? "Nothing loaded here matches your search. Try another word or clear it."
            : EMPTY[status].description}
        </p>
      </div>
      {status === "approved" && !searching && (
        <Link className={buttonVariants({ size: "sm", variant: "outline" })} href="/display">
          Set up the widget
        </Link>
      )}
    </EmptyWell>
  );
}

/** Matches the quote, name, title or company, ignoring case. */
function matches(testimonial: Testimonial, query: string) {
  const needle = query.trim().toLowerCase();
  if (needle === "") {
    return true;
  }
  return [
    testimonial.text,
    testimonial.customerName,
    testimonial.customerTitle,
    testimonial.customerCompany,
  ].some((part) => part?.toLowerCase().includes(needle) === true);
}

function Queue({ status, search }: { status: Status; search: string }) {
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
          <div key={key} className="flex flex-col gap-4 rounded-lg border border-border p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-8 w-40" />
          </div>
        ))}
      </div>
    );
  }

  const visible = results.filter((testimonial: Testimonial) => matches(testimonial, search));

  if (visible.length === 0) {
    return <EmptyQueue status={status} searching={results.length > 0} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className={GRID}>
        {visible.map((testimonial) => (
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
  const [search, setSearch] = useState("");

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
      className="gap-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TabsList>
          {STATUSES.map((value) => (
            <TabsTrigger key={value} value={value}>
              {LABELS[value]}
              <span className="text-xs text-muted-foreground tabular-nums">
                {label(counts[value])}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        <InputGroup className="h-8.5 sm:max-w-64">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            aria-label="Search loaded testimonials"
            placeholder="Search testimonials"
            className="text-[13px]"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </InputGroup>
      </div>
      {STATUSES.map((value) => (
        <TabsContent key={value} value={value}>
          <Queue status={value} search={search} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
