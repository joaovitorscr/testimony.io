import { headers } from "next/headers";
import { OnboardingDialog } from "@/components/onboarding-dialog";
import { PageHeader } from "@/components/page-header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/server/better-auth";
import { getActiveProjectId, getSession } from "@/server/better-auth/server";
import { api } from "@/trpc/server";

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const projects = await api.project.all();

  const showOnboarding = projects.length === 0;

  if (showOnboarding) {
    return (
      <main className="min-h-svh flex-1 bg-linear-to-br from-primary/30 via-primary/10 to-primary/5">
        <OnboardingDialog open={true} />
      </main>
    );
  }

  if (!session.user.activeProjectId && projects.length > 0) {
    await auth.api.updateUser({
      body: {
        activeProjectId: projects[0].id,
      },
      headers: await headers(),
    });
  }

  const activeProjectId = await getActiveProjectId();

  if (!activeProjectId) {
    return null;
  }

  return (
    <SidebarProvider className="h-screen">
      <AppSidebar projects={projects} activeProjectId={activeProjectId} />
      <SidebarInset>
        <PageHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
