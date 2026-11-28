"use client";

import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useForm, useWatch } from "react-hook-form";

import { useProject } from "@/components/project-context";
import { Skeleton } from "@/components/ui/skeleton";
import type { WidgetSettings } from "@/components/widgets/types";

import { InstallSnippet } from "./install-snippet";
import { WidgetConfigurator } from "./widget-configurator";
import { WidgetPreview } from "./widget-preview";

/** Settings beside a live preview, with the embed code underneath. */
export function DisplayEditor() {
  const { project } = useProject();
  const widget = useQuery(api.widgets.get, { projectId: project._id });

  if (widget === undefined) {
    return (
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <Skeleton className="h-96 w-full rounded-lg" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (widget === null) {
    return null;
  }

  return <Editor key={widget._id} widget={widget} />;
}

/** The form lives here so the preview shows each change before it saves. */
function Editor({ widget }: { widget: Doc<"widgets"> }) {
  const { layout, order, theme, accentColor, showRating, showAvatar } = widget;
  const form = useForm<WidgetSettings>({
    defaultValues: { layout, order, theme, accentColor, showRating, showAvatar },
  });
  const [layoutValue, orderValue, themeValue, accentValue, ratingValue, avatarValue] = useWatch({
    control: form.control,
    name: ["layout", "order", "theme", "accentColor", "showRating", "showAvatar"],
  });
  const settings: WidgetSettings = {
    layout: layoutValue,
    order: orderValue,
    theme: themeValue,
    accentColor: accentValue,
    showRating: ratingValue,
    showAvatar: avatarValue,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <WidgetConfigurator widgetId={widget._id} form={form} />
        <WidgetPreview projectId={widget.projectId} settings={settings} />
      </div>
      <InstallSnippet widgetId={widget._id} />
    </div>
  );
}
