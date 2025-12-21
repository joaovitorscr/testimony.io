"use client";

import { CopyIcon, Link2OffIcon } from "lucide-react";
import { toast } from "sonner";
import { env } from "@/env";
import { api } from "@/trpc/react";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

export function CollectLink() {
  const utils = api.useUtils();

  const [collectLink] = api.collectLink.currentProject.useSuspenseQuery();

  const toggleStatusMutation = api.collectLink.toggleStatus.useMutation({
    onSuccess: () => {
      void utils.collectLink.currentProject.invalidate();
    },
  });

  if (!collectLink) {
    return (
      <Card className="border-border/80 bg-card/80">
        <CardContent className="flex flex-col items-center justify-center space-y-1">
          <div className="rounded-full bg-accent p-2">
            <Link2OffIcon />
          </div>
          <h3>Collect Link Not Found</h3>
        </CardContent>
      </Card>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${env.NEXT_PUBLIC_APP_URL}/c/${collectLink.slug}`
    );
    toast.success("Link copied to clipboard");
  };

  const handleToggleStatus = async () => {
    toast.promise(
      toggleStatusMutation.mutateAsync({
        id: collectLink.id,
      }),
      {
        loading: "Updating status...",
        success: () => {
          if (collectLink.isActive) {
            return "Testimonies are now disabled";
          }

          return "Testimonies are now enabled";
        },
        error: "Failed to update status",
      }
    );
  };

  return (
    <Card className="border-border/80 bg-card/80">
      <CardHeader className="space-y-2 pb-4">
        <CardTitle className="font-semibold text-sm">Collect Link</CardTitle>
        <CardDescription className="text-xs">
          Share this link to gather new testimonies.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ButtonGroup className="w-full">
          <Input
            disabled
            className="w-full"
            value={`${env.NEXT_PUBLIC_APP_URL}/c/${collectLink.slug}`}
          />
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="border-border bg-background/60"
          >
            <CopyIcon />
            <span className="sr-only">Copy link</span>
          </Button>
        </ButtonGroup>

        <Separator className="bg-border/60" />
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Accepting responses</span>
          <Switch
            checked={collectLink.isActive}
            onCheckedChange={handleToggleStatus}
          />
        </div>
      </CardContent>
    </Card>
  );
}
