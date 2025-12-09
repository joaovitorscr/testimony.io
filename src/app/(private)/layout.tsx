import { headers } from "next/headers";
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
    return null;
  }

  const projects = await db.project.findMany({
    where: {
      OR: [
        { userId: session.user.id },
        { members: { some: { userId: session.user.id } } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  const activeProjectId = await getActiveProjectId();

  const showOnboarding = projects.length === 0;

  return (
    <SidebarProvider className="h-screen">
      <AppSidebar projects={projects} activeProjectId={activeProjectId} />
      <SidebarInset>{children}</SidebarInset>
      <OnboardingDialog open={showOnboarding} />
    </SidebarProvider>
  );
}
