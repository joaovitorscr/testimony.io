import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { OnboardingDialog } from "@/components/onboarding-dialog";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getActiveProjectId } from "@/server/actions/active-project";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const activeOrganizationId = session.session.activeOrganizationId;

  const [
    personalProjectsCount,
    organizationMemberships,
    projects,
    activeProjectId,
  ] = await Promise.all([
    // Check if the user has any personal projects
    db.project.count({
      where: {
        userId: session.user.id,
      },
    }),
    // Check if the user is a member of any organization
    db.member.count({
      where: {
        userId: session.user.id,
      },
    }),
    // Fetch projects based on current context (Active Org or User)
    db.project.findMany({
      where: activeOrganizationId
        ? { organizationId: activeOrganizationId }
        : { userId: session.user.id },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    getActiveProjectId(),
  ]);

  const showOnboarding =
    personalProjectsCount === 0 && organizationMemberships === 0;

  return (
    <SidebarProvider className="h-screen">
      <AppSidebar projects={projects} activeProjectId={activeProjectId} />
      <SidebarInset>{children}</SidebarInset>
      <OnboardingDialog open={showOnboarding} />
    </SidebarProvider>
  );
}
