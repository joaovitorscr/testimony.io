"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Chrome } from "@uiw/react-color";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  Columns3Icon,
  EyeIcon,
  LayoutGridIcon,
  ListIcon,
  PaletteIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

export const widgetConfigFormSchema = z.object({
  primaryColor: z.string(),
  backgroundColor: z.string(),
  textColor: z.string(),
  displayLayout: z.string(),
  displayOrder: z.string(),
  showRating: z.boolean(),
  showAvatar: z.boolean(),
  gridColumns: z.number().min(1).max(6),
  gridGap: z.number().min(0).max(48),
});

export type WidgetConfigForm = z.infer<typeof widgetConfigFormSchema>;

const displayLayoutOptions = [
  {
    id: "list",
    title: "List",
    description: "Show testimonials in a list.",
    icon: ListIcon,
  },
  {
    id: "grid",
    title: "Grid",
    description: "Show testimonials in a grid.",
    icon: LayoutGridIcon,
  },
];

const displayOrderOptions = [
  {
    id: "newest",
    title: "Newest",
    description: "Display testimonials from newest to oldest.",
    icon: ArrowUpIcon,
  },
  {
    id: "oldest",
    title: "Oldest",
    description: "Display testimonials from oldest to newest.",
    icon: ArrowDownIcon,
  },
];

