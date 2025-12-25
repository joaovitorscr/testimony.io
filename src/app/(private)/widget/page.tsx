import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/server";
import WidgetConfigurator from "./_components/widget-configurator";
import { WidgetVisualizer } from "./_components/widget-visualizer";

export default async function WidgetPage() {
  void api.testimonie.all.prefetch();
  void api.widget.getWidgetConfig.prefetch();

  return (
    <main className="grid grid-cols-2 gap-4 p-8">
      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        <WidgetConfigurator />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        <WidgetVisualizer />
      </Suspense>
    </main>
  );
}
