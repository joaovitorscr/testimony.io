"use client";

import { Chrome } from "@uiw/react-color";
import type { LucideIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import type { WidgetSettings } from "@/components/widgets/types";
import { cn } from "@/lib/utils";

// Form controls for the widget configurator. Each one binds a single field of
// a react-hook-form `control` by `name`.

type FieldProps<Values extends FieldValues> = {
  control: Control<Values>;
  name: FieldPath<Values>;
};

const HEX = /^#[\da-f]{6}$/iu;

/** A hairline card grouping related settings under a title and one-line description. */
export function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius)] border border-border/80 bg-card">
      <div className="flex flex-col gap-1 border-b border-border px-5 py-4">
        <h2 className="text-[17px] font-normal tracking-[-0.01em] text-foreground">{title}</h2>
        <p className="text-[13px] text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-6 p-5">{children}</div>
    </section>
  );
}

export type ThemePreset = {
  name: string;
  theme: WidgetSettings["theme"];
  accentColor: string;
  /** Background, text and accent, as shown in the swatch strip. */
  swatches: string[];
};

/**
 * One-click theme and accent pairs. Picking one sets both fields; the row whose
 * pair matches the current values shows as active.
 */
export function ThemePresets({
  presets,
  theme,
  accentColor,
  onSelect,
}: {
  presets: ThemePreset[];
  theme: WidgetSettings["theme"];
  accentColor: string;
  onSelect: (preset: ThemePreset) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">Presets</p>
        <p className="text-[13px] text-muted-foreground">
          Set the theme and accent together, then fine-tune below.
        </p>
      </div>
      <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-panel">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_4.5rem] items-center gap-4 border-b border-border bg-card/70 px-3 py-2 font-mono text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
          <span>Name</span>
          <span>Colors</span>
          <span className="sr-only">Status</span>
        </div>
        <ul>
          {presets.map((preset) => {
            const active =
              preset.theme === theme &&
              preset.accentColor.toLowerCase() === accentColor.toLowerCase();
            return (
              <li key={preset.name} className="border-b border-border last:border-b-0">
                <button
                  type="button"
                  aria-pressed={active}
                  className={cn(
                    "grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto_4.5rem] items-center gap-4 px-3 py-2.5 text-left text-[13px] transition-colors outline-none hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset",
                    active && "bg-muted/30",
                  )}
                  onClick={() => {
                    onSelect(preset);
                  }}
                >
                  <span className="truncate font-medium text-foreground">{preset.name}</span>
                  <span className="flex items-center gap-1" aria-hidden="true">
                    {preset.swatches.map((color) => (
                      <span
                        key={color}
                        className="size-4 rounded ring-1 ring-border ring-inset"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </span>
                  <span className="flex justify-end">
                    {active && <Badge variant="mint">Active</Badge>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Hex text input that only commits complete `#rrggbb` values. */
function HexInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? value;
  const invalid = draft !== null && !HEX.test(draft);

  return (
    <InputGroupInput
      id={id}
      value={shown}
      spellCheck={false}
      autoComplete="off"
      aria-invalid={invalid}
      className="font-mono text-[13px] uppercase"
      onChange={(event) => {
        const raw = event.target.value.trim();
        const next = raw.startsWith("#") ? raw : `#${raw}`;
        setDraft(next);
        if (HEX.test(next)) {
          onChange(next.toLowerCase());
        }
      }}
      onBlur={() => {
        setDraft(null);
      }}
    />
  );
}

export function ColorField<Values extends FieldValues>({
  control,
  name,
  label,
  description,
}: FieldProps<Values> & { label: string; description: string }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field>
          <FieldContent>
            <FieldLabel htmlFor={`widget-${name}`}>{label}</FieldLabel>
            <FieldDescription className="text-[13px]">{description}</FieldDescription>
          </FieldContent>
          <InputGroup className="max-w-56">
            <InputGroupAddon>
              <DropdownMenu>
                <DropdownMenuTrigger
                  type="button"
                  aria-label={`Pick ${label.toLowerCase()}`}
                  className="size-5 cursor-pointer rounded ring-1 ring-border outline-none ring-inset focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  style={{ backgroundColor: field.value }}
                />
                <DropdownMenuContent align="start" className="p-0">
                  <Chrome
                    style={{ backgroundColor: "var(--background)" }}
                    color={field.value}
                    onChange={(color) => {
                      field.onChange(color.hex);
                    }}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </InputGroupAddon>
            <HexInput
              id={`widget-${name}`}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
              }}
            />
          </InputGroup>
        </Field>
      )}
    />
  );
}

export type ChoiceOption = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

/** Radio choices rendered as selectable cards, `columns` wide on roomy screens. */
export function ChoiceField<Values extends FieldValues>({
  control,
  name,
  legend,
  options,
  columns = 2,
}: FieldProps<Values> & {
  legend: string;
  options: ChoiceOption[];
  columns?: 2 | 3;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FieldSet>
          <FieldLegend variant="label" className="mb-2">
            {legend}
          </FieldLegend>
          <RadioGroup
            name={field.name}
            value={field.value}
            className={cn("grid gap-2", columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}
            onValueChange={(value) => {
              field.onChange(value);
            }}
          >
            {options.map((option) => (
              <FieldLabel
                key={option.id}
                htmlFor={`widget-${name}-${option.id}`}
                className="rounded-lg"
              >
                <Field orientation="horizontal" className="p-3">
                  <FieldContent className="gap-1.5">
                    <option.icon className="size-4 text-muted-foreground" />
                    <FieldTitle className="text-[13px]">{option.title}</FieldTitle>
                    <FieldDescription className="text-xs">{option.description}</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value={option.id} id={`widget-${name}-${option.id}`} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </FieldSet>
      )}
    />
  );
}

export function SwitchField<Values extends FieldValues>({
  control,
  name,
  label,
  description,
}: FieldProps<Values> & { label: string; description: string }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field orientation="horizontal" className="items-center justify-between">
          <FieldContent>
            <FieldLabel htmlFor={`widget-${name}`}>{label}</FieldLabel>
            <FieldDescription className="text-[13px]">{description}</FieldDescription>
          </FieldContent>
          <Switch
            id={`widget-${name}`}
            name={field.name}
            checked={field.value}
            onCheckedChange={(checked) => {
              field.onChange(checked);
            }}
          />
        </Field>
      )}
    />
  );
}
