"use client";

import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ArrowDownIcon, ArrowUpIcon, LayoutGridIcon, ListIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { WidgetSettings } from "@/components/widgets/types";

import {
  type ChoiceOption,
  ChoiceField,
  ColorField,
  SliderField,
  SwitchField,
} from "./widget-fields";

const layoutOptions: ChoiceOption[] = [
  { id: "list", title: "List", description: "Show testimonials in a list.", icon: ListIcon },
  { id: "grid", title: "Grid", description: "Show testimonials in a grid.", icon: LayoutGridIcon },
];

const orderOptions: ChoiceOption[] = [
  { id: "newest", title: "Newest", description: "Newest testimonials first.", icon: ArrowUpIcon },
  { id: "oldest", title: "Oldest", description: "Oldest testimonials first.", icon: ArrowDownIcon },
];

/** Widget settings form. Every change is saved after a short pause. */
export function WidgetConfigurator({ widget }: { widget: Doc<"widgets"> }) {
  const form = useForm<WidgetSettings>({
    defaultValues: {
      primaryColor: widget.primaryColor,
      backgroundColor: widget.backgroundColor,
      textColor: widget.textColor,
      displayLayout: widget.displayLayout,
      displayOrder: widget.displayOrder,
      showRating: widget.showRating,
      showAvatar: widget.showAvatar,
      gridColumns: widget.gridColumns,
      gridGap: widget.gridGap,
    },
  });
  const updateSettings = useMutation(api.widgets.updateSettings);

  const save = useDebouncedCallback(async (settings: WidgetSettings) => {
    try {
      await updateSettings({ widgetId: widget._id, settings });
    } catch {
      toast.error("Failed to save widget settings");
    }
  }, 600);

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

  const { control } = form;

  return (
    <section className="flex h-[calc(100svh-20rem)] min-h-96 flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="font-medium text-fg-2">Settings</h2>
        <p className="text-sm text-muted-foreground">Changes save automatically.</p>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <form id="form-widget-configurator" className="pr-4">
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Colors</FieldLegend>
              <FieldDescription>Choose the colors of your widget.</FieldDescription>
              <FieldGroup>
                <ColorField control={control} name="primaryColor" label="Primary color" />
                <ColorField control={control} name="backgroundColor" label="Background color" />
                <ColorField control={control} name="textColor" label="Text color" />
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <ChoiceField
              control={control}
              name="displayOrder"
              legend="Display order"
              description="Choose the order in which your testimonials are displayed."
              options={orderOptions}
            />
            <FieldSeparator />
            <ChoiceField
              control={control}
              name="displayLayout"
              legend="Display layout"
              description="Choose how you want to display your testimonials."
              options={layoutOptions}
            />
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Visibility</FieldLegend>
              <FieldDescription>Choose which elements your widget shows.</FieldDescription>
              <FieldGroup>
                <SwitchField
                  control={control}
                  name="showRating"
                  label="Show rating"
                  description="Show the star rating of each testimonial."
                />
                <SwitchField
                  control={control}
                  name="showAvatar"
                  label="Show avatar"
                  description="Show the customer's photo or initials."
                />
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Grid</FieldLegend>
              <FieldDescription>Configure the grid layout for your testimonials.</FieldDescription>
              <FieldGroup>
                <SliderField
                  control={control}
                  name="gridColumns"
                  label="Columns"
                  description="Number of columns to display (1-6)."
                  min={1}
                  max={6}
                  unit=" columns"
                />
                <SliderField
                  control={control}
                  name="gridGap"
                  label="Gap"
                  description="Space between testimonial cards (0-48px)."
                  min={0}
                  max={48}
                  unit="px"
                />
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
      </ScrollArea>
    </section>
  );
}
