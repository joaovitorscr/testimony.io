"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { useProject } from "@/components/project-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateLinkCard } from "./_components/create-link-card";
import { LinksTable } from "./_components/links-table";
import { StatsHeader } from "./_components/stats-header";

export default function CollectLinkPage() {
  const { project } = useProject();
  const data = useQuery(api.requests.list, { projectId: project._id });

  return (
    <div className="flex min-h-svh flex-1 flex-col">
      {data === undefined ? (
        <div className="px-8 py-4">
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="mb-6 h-4 w-80" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </div>
      ) : (
        <StatsHeader stats={data.stats} />
      )}

      <main className="flex flex-1 flex-col gap-8 px-8 py-3">
        <CreateLinkCard />

        {data === undefined ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        ) : (
          <LinksTable requests={data.requests} slug={data.slug} />
        )}
      </main>
    </div>
  );
}
