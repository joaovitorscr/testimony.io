import { Suspense } from "react";
import { MembersList } from "@/app/(private)/settings/_components/members-list";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { api, HydrateClient } from "@/trpc/server";
import ProjectDetails from "./_components/project-details";

export default async function SettingsPage() {
  void api.project.currentProject.prefetch();

  return (
    <HydrateClient>
      <div className="flex flex-1 flex-col gap-8 p-8">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your project settings and team members.
          </p>
        </div>

        <Separator />

        <div className="grid gap-8">
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <ProjectDetails />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <MembersList />
          </Suspense>
        </div>
      </div>
    </HydrateClient>
  );
}
