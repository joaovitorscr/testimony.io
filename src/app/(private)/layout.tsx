import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { OnboardingDialog } from "@/components/onboarding-dialog";
import { db } from "@/server/db";
import { getActiveProjectId } from "@/server/actions/active-project";

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

  // Check if the user has any personal projects
  const personalProjectsCount = await db.project.count({
    where: {
      userId: session.user.id,
    },
  });

  // Check if the user is a member of any organization
  const organizationMemberships = await db.member.count({
    where: {
      userId: session.user.id,
    },
  });
  
  const showOnboarding = personalProjectsCount === 0 && organizationMemberships === 0;

  const activeOrganizationId = session.session.activeOrganizationId;
  
  // Fetch projects based on current context (Active Org or User)
  const projects = await db.project.findMany({
    where: activeOrganizationId 
      ? { organizationId: activeOrganizationId }
      : { userId: session.user.id },
    select: {
      id: true,
      name: true,
      slug: true,
    }
  });

  const activeProjectId = await getActiveProjectId();

  return (
    <SidebarProvider className="h-screen">
      <AppSidebar projects={projects} activeProjectId={activeProjectId} />
      <SidebarInset>{children}</SidebarInset>
      <OnboardingDialog open={showOnboarding} />
    </SidebarProvider>
  );
}