export default function WidgetConfigurator() {
  const [widgetConfig] = api.widget.getWidgetConfig.useSuspenseQuery();

  const form = useForm<WidgetConfigForm>({
    resolver: zodResolver(widgetConfigFormSchema),
    defaultValues: {
      primaryColor: widgetConfig?.primaryColor ?? "#3B82F6",
      backgroundColor: widgetConfig?.backgroundColor ?? "#FFFFFF",
      textColor: widgetConfig?.textColor ?? "#000000",
      displayLayout: widgetConfig?.displayLayout ?? "list",
      displayOrder: widgetConfig?.displayOrder ?? "newest",
      showRating: widgetConfig?.showRating ?? true,
      showAvatar: widgetConfig?.showAvatar ?? true,
      gridColumns: widgetConfig?.gridColumns ?? 3,
      gridGap: widgetConfig?.gridGap ?? 16,
    },
  });

  const utils = api.useUtils();

  const updateWidgetConfigMutation = api.widget.updateWidgetConfig.useMutation({
    onSuccess: () => {
      void utils.widget.getWidgetConfig.invalidate();
    },
  });

  const onSubmit = () => {
    toast.promise(
      updateWidgetConfigMutation.mutateAsync({ config: form.getValues() }),
      {
        loading: "Updating widget config...",
        success: "Widget config updated successfully",
        error: "Failed to update widget config",
      }
    );
  };

  const triggerDebouncedUpdateWidgetConfig = useDebouncedCallback(
    onSubmit,
    600
  );

  // Watch all form values and trigger debounced update on change
  useEffect(() => {
    const subscription = form.watch(() => {
      triggerDebouncedUpdateWidgetConfig();
    });
    return () => subscription.unsubscribe();
  }, [form, triggerDebouncedUpdateWidgetConfig]);

  return (
    <section className="flex h-[calc(100vh-5rem)] flex-col">
      <Card className="flex h-full flex-col overflow-hidden">
        <CardHeader className="shrink-0">
          <CardTitle>Widget Configuration</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <form id="form-widget-configurator" className="pr-4">
              <FieldGroup>
                <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
                  <FieldSet>
                    <FieldLegend className="flex flex-row gap-2">
                      <PaletteIcon />
                      Widget Colors
                    </FieldLegend>
                    <FieldDescription>
                      Choose the colors of your widget.
                    </FieldDescription>
                    <FieldGroup>
                      <Controller
                        control={form.control}
                        name="primaryColor"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="themeColor">
                              Primary Color
                            </FieldLabel>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  type="button"
                                  id="themeColor"
                                >
                                  <div
                                    className={cn("size-4 rounded-full")}
                                    style={{
                                      backgroundColor: field.value,
                                    }}
                                  />
                                  {field.value}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <Chrome
                                  style={{
                                    backgroundColor: "var(--background)",
                                  }}
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
                      <Controller
                        control={form.control}
                        name="backgroundColor"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="themeColor">
                              Background Color
                            </FieldLabel>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  type="button"
                                  id="themeColor"
                                >
                                  <div
                                    className={cn("size-4 rounded-full")}
                                    style={{
                                      backgroundColor: field.value,
                                    }}
                                  />
                                  {field.value}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <Chrome
                                  style={{
                                    backgroundColor: "var(--background)",
                                  }}
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
                      <Controller
                        control={form.control}
                        name="textColor"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="themeColor">
                              Text Color
                            </FieldLabel>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  type="button"
                                  id="themeColor"
                                >
                                  <div
                                    className={cn("size-4 rounded-full")}
                                    style={{
                                      backgroundColor: field.value,
                                    }}
                                  />
                                  {field.value}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <Chrome
                                  style={{
                                    backgroundColor: "var(--background)",
                                  }}
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
                    </FieldGroup>
                  </FieldSet>

                  <Separator orientation="vertical" />

                  <Controller
                    control={form.control}
                    name="displayOrder"
                    render={({ field, fieldState }) => (
                      <FieldSet data-invalid={fieldState.invalid}>
                        <FieldLegend className="flex flex-row gap-2">
                          <ArrowUpDownIcon />
                          Display Order
                        </FieldLegend>
                        <FieldDescription>
                          Choose the order in which your testimonials are
                          displayed.
                        </FieldDescription>
                        <RadioGroup
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                          aria-invalid={fieldState.invalid}
                        >
                          {displayOrderOptions.map((option) => (
                            <FieldLabel
                              key={option.id}
                              htmlFor={`form-widget-configurator-displayOrder-${option.id}`}
                            >
                              <Field
                                orientation="horizontal"
                                data-invalid={fieldState.invalid}
                              >
                                <FieldContent className="flex-row items-center gap-4">
                                  <option.icon />
                                  <div className="flex flex-col gap-2">
                                    <FieldTitle>{option.title}</FieldTitle>
                                    <FieldDescription>
                                      {option.description}
                                    </FieldDescription>
                                  </div>
                                </FieldContent>
                                <RadioGroupItem
                                  value={option.id}
                                  id={`form-widget-configurator-displayOrder-${option.id}`}
                                  aria-invalid={fieldState.invalid}
                                />
                              </Field>
                            </FieldLabel>
                          ))}
                        </RadioGroup>
                      </FieldSet>
                    )}
                  />
                </div>
                <FieldSeparator />
                <Controller
                  control={form.control}
                  name="displayLayout"
                  render={({ field, fieldState }) => (
                    <FieldSet>
                      <FieldLegend className="flex flex-row gap-2">
                        <LayoutGridIcon />
                        Display Layout
                      </FieldLegend>
                      <FieldDescription>
                        Choose how you want to display your testimonials.
                      </FieldDescription>
                      <RadioGroup
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                      >
                        {displayLayoutOptions.map((option) => (
                          <FieldLabel
                            key={option.id}
                            htmlFor={`form-widget-configurator-displayLayout-${option.id}`}
                          >
                            <Field
                              orientation="horizontal"
                              data-invalid={fieldState.invalid}
                            >
                              <FieldContent className="flex-row items-center gap-4">
                                <option.icon />
                                <div className="flex flex-col gap-1">
                                  <FieldTitle>{option.title}</FieldTitle>
                                  <FieldDescription>
                                    {option.description}
                                  </FieldDescription>
                                </div>
                              </FieldContent>
                              <RadioGroupItem
                                value={option.id}
                                id={`form-widget-configurator-displayLayout-${option.id}`}
                                aria-invalid={fieldState.invalid}
                              />
                            </Field>
                          </FieldLabel>
                        ))}
                      </RadioGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldSet>
                  )}
                />
                <FieldSeparator />
                <FieldSet>
                  <FieldLegend className="flex flex-row gap-2">
                    <EyeIcon />
                    Visibility Options
                  </FieldLegend>
                  <FieldDescription>
                    Choose which elements you want to display in your widget.
                  </FieldDescription>
                  <FieldGroup>
                    <Controller
                      control={form.control}
                      name="showRating"
                      render={({ field, fieldState }) => (
                        <Field
                          orientation="horizontal"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldContent>
                            <FieldLabel htmlFor="form-widget-configuration-show-rating">
                              <StarIcon /> Show Rating
                            </FieldLabel>
                            <FieldDescription>
                              Show the rating the for each testimonial.
                            </FieldDescription>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </FieldContent>
                          <Switch
                            id="form-widget-configuration-show-rating"
                            name={field.name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-invalid={fieldState.invalid}
                          />
                        </Field>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name="showAvatar"
                      render={({ field, fieldState }) => (
                        <Field
                          orientation="horizontal"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldContent>
                            <FieldLabel htmlFor="form-widget-configuration-show-avatar">
                              <UserIcon /> Show Avatar
                            </FieldLabel>
                            <FieldDescription>
                              Show the avatar of the customer for each
                              testimonial.
                            </FieldDescription>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </FieldContent>
                          <Switch
                            id="form-widget-configuration-show-avatar"
                            name={field.name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-invalid={fieldState.invalid}
                          />
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </FieldSet>
                <FieldSeparator />
                <FieldSet>
                  <FieldLegend className="flex flex-row gap-2">
                    <Columns3Icon />
                    Grid Settings
                  </FieldLegend>
                  <FieldDescription>
                    Configure the grid layout for your testimonials.
                  </FieldDescription>
                  <FieldGroup>
                    <Controller
                      control={form.control}
                      name="gridColumns"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="form-widget-configuration-grid-columns">
                            Columns
                          </FieldLabel>
                          <FieldDescription>
                            Number of columns to display (1-6).
                          </FieldDescription>
                          <Slider
                            id="form-widget-configuration-grid-columns"
                            min={1}
                            max={6}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            showTooltip
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name="gridGap"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="form-widget-configuration-grid-gap">
                            Gap
                          </FieldLabel>
                          <FieldDescription>
                            Space between testimonial cards (0-48px).
                          </FieldDescription>
                          <Slider
                            id="form-widget-configuration-grid-gap"
                            min={0}
                            max={48}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            showTooltip
                            formatValue={(v) => `${v}px`}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
              <ScrollBar orientation="vertical" />
            </form>
          </ScrollArea>
        </CardContent>
      </Card>
    </section>
  );
}
