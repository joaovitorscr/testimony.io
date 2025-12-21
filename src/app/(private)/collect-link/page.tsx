import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveProjectId } from "@/server/better-auth/server";
import { db } from "@/server/db";
import { CreateTokenForm } from "./_components/create-token-form";
import { TokenList } from "./_components/token-list";

export default async function CollectLinkPage() {
  const activeProjectId = await getActiveProjectId();

  if (!activeProjectId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">
          Please select a project to view collection links.
        </p>
      </div>
    );
  }

  const tokens = await db.testimonialToken.findMany({
    where: { projectId: activeProjectId },
    orderBy: { createdAt: "desc" },
    include: {
      project: {
        select: {
          slug: true,
        },
      },
    },
  });

  const stats = {
    total: tokens.length,
    active: tokens.filter((t) => !t.used && !t.cancelled).length,
    used: tokens.filter((t) => t.used).length,
    cancelled: tokens.filter((t) => t.cancelled).length,
  };

  return (
    <div className="flex flex-1 flex-col gap-8 overflow-auto p-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Collection Links</h1>
        <p className="text-muted-foreground">
          Create and manage unique links to collect testimonials.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.used}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-muted-foreground">
              {stats.cancelled}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8">
        <CreateTokenForm />
        <TokenList tokens={tokens} />
      </div>
    </div>
  );
}
