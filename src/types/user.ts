import z from "zod";

export const CreateUserPayload = z.object({
  id: z.string(),
  image_url: z.string(),
  email_address: z.string(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
});

export type CreateUserPayload = z.infer<typeof CreateUserPayload>;
