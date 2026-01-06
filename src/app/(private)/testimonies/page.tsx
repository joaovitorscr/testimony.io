import { Suspense } from "react";
import { CollectLink } from "@/components/collect-link";
import { MinimalWidgetEditor } from "@/components/minimal-widget-editor";

import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@/server/better-auth/server";
import { api, HydrateClient } from "@/trpc/server";
import { TestimoniesList } from "./_components/testimonies-list";

export default async function TestimoniesPage() {
  const session = await getSession();

  if (session?.user.activeProjectId) {
    void api.testimonie.all.prefetch();
    void api.collectLink.currentProject.prefetch();
    void api.widget.getWidgetConfig.prefetch();
  }

  return (
    <HydrateClient>
      <main className="flex min-h-svh flex-1 flex-col">
        <header className="px-8 py-8">
          <h1 className="font-bold text-3xl tracking-tight">Testimonies</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your testimonies and collect feedback from your customers
          </p>
        </header>

        <div className="flex flex-1 gap-6 px-8 py-6">
          <Suspense fallback={<Skeleton className="h-40 flex-1" />}>
            <TestimoniesList />
          </Suspense>

          {/* Right Side Widgets */}
          <aside className="flex w-[400px] flex-col gap-4">
            <Suspense fallback={<Skeleton className="h-40 w-full" />}>
              <CollectLink />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-40 w-full" />}>
              <MinimalWidgetEditor />
            </Suspense>
          </aside>
        </div>
      </main>
    </HydrateClient>
  );
}
