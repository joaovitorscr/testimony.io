"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

import { PageHeading } from "@/components/page-heading";
import { useProject } from "@/components/project-context";
import { Skeleton } from "@/components/ui/skeleton";

import { CreateLinkCard } from "./_components/create-link-card";
import { LinksTable } from "./_components/links-table";
import { StatsHeader } from "./_components/stats-header";

export default function CollectLinkPage() {
  const { project } = useProject();
  const data = useQuery(api.requests.list, { projectId: project._id });

  return (
    <div className="flex min-h-svh flex-1 flex-col">
      <PageHeading
        title="Collection links"
        description="Generate unique links to collect testimonials from your customers."
      />

      <div className="flex flex-1 flex-col gap-16 px-5 pb-16 md:px-8">
        {data === undefined ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {[1, 2, 3, 4].map((key) => (
              <div key={key} className="flex flex-col gap-2 border-t pt-4">
                <Skeleton className="h-10 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <StatsHeader stats={data.stats} />
        )}

        <CreateLinkCard />

        {data === undefined ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <LinksTable requests={data.requests} slug={data.slug} />
        )}
      </div>
    </div>
  );
}
