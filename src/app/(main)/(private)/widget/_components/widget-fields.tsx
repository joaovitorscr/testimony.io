"use client";

import { Chrome } from "@uiw/react-color";
import type { LucideIcon } from "lucide-react";
import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

// Form controls for the widget configurator. Each one binds a single field of
// a react-hook-form `control` by `name`.

type FieldProps<Values extends FieldValues> = {
  control: Control<Values>;
  name: FieldPath<Values>;
};

export function ColorField<Values extends FieldValues>({
  control,
  name,
  label,
}: FieldProps<Values> & { label: string }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field>
          <FieldLabel htmlFor={`widget-${name}`}>{label}</FieldLabel>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" type="button" id={`widget-${name}`}>
                <div className="size-4 rounded-full" style={{ backgroundColor: field.value }} />
                {field.value}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Chrome
                style={{ backgroundColor: "var(--background)" }}
                color={field.value}
                onChange={(color) => {
                  field.onChange(color.hex);
                }}
              />
            </DropdownMenuContent>
          </DropdownMenu>
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

export function ChoiceField<Values extends FieldValues>({
  control,
  name,
  legend,
  description,
  icon: Icon,
  options,
}: FieldProps<Values> & {
  legend: string;
  description: string;
  icon: LucideIcon;
  options: ChoiceOption[];
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FieldSet>
          <FieldLegend className="flex flex-row gap-2">
            <Icon />
            {legend}
          </FieldLegend>
          <FieldDescription>{description}</FieldDescription>
          <RadioGroup
            name={field.name}
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
            }}
          >
            {options.map((option) => (
              <FieldLabel key={option.id} htmlFor={`widget-${name}-${option.id}`}>
                <Field orientation="horizontal">
                  <FieldContent className="flex-row items-center gap-4">
                    <option.icon />
                    <div className="flex flex-col gap-1">
                      <FieldTitle>{option.title}</FieldTitle>
                      <FieldDescription>{option.description}</FieldDescription>
                    </div>
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
  icon: Icon,
}: FieldProps<Values> & { label: string; description: string; icon: LucideIcon }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor={`widget-${name}`}>
              <Icon /> {label}
            </FieldLabel>
            <FieldDescription>{description}</FieldDescription>
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

export function SliderField<Values extends FieldValues>({
  control,
  name,
  label,
  description,
  min,
  max,
  unit,
}: FieldProps<Values> & {
  label: string;
  description: string;
  min: number;
  max: number;
  unit: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field>
          <FieldLabel htmlFor={`widget-${name}`}>{label}</FieldLabel>
          <FieldDescription>{description}</FieldDescription>
          <div className="relative pt-6">
            <Slider
              id={`widget-${name}`}
              min={min}
              max={max}
              step={1}
              value={[field.value]}
              onValueChange={([value]) => {
                field.onChange(value);
              }}
            />
            <div
              className="absolute -top-2 -translate-x-1/2 rounded bg-primary px-2 py-1 text-xs text-primary-foreground"
              style={{ left: `${((field.value - min) / (max - min)) * 100}%` }}
            >
              {field.value}
              {unit}
            </div>
          </div>
        </Field>
      )}
    />
  );
}
