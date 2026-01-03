import z from "zod";

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

export type WidgetConfigFormSchema = z.infer<typeof widgetConfigFormSchema>;
