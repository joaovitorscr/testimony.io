import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { api, HydrateClient } from "@/trpc/server";
import WidgetConfigurator from "./_components/widget-configurator";
import { WidgetVisualizer } from "./_components/widget-visualizer";

export default async function WidgetPage() {
  void api.testimonie.all.prefetch();
  void api.widget.getWidgetConfig.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-svh flex-1 flex-col overflow-y-auto">
        <header className="px-8 py-8">
          <h1 className="font-bold text-3xl tracking-tight">
            Widget Configuration
          </h1>
          <p className="mt-1 text-muted-foreground">
            Configure your widget to display your testimonies in the way you
            want
          </p>
        </header>

        <div className="grid flex-1 grid-cols-2 gap-6 px-8 py-6">
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <WidgetConfigurator />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <WidgetVisualizer />
          </Suspense>
        </div>
      </main>
    </HydrateClient>
  );
}
