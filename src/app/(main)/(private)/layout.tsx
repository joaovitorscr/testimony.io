import { PageHeader } from "@/components/page-header";
import { ProjectProvider } from "@/components/project-provider";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProjectProvider>
      <SidebarProvider className="h-screen">
        <AppSidebar />
        <SidebarInset className="min-h-0 min-w-0">
          <PageHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ProjectProvider>
  );
}
