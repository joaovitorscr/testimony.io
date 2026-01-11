"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import z from "zod";
import { checkSlugAvailability } from "@/server/actions/check-slug";
import { api } from "@/trpc/react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Spinner } from "./ui/spinner";

interface ProjectSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const updateProjectPayloadSchema = z.object({
  name: z.string().min(3).max(50),
  slug: z.string().min(3).max(50),
});

type UpdateProjectPayload = z.infer<typeof updateProjectPayloadSchema>;

export function ProjectSettings({ open, onOpenChange }: ProjectSettingsProps) {
  const [project] = api.project.currentProject.useSuspenseQuery();
  const utils = api.useUtils();
  const updateProjectMutation = api.project.update.useMutation();
  const router = useRouter();

  const originalSlug = React.useRef(project.slug);

  React.useEffect(() => {
    originalSlug.current = project.slug;
  }, [project.slug]);

  const form = useForm<UpdateProjectPayload>({
    resolver: zodResolver(updateProjectPayloadSchema),
    mode: "onChange",
    defaultValues: {
      name: project.name,
      slug: project.slug,
    },
  });

  const projectName = form.watch("name");
  const [debouncedProjectName] = useDebounce(projectName, 500);
  const [isCheckingSlug, setIsCheckingSlug] = React.useState(false);
  const [slugValidated, setSlugValidated] = React.useState(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we don't need form as a dependency
  React.useEffect(() => {
    async function generateAndCheckSlug() {
      if (!debouncedProjectName) {
        form.setValue("slug", "");
        setSlugValidated(false);
        return;
      }

      setIsCheckingSlug(true);

      const generatedSlug = debouncedProjectName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      form.setValue("slug", generatedSlug);

      // If the slug hasn't changed from the original, no need to validate
      if (generatedSlug === originalSlug.current) {
        setSlugValidated(true);
        form.clearErrors("slug");
        setIsCheckingSlug(false);
        return;
      }

      // Only validate if the slug has changed
      setSlugValidated(false);

      try {
        const result = await checkSlugAvailability(generatedSlug);

        if (result.success && !result.available) {
          form.setError("slug", {
            type: "manual",
            message: "This project name is already taken",
          });
          setSlugValidated(false);
        } else {
          setSlugValidated(true);
          form.clearErrors("slug");
        }
      } catch (error) {
        console.error(error);
        setSlugValidated(false);
      } finally {
        setIsCheckingSlug(false);
      }
    }

    generateAndCheckSlug();
  }, [debouncedProjectName]);

  const onSubmit = async (values: UpdateProjectPayload) => {
    toast.promise(updateProjectMutation.mutateAsync(values), {
      loading: "Updating project...",
      success: () => {
        onOpenChange(false);
        utils.project.currentProject.invalidate();
        form.reset();
        router.refresh();

        return "Project updated successfully";
      },
      error: "Failed to update project",
    });
  };

  const handleCloseDialog = (open: boolean) => {
    if (open) {
      originalSlug.current = project.slug;
      form.reset({
        name: project.name,
        slug: project.slug,
      });
      setSlugValidated(true);
    } else {
      form.reset();
      setSlugValidated(false);
    }
    setIsCheckingSlug(false);
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
          <DialogDescription>
            Update the name and slug of your project.
          </DialogDescription>
        </DialogHeader>
        <form id="update-project-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-project-form-project-name">
                    Project Name
                  </FieldLabel>
                  <InputGroup className="h-11">
                    <InputGroupInput
                      {...field}
                      autoComplete="off"
                      id="update-project-form-project-name"
                      name="update-project-form-project-name"
                      placeholder="My Awesome Project"
                      required
                      aria-invalid={fieldState.invalid}
                      min={2}
                    />
                    {isCheckingSlug && (
                      <InputGroupAddon align="inline-end">
                        <Spinner />
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="slug"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-project-form-project-slug">
                    Slug
                  </FieldLabel>
                  <Input
                    disabled
                    className="h-11"
                    {...field}
                    autoComplete="off"
                    id="update-project-form-project-slug"
                    name="update-project-form-project-slug"
                    placeholder="my-awesome-project"
                    required
                    aria-invalid={fieldState.invalid}
                    min={2}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field orientation="horizontal">
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  !form.formState.isValid ||
                  isCheckingSlug ||
                  !slugValidated
                }
                size="lg"
                className="flex-1"
              >
                {form.formState.isSubmitting ? "Updating..." : "Update Project"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
