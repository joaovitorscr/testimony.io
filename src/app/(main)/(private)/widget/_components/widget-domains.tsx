"use client";

import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { normalizeHost } from "@convex/lib/hosts";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Globe, Plus, Trash2 } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function WidgetDomains({ widget: widgetConfig }: { widget: Doc<"widgets"> }) {
  const [newDomain, setNewDomain] = useState("");
  const [isPending, setIsPending] = useState(false);
  const domains = widgetConfig.allowedDomains;
  const setAllowedDomains = useMutation(api.widgets.setAllowedDomains);

  const updateDomains = async (args: { widgetId: Doc<"widgets">["_id"]; domains: string[] }) => {
    setIsPending(true);
    try {
      await setAllowedDomains(args);
      setNewDomain("");
    } catch (error) {
      toast.error(error instanceof ConvexError ? String(error.data) : "Failed to update domains");
    }
    setIsPending(false);
  };

  const handleAddDomain = () => {
    const trimmedDomain = newDomain.trim();
    const host = normalizeHost(trimmedDomain);
    if (host === null) {
      toast.error("Enter a domain or URL, e.g. example.com");
      return;
    }

    if (domains.some((domain) => normalizeHost(domain) === host)) {
      toast.error("This domain is already added");
      return;
    }

    void updateDomains({
      widgetId: widgetConfig._id,
      domains: [...domains, trimmedDomain],
    });
  };

  const handleRemoveDomain = (domainToRemove: string) => {
    void updateDomains({
      widgetId: widgetConfig._id,
      domains: domains.filter((domain) => domain !== domainToRemove),
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
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
          Add the domains where your widget is allowed to be embedded. Only these domains will be
          able to display your testimonials widget.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com"
            value={newDomain}
            onChange={(event) => {
              setNewDomain(event.target.value);
            }}
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
              <Badge key={domain} variant="secondary" className="gap-1.5 py-1.5 pr-1.5 pl-3">
                <span className="max-w-48 truncate">{domain}</span>
                <button
                  type="button"
                  onClick={() => {
                    handleRemoveDomain(domain);
                  }}
                  disabled={isPending}
                  className="rounded p-0.5 transition-colors hover:bg-muted-foreground/20"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No domains added yet. Add a domain to allow widget embedding.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
