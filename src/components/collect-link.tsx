"use client";

import { SearchIcon } from "lucide-react";
import { env } from "@/env";
import { api } from "@/trpc/react";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

export function CollectLink() {
  const [testimonialLinkResult] = api.project.getCollectLink.useSuspenseQuery();
  const testimonialLink = testimonialLinkResult.testimonialLink;

  if (!testimonialLinkResult.success || !testimonialLink) {
    return (
      <Card className="border-border/80 bg-card/80">
        <CardHeader className="space-y-2 pb-4">
          <CardTitle className="font-semibold text-sm">
            Collect Link Not Found
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-border/80 bg-card/80">
      <CardHeader className="space-y-2 pb-4">
        <CardTitle className="font-semibold text-sm">Collect Link</CardTitle>
        <CardDescription className="text-xs">
          Share this link to gather new testimonies.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg border border-border bg-muted/40 px-3 py-2 font-mono text-muted-foreground text-xs">
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
          <Switch checked={testimonialLink.isActive} />
        </div>
      </CardContent>
    </Card>
  );
}
