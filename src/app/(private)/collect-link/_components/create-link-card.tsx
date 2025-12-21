"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PlusIcon, SparklesIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";

const createLinkSchema = z.object({
  description: z.string().optional(),
});

type CreateLinkFormValues = z.infer<typeof createLinkSchema>;

export function CreateLinkCard() {
  const utils = api.useUtils();

  const form = useForm<CreateLinkFormValues>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      description: "",
    },
  });

  const createMutation = api.token.create.useMutation({
    onSuccess: () => {
      toast.success("Collection link created!");
      form.reset();
      void utils.token.getAll.invalidate();
      void utils.token.getStats.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create link");
    },
  });

  const onSubmit = (values: CreateLinkFormValues) => {
    createMutation.mutate(values);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-primary/5 via-card to-accent/5 shadow-sm">
      <div className="border-primary/10 border-b bg-primary/5 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <SparklesIcon className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Create New Link</h2>
            <p className="text-muted-foreground text-sm">
              Generate a unique link to send to your customer
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
        <FieldGroup className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex-1">
                <FieldLabel htmlFor="description" className="text-sm">
                  Description
                  <span className="ml-1 text-muted-foreground/60">
                    (optional)
                  </span>
                </FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="description"
                  placeholder="e.g. Feedback request for John from Acme Inc."
                  autoComplete="off"
                  className="bg-background/80"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            disabled={createMutation.isPending}
            size="lg"
            className="shrink-0 gap-2 px-6"
          >
            {createMutation.isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <PlusIcon className="size-4" />
            )}
            Create Link
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
