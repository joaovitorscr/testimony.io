import { getSession } from "@/server/better-auth/server";
import { api, HydrateClient } from "@/trpc/server";
import { TestimoniesList } from "./_components/testimonies-list";

export default async function TestimoniesPage() {
  const session = await getSession();

  if (session?.user.activeProjectId) {
    void api.testimonie.infinite.prefetchInfinite({ limit: 10, filter: "all" });
    void api.collectLink.currentProject.prefetch();
    void api.widget.getWidgetConfig.prefetch();
  }

  return (
    <HydrateClient>
      <main className="flex min-h-svh flex-1 flex-col overflow-y-auto">
        <header className="px-8 py-4">
          <h1 className="font-bold text-3xl tracking-tight">Testimonies</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your testimonies and collect feedback from your customers
          </p>
        </header>

        <div className="flex flex-1 gap-6 px-8 py-3">
          <TestimoniesList />
        </div>
      </main>
    </HydrateClient>
  );
}
