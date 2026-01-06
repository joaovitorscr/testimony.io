import { Suspense } from "react";
import { MembersList } from "@/app/(private)/settings/_components/members-list";

import { Skeleton } from "@/components/ui/skeleton";
import { api, HydrateClient } from "@/trpc/server";
import ProjectDetails from "./_components/project-details";

export default async function SettingsPage() {
  void api.project.currentProject.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-svh flex-1 flex-col">
        <header className="px-8 py-8">
          <h1 className="font-bold text-3xl tracking-tight">Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your project settings and team members.
          </p>
        </header>

        <div className="flex flex-1 flex-col gap-6 px-8 py-6">
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <ProjectDetails />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <MembersList />
          </Suspense>
        </div>
      </main>
    </HydrateClient>
  );
}
