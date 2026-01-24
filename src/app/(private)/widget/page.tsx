import { api, HydrateClient } from "@/trpc/server";
import { WidgetTabs } from "./_components/widget-tabs";

export default async function WidgetPage() {
  void api.testimonie.all.prefetch();

  void api.widget.getWidgetConfig.prefetch();
  void api.widget.getWidgetDomains.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-svh flex-1 flex-col overflow-y-auto">
        <header className="px-8 py-4">
          <h1 className="font-bold text-3xl tracking-tight">
            Widget Configuration
          </h1>
          <p className="mt-1 text-muted-foreground">
            Configure your widget to display your testimonies in the way you
            want
          </p>
        </header>

        <WidgetTabs />
      </main>
    </HydrateClient>
  );
}
