import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { api, HydrateClient } from "@/trpc/server";
import { CreateLinkCard } from "./_components/create-link-card";
import { LinksTable } from "./_components/links-table";
import { StatsHeader } from "./_components/stats-header";

export default async function CollectLinkPage() {
  void api.token.getAll.prefetch();
  void api.token.getStats.prefetch();

  return (
    <HydrateClient>
      <div className="flex min-h-svh flex-1 flex-col">
        <Suspense
          fallback={
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
          }
        >
          <StatsHeader />
        </Suspense>

        <main className="flex flex-1 flex-col gap-8 px-8 py-3">
          <CreateLinkCard />

          <Suspense
            fallback={
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="overflow-hidden rounded-xl border">
                  <div className="border-b bg-muted/30 px-6 py-3">
                    <Skeleton className="h-4 w-full" />
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-b px-6 py-4 last:border-0">
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <LinksTable />
          </Suspense>
        </main>
      </div>
    </HydrateClient>
  );
}
