"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  LayoutGridIcon,
  ListIcon,
  MoonIcon,
  SunIcon,
  SunMoonIcon,
} from "lucide-react";
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { FieldGroup, FieldSeparator, FieldSet, FieldLegend } from "@/components/ui/field";
import type { WidgetSettings } from "@/components/widgets/types";

import { type ChoiceOption, ChoiceField, ColorField, SwitchField } from "./widget-fields";

const layoutOptions: ChoiceOption[] = [
  { id: "grid", title: "Grid", description: "Cards wrap to fit the width.", icon: LayoutGridIcon },
  { id: "list", title: "List", description: "One card per row.", icon: ListIcon },
];

const orderOptions: ChoiceOption[] = [
  { id: "newest", title: "Newest first", description: "Fresh quotes on top.", icon: ArrowUpIcon },
  {
    id: "oldest",
    title: "Oldest first",
    description: "In the order they came.",
    icon: ArrowDownIcon,
  },
];

const themeOptions: ChoiceOption[] = [
  { id: "light", title: "Light", description: "For light pages.", icon: SunIcon },
  { id: "dark", title: "Dark", description: "For dark pages.", icon: MoonIcon },
  {
    id: "auto",
    title: "Auto",
    description: "Follows the visitor's light or dark setting.",
    icon: SunMoonIcon,
  },
];

/** Widget settings form. Every change is saved after a short pause. */
export function WidgetConfigurator({
  widgetId,
  form,
}: {
  widgetId: Id<"widgets">;
  form: UseFormReturn<WidgetSettings>;
}) {
  const updateSettings = useMutation(api.widgets.updateSettings);

  const save = useDebouncedCallback(async (settings: WidgetSettings) => {
    try {
      await updateSettings({ widgetId, settings });
    } catch {
      toast.error("Couldn't save the widget settings");
    }
  }, 500);

  useEffect(
    () =>
      form.subscribe({
        formState: { values: true },
        callback: ({ values }) => {
          void save(values);
        },
      }),
    [form, save],
  );

  // Save a pending change instead of dropping it when the page is left.
  useEffect(
    () => () => {
      void save.flush();
    },
    [save],
  );

  const { control } = form;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="font-medium text-fg-2">Settings</h2>
        <p className="text-sm text-muted-foreground">Changes save automatically.</p>
      </div>
      <form id="form-widget-configurator">
        <FieldGroup>
          <ChoiceField control={control} name="layout" legend="Layout" options={layoutOptions} />
          <FieldSeparator />
          <ChoiceField control={control} name="theme" legend="Theme" options={themeOptions} />
          <FieldSeparator />
          <ChoiceField control={control} name="order" legend="Order" options={orderOptions} />
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Show</FieldLegend>
            <FieldGroup>
              <ColorField control={control} name="accentColor" label="Accent color" />
              <SwitchField
                control={control}
                name="showRating"
                label="Star rating"
                description="When the customer gave one."
              />
              <SwitchField
                control={control}
                name="showAvatar"
                label="Photo"
                description="The customer's photo or initials."
              />
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </form>
    </section>
  );
}
