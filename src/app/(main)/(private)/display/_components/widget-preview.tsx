"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MonitorIcon, SmartphoneIcon } from "lucide-react";
import { type ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import { TestimonialWidget } from "@/components/widgets/testimonial-widget";
import type { WidgetSettings, WidgetTestimonial } from "@/components/widgets/types";
import { cn } from "@/lib/utils";

const SAMPLES: WidgetTestimonial[] = [
  {
    _id: "sample-1",
    text: "We replaced a spreadsheet and three reminder emails with one link. Customers actually answer now.",
    customerName: "Sarah Chen",
    customerTitle: "Product Manager",
    customerCompany: "TechCorp",
    rating: 5,
    avatarUrl: null,
  },
  {
    _id: "sample-2",
    text: "Set up in five minutes and it looks like it was built into our site.",
    customerName: "Marcus Johnson",
    customerTitle: "Founder",
    customerCompany: "StartupXYZ",
    rating: 5,
    avatarUrl: null,
  },
  {
    _id: "sample-3",
    text: "Simple and quiet. It does one thing well.",
    customerName: "Emily Rodriguez",
    customerTitle: undefined,
    customerCompany: undefined,
    rating: 4,
    avatarUrl: null,
  },
];

type Surface = "light" | "dark";
type Width = "desktop" | "compact";

const SURFACE: Record<Surface, string> = {
  light: "bg-panel",
  dark: "bg-[#17181a]",
};

/** A small segmented control: one pressed pill button per option. */
function Segmented<Value extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: Value;
  options: { value: Value; label: string; icon?: ReactNode }[];
  onChange: (value: Value) => void;
}) {
  return (
    <fieldset className="inline-flex items-center gap-0.5 rounded-full border border-border bg-background/80 p-0.5">
      <legend className="sr-only">{label}</legend>
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant="ghost"
          size="sm"
          aria-pressed={option.value === value}
          className="h-6 rounded-full px-2.5 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground aria-pressed:bg-foreground aria-pressed:text-background"
          onClick={() => {
            onChange(option.value);
          }}
        >
          {option.icon}
          {option.label}
        </Button>
      ))}
    </fieldset>
  );
}

/**
 * The real widget renderer with the unsaved settings, floating as a Cursory
 * product window over a painted wash stage.
 */
export function WidgetPreview({
  projectId,
  settings,
}: {
  projectId: Id<"projects">;
  settings: WidgetSettings;
}) {
  const approved = useQuery(api.testimonials.listApproved, { projectId, order: settings.order });
  const isSample = approved?.length === 0;
  const [width, setWidth] = useState<Width>("desktop");
  // Follows the widget theme until the surface is picked by hand.
  const [pickedSurface, setPickedSurface] = useState<Surface | null>(null);
  const surface = pickedSurface ?? (settings.theme === "dark" ? "dark" : "light");

  return (
    <section aria-label="Widget preview" className="flex min-w-0 flex-col gap-3 xl:sticky xl:top-6">
      <div className="rounded-[var(--radius)] cursory-wash p-4 sm:p-6">
        <div className="flex flex-col overflow-hidden rounded-[10px] bg-chrome shadow-window">
          <div className="flex h-[34px] items-center justify-between gap-3 border-b border-border px-3">
            <span aria-hidden="true" className="flex items-center gap-1.5">
              <span className="size-[9px] rounded-full bg-foreground/20" />
              <span className="size-[9px] rounded-full bg-foreground/20" />
              <span className="size-[9px] rounded-full bg-foreground/20" />
            </span>
            <span className="truncate font-mono text-[11px] text-muted-foreground">
              embed.testimony.io
            </span>
            <Segmented
              label="Preview width"
              value={width}
              onChange={setWidth}
              options={[
                { value: "desktop", label: "Desktop", icon: <MonitorIcon /> },
                { value: "compact", label: "Compact", icon: <SmartphoneIcon /> },
              ]}
            />
          </div>

          <div
            className={cn(
              "max-h-[68svh] min-h-64 overflow-auto p-5 [--tm-font:var(--font-geist)]",
              SURFACE[surface],
            )}
          >
            <div className={cn("mx-auto", width === "compact" ? "max-w-[22rem]" : "w-full")}>
              {approved === undefined ? null : (
                <TestimonialWidget
                  testimonials={isSample ? SAMPLES : approved}
                  settings={settings}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-[var(--radius)] border border-border/80 bg-card px-3.5 py-2">
        <p className="min-w-0 truncate font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
          <span className="text-foreground">Widget preview</span>
          {isSample ? " · sample quotes until you approve one" : null}
        </p>
        <Segmented
          label="Host page surface"
          value={surface}
          onChange={setPickedSurface}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
        />
      </div>
    </section>
  );
}
