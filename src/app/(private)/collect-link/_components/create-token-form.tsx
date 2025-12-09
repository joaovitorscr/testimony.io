"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createToken } from "@/server/actions/token";

const createTokenSchema = z.object({
  description: z.string().optional(),
});

type CreateTokenFormValues = z.infer<typeof createTokenSchema>;

export function CreateTokenForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<CreateTokenFormValues>({
    resolver: zodResolver(createTokenSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (values: CreateTokenFormValues) => {
    setIsSubmitting(true);
    const result = await createToken(values);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Link created successfully!");
      form.reset();
      router.refresh();
    } else {
      toast.error(result.message || "Failed to create link");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Link</CardTitle>
        <CardDescription>
          Generate a new single-use link to send to a customer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">
                    Description (Optional)
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="description"
                    placeholder="e.g. For John Doe from Acme Inc."
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field orientation="horizontal">
              <Button type="submit" disabled={isSubmitting}>
                <Plus />
                {isSubmitting ? "Creating..." : "Create Link"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
