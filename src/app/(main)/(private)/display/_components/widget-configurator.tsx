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
import { type UseFormReturn, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import type { WidgetSettings } from "@/components/widgets/types";

import {
  type ChoiceOption,
  ChoiceField,
  ColorField,
  SettingsSection,
  SwitchField,
  type ThemePreset,
  ThemePresets,
} from "./widget-fields";

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

const themePresets: ThemePreset[] = [
  {
    name: "Paper",
    theme: "light",
    accentColor: "#f54e00",
    swatches: ["#f7f7f4", "#26251e", "#f54e00"],
  },
  {
    name: "Carbon",
    theme: "dark",
    accentColor: "#ff6a2b",
    swatches: ["#17181a", "#ecebe6", "#ff6a2b"],
  },
  {
    name: "Blueprint",
    theme: "light",
    accentColor: "#1f5fd0",
    swatches: ["#eef1f4", "#1c2833", "#1f5fd0"],
  },
  {
    name: "Sepia",
    theme: "light",
    accentColor: "#b4461a",
    swatches: ["#f3ead9", "#2b2418", "#b4461a"],
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
  const [theme, accentColor] = useWatch({ control, name: ["theme", "accentColor"] });

  return (
    <form id="form-widget-configurator" className="flex min-w-0 flex-col gap-4">
      <p className="text-[13px] text-muted-foreground">Changes save automatically.</p>

      <SettingsSection title="Layout" description="How cards are arranged and which come first.">
        <ChoiceField control={control} name="layout" legend="Arrangement" options={layoutOptions} />
        <ChoiceField control={control} name="order" legend="Order" options={orderOptions} />
      </SettingsSection>

      <SettingsSection title="Appearance" description="Match the widget to the page it sits on.">
        <ThemePresets
          presets={themePresets}
          theme={theme}
          accentColor={accentColor}
          onSelect={(preset) => {
            form.setValue("theme", preset.theme, { shouldDirty: true });
            form.setValue("accentColor", preset.accentColor, { shouldDirty: true });
          }}
        />
        <ChoiceField
          control={control}
          name="theme"
          legend="Theme"
          options={themeOptions}
          columns={3}
        />
        <ColorField
          control={control}
          name="accentColor"
          label="Accent color"
          description="Used for stars and photo initials."
        />
      </SettingsSection>

      <SettingsSection title="Visibility" description="Choose what each card shows.">
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
      </SettingsSection>
    </form>
  );
}
