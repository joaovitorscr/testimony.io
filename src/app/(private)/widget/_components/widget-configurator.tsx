"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Chrome } from "@uiw/react-color";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ClockIcon,
  EyeIcon,
  GalleryHorizontal,
  LayoutGridIcon,
  ListIcon,
  PaletteIcon,
  PlayIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
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
import {
  type WidgetConfigFormSchema,
  widgetConfigFormSchema,
} from "@/lib/schemas/widget";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

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
  {
    id: "carousel",
    title: "Carousel",
    description: "Show testimonials in a carousel.",
    icon: GalleryHorizontal,
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

  const form = useForm<WidgetConfigFormSchema>({
    resolver: zodResolver(widgetConfigFormSchema),
    defaultValues: {
      primaryColor: widgetConfig?.primaryColor ?? "#3B82F6",
      backgroundColor: widgetConfig?.backgroundColor ?? "#FFFFFF",
      textColor: widgetConfig?.textColor ?? "#000000",
      displayLayout: widgetConfig?.displayLayout ?? "list",
      displayOrder: widgetConfig?.displayOrder ?? "newest",
      showRating: widgetConfig?.showRating ?? true,
      showAvatar: widgetConfig?.showAvatar ?? true,
      autoPlay: widgetConfig?.autoPlay ?? true,
      speedMs: widgetConfig?.speedMs ? [widgetConfig.speedMs] : [5000],
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
    <section className="flex h-[calc(100vh-8rem)] flex-col">
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
                    <Controller
                      control={form.control}
                      name="autoPlay"
                      render={({ field, fieldState }) => (
                        <Field
                          orientation="horizontal"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldContent>
                            <FieldLabel htmlFor="form-widget-configuration-auto-play">
                              <PlayIcon /> Auto Play
                            </FieldLabel>
                            <FieldDescription>
                              Automatically play the testimonials.
                            </FieldDescription>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </FieldContent>
                          <Switch
                            id="form-widget-configuration-auto-play"
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
                      name="speedMs"
                      render={({ field, fieldState }) => (
                        <Field
                          orientation="vertical"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldContent>
                            <FieldLabel htmlFor="form-widget-configuration-speed-ms">
                              <ClockIcon /> Carousel Speed (ms)
                            </FieldLabel>
                            <FieldDescription>
                              The speed of the carousel in milliseconds.
                            </FieldDescription>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </FieldContent>
                          <Slider
                            id="form-widget-configuration-speed-ms"
                            name={field.name}
                            value={field.value}
                            max={5000}
                            step={1}
                            className={cn("w-[60%]")}
                            onValueChange={field.onChange}
                            aria-invalid={fieldState.invalid}
                          />
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
