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

export function WidgetTabs() {
  const [currentTab, setCurrentTab] = useQueryState<AvailableTabs>(
    "t",
    parseAsStringLiteral(availableTabs).withDefault("configuration"),
  );
  const { project } = useProject();
  const widget = useQuery(api.widgets.get, { projectId: project._id });

  if (widget === undefined) {
    return (
      <div className="grid grid-cols-1 gap-6 px-8 py-3 lg:grid-cols-2">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (widget === null) {
    return null;
  }

  return (
    <Tabs
      className="px-8 py-3"
      defaultValue="configuration"
      value={currentTab}
      onValueChange={(value) => {
        if (isTab(value)) {
          void setCurrentTab(value);
        }
      }}
    >
      <TabsList>
        <TabsTrigger value="configuration">Configuration</TabsTrigger>
        <TabsTrigger value="domains">Domains</TabsTrigger>
      </TabsList>
      <TabsContent value="configuration">
        <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
          <WidgetConfigurator key={widget._id} widget={widget} />
          <WidgetVisualizer widget={widget} />
        </div>
      </TabsContent>
      <TabsContent value="domains">
        <div className="py-6">
          <WidgetDomains widget={widget} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
