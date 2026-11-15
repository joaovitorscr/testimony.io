"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { parseAsStringLiteral, useQueryState } from "nuqs";

import { useProject } from "@/components/project-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { WidgetConfigurator } from "./widget-configurator";
import { WidgetDomains } from "./widget-domains";
import { WidgetVisualizer } from "./widget-visualizer";

const availableTabs = ["configuration", "domains"] as const;
type AvailableTabs = (typeof availableTabs)[number];

function isTab(value: string): value is AvailableTabs {
  return (availableTabs as readonly string[]).includes(value);
}

// Tab rail: grey 24px titles, the active one darker.
const railTrigger =
  "h-auto flex-none rounded-none border-0 p-0 type-title text-fg-faint transition-colors duration-150 hover:text-fg-2 data-[state=active]:bg-transparent data-[state=active]:text-fg-2";

export function WidgetTabs() {
  const [currentTab, setCurrentTab] = useQueryState<AvailableTabs>(
    "t",
    parseAsStringLiteral(availableTabs).withDefault("configuration"),
  );
  const { project } = useProject();
  const widget = useQuery(api.widgets.get, { projectId: project._id });

  if (widget === undefined) {
    return (
      <div className="flex flex-col gap-6 px-5 pb-16 md:px-8">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (widget === null) {
    return null;
  }

  return (
    <Tabs
      className="gap-6 px-5 pb-16 md:px-8"
      defaultValue="configuration"
      value={currentTab}
      onValueChange={(value) => {
        if (isTab(value)) {
          void setCurrentTab(value);
        }
      }}
    >
      <TabsList className="h-auto w-full justify-start gap-4 rounded-none bg-transparent p-0">
        <TabsTrigger value="configuration" className={railTrigger}>
          Configuration
        </TabsTrigger>
        <span aria-hidden className="h-px flex-1 bg-border" />
        <TabsTrigger value="domains" className={railTrigger}>
          Domains
        </TabsTrigger>
      </TabsList>
      <div className="rounded-xl border p-4 md:p-6">
        <TabsContent value="configuration">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <WidgetConfigurator key={widget._id} widget={widget} />
            <WidgetVisualizer widget={widget} />
          </div>
        </TabsContent>
        <TabsContent value="domains">
          <WidgetDomains widget={widget} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
