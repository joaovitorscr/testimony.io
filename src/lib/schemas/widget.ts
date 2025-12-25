import z from "zod";

export const widgetConfigFormSchema = z.object({
  primaryColor: z.string(),
  backgroundColor: z.string(),
  textColor: z.string(),
  displayLayout: z.string(),
  displayOrder: z.string(),
  showRating: z.boolean(),
  showAvatar: z.boolean(),
  autoPlay: z.boolean(),
  speedMs: z.number().array(),
});

export type WidgetConfigFormSchema = z.infer<typeof widgetConfigFormSchema>;
