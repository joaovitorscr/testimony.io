import { z } from "zod";

/** Form schema for creating or renaming a project. */
export const projectNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { error: "Project name needs at least 3 characters" })
    .max(50, { error: "Project name can have at most 50 characters" }),
});

export type ProjectNameValues = z.infer<typeof projectNameSchema>;
