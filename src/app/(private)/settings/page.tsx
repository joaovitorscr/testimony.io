import { getActiveProjectId } from "@/server/actions/active-project";
import { db } from "@/server/db";
import { MembersList } from "@/components/settings/members-list";
import { InviteDialog } from "@/components/settings/invite-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/server/auth";
import { headers } from "next/headers";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const activeProjectId = await getActiveProjectId();

  if (!activeProjectId || !session) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Please select a project to view settings.</p>
      </div>
    );
  }

  const project = await db.project.findUnique({
    where: { id: activeProjectId },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      invitations: {
        where: {
          status: "pending",
        },
      },
    },
  });

  if (!project) {
     return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Project not found.</p>
      </div>
    );
  }

  const isOwner = project.userId === session.user.id;

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your project settings and team members.
        </p>
      </div>
      
      <Separator />

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Basic information about your project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
                <div className="text-sm font-medium">Project Name</div>
                <div className="text-sm text-muted-foreground">{project.name}</div>
            </div>
             <div className="mt-4 grid gap-2">
                <div className="text-sm font-medium">Slug</div>
                <div className="text-sm text-muted-foreground">{project.slug}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1.5">
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage who has access to this project.
              </CardDescription>
            </div>
            <InviteDialog projectId={project.id} />
          </CardHeader>
          <CardContent>
             <MembersList 
                members={project.members} 
                invitations={project.invitations}
                currentUserId={session.user.id}
                isOwner={isOwner}
             />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
