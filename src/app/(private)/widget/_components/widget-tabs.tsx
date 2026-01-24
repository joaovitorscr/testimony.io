"use client";

import { parseAsStringLiteral, useQueryState } from "nuqs";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WidgetConfigurator from "./widget-configurator";
import { WidgetDomains } from "./widget-domains";
import { WidgetVisualizer } from "./widget-visualizer";

const availableTabs = ["configuration", "domains"] as const;
type AvailableTabs = (typeof availableTabs)[number];

export function WidgetTabs() {
  const [currentTab, setCurrentTab] = useQueryState<AvailableTabs>(
    "t",
    parseAsStringLiteral(availableTabs).withDefault("configuration"),
  );

  return (
    <Tabs
      className="px-8"
      defaultValue="configuration"
      value={currentTab}
      onValueChange={(value) => setCurrentTab(value as AvailableTabs)}
    >
      <TabsList>
        <TabsTrigger value="configuration">Configuration</TabsTrigger>
        <TabsTrigger value="domains">Domains</TabsTrigger>
      </TabsList>
      <TabsContent value="configuration">
        <div className="grid flex-1 grid-cols-1 gap-6 py-6 lg:grid-cols-2">
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <WidgetConfigurator />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <WidgetVisualizer />
          </Suspense>
        </div>
      </TabsContent>
      <TabsContent value="domains">
        <div className="py-6">
          <Suspense fallback={<Skeleton className="h-40 w-full max-w-xl" />}>
            <WidgetDomains />
          </Suspense>
        </div>
      </TabsContent>
    </Tabs>
  );
}
