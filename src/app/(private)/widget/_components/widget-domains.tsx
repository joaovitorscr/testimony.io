"use client";

import { Globe, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";

export function WidgetDomains() {
  const [newDomain, setNewDomain] = useState("");
  const utils = api.useUtils();

  const [widgetConfig] = api.widget.getWidgetConfig.useSuspenseQuery();
  const domains = widgetConfig?.allowedDomains ?? [];

  const { mutate: updateDomains, isPending } =
    api.widget.registerWidgetDomains.useMutation({
      onSuccess: () => {
        utils.widget.getWidgetConfig.invalidate();
        setNewDomain("");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleAddDomain = () => {
    if (!widgetConfig?.id) return;

    const trimmedDomain = newDomain.trim();
    if (!trimmedDomain) return;

    // Simple URL validation
    try {
      new URL(trimmedDomain);
    } catch {
      toast.error("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    if (domains.includes(trimmedDomain)) {
      toast.error("This domain is already added");
      return;
    }

    updateDomains({
      widgetId: widgetConfig.id,
      domains: [...domains, trimmedDomain],
    });
  };

  const handleRemoveDomain = (domainToRemove: string) => {
    if (!widgetConfig?.id) return;

    updateDomains({
      widgetId: widgetConfig.id,
      domains: domains.filter((d) => d !== domainToRemove),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddDomain();
    }
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="size-5" />
          Allowed Domains
        </CardTitle>
        <CardDescription>
          Add the domains where your widget is allowed to be embedded. Only
          these domains will be able to display your testimonials widget.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
          />
          <Button
            onClick={handleAddDomain}
            disabled={isPending || !newDomain.trim()}
            size="icon"
            variant="outline"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        {domains.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {domains.map((domain) => (
              <Badge
                key={domain}
                variant="secondary"
                className="gap-1.5 py-1.5 pr-1.5 pl-3"
              >
                <span className="max-w-48 truncate">{domain}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDomain(domain)}
                  disabled={isPending}
                  className="rounded p-0.5 transition-colors hover:bg-muted-foreground/20"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-muted-foreground text-sm">
            No domains added yet. Add a domain to allow widget embedding.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
