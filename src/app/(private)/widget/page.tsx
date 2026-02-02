import { Suspense } from "react";
import { CopyWidgetId } from "@/components/copy-widget-id";
import { Skeleton } from "@/components/ui/skeleton";
import { api, HydrateClient } from "@/trpc/server";
import { WidgetTabs } from "./_components/widget-tabs";

export default async function WidgetPage() {
  void api.testimonie.all.prefetch();

  void api.widget.getWidgetConfig.prefetch();
  void api.widget.getWidgetDomains.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-svh flex-1 flex-col overflow-y-auto">
        <header className="flex items-center justify-between px-8 py-4">
          <div className="flex flex-col">
            <h1 className="font-bold text-3xl tracking-tight">
              Widget Configuration
            </h1>
            <p className="mt-1 text-muted-foreground">
              Configure your widget to display your testimonies in the way you
              want
            </p>
          </div>
          <Suspense fallback={<Skeleton className="h-10 w-64" />}>
            <CopyWidgetId />
          </Suspense>
        </header>

        <WidgetTabs />
      </main>
    </HydrateClient>
  );
}
