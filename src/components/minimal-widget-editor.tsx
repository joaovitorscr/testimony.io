import { Switch } from "@radix-ui/react-switch";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function MinimalWidgetEditor() {
  return (
    <Card className="flex flex-1 flex-col border-border/80 bg-card/80">
      <CardHeader className="flex items-center justify-between pb-3">
        <div>
          <CardTitle className="text-sm font-semibold">Widget Editor</CardTitle>
          <CardDescription className="text-xs">
            Preview how your widget looks on your site.
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          Edit
        </Button>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4 pb-4">
        <div className="rounded-xl border border-border/80 bg-muted/40 p-4">
          <div className="space-y-2">
            <div className="h-2.5 w-24 rounded-full bg-muted" />
            <div className="h-2 w-40 rounded-full bg-muted/80" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-2 w-full rounded-full bg-muted/60" />
            <div className="h-2 w-5/6 rounded-full bg-muted/40" />
            <div className="h-2 w-2/3 rounded-full bg-muted/40" />
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Dark Mode</span>
            <Switch checked={true} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Show Avatars</span>
            <Switch checked={true} />
          </div>
          <Button className="mt-1 w-full rounded-full text-xs font-medium">
            Publish Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
