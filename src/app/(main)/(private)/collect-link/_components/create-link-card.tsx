"use client";

import { api } from "@convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { PlusIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useProject } from "@/components/project-context";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const createLinkSchema = z.object({
  description: z.string().optional(),
});

type CreateLinkFormValues = z.infer<typeof createLinkSchema>;

export function CreateLinkCard() {
  const { project } = useProject();
  const createRequest = useMutation(api.requests.create);

  const form = useForm<CreateLinkFormValues>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (values: CreateLinkFormValues) => {
    try {
      const { token } = await createRequest({
        projectId: project._id,
        description: values.description,
      });
      form.reset();
      const url = `${globalThis.location.origin}/c/${project.slug}?token=${token}`;
      await navigator.clipboard.writeText(url);
      toast.success("Collection link created and copied to clipboard");
    } catch {
      toast.error("Failed to create link");
    }
  };

  return (
    <section className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="type-title text-fg-2">New link</h2>
        <p className="text-sm text-muted-foreground">
          Generate a unique link to send to your customer. It is copied to your clipboard.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          void form.handleSubmit(onSubmit)(event);
        }}
      >
        <FieldGroup className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex-1">
                <FieldLabel htmlFor="description">
                  Description
                  <span className="text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="description"
                  placeholder="e.g. Feedback request for John from Acme Inc."
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting} className="shrink-0">
            {form.formState.isSubmitting ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <PlusIcon data-icon="inline-start" />
            )}
            Create link
          </Button>
        </FieldGroup>
      </form>
    </section>
  );
}
