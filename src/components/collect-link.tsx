import { SearchIcon } from "lucide-react";
import { env } from "@/env";
import { getActiveProjectId } from "@/server/actions/active-project";
import { db } from "@/server/db";
import { ToggleCollectLink } from "./toggle-collect-link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

export async function CollectLink() {
  const activeProject = await getActiveProjectId();

  if (!activeProject) return null;

  const testimonialLink = await db.testimonialLink.findUnique({
    where: {
      projectId: activeProject,
    },
  });

  if (!testimonialLink) {
    return null;
  }

  return (
    <Card className="border-border/80 bg-card/80">
      <CardHeader className="space-y-2 pb-4">
        <CardTitle className="text-sm font-semibold">Collect Link</CardTitle>
        <CardDescription className="text-xs">
          Share this link to gather new testimonies.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs font-mono text-muted-foreground">
            {`${env.NEXT_PUBLIC_APP_URL}/c/${testimonialLink.slug}`}
          </div>
          <Button
            variant="outline"
            size="icon-sm"
            className="border-border bg-background/60"
          >
            <SearchIcon className="size-3.5" />
            <span className="sr-only">Copy link</span>
          </Button>
        </div>
        <Separator className="bg-border/60" />
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Accepting responses</span>
          <ToggleCollectLink
            currentValue={testimonialLink.isActive}
            testimonialLinkId={testimonialLink.id}
          />
        </div>
      </CardContent>
    </Card>
  );
}
