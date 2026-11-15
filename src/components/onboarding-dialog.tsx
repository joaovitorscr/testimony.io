"use client";

import { api } from "@convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { OnboardingCover } from "@/components/onboarding-cover";
import { ProjectNameFields } from "@/components/project-name-fields";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { useSlugAvailability } from "@/hooks/use-slug-availability";
import { type ProjectNameValues, projectNameSchema } from "@/lib/project-schema";

/**
 * Creates a project. Opened on its own for first-time users, and from the
 * project switcher with `onOpenChange` to add another project.
 */
export function OnboardingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [step, setStep] = useState<"welcome" | "create-project">("welcome");
  const createProject = useMutation(api.projects.create);

  const form = useForm<ProjectNameValues>({
    resolver: zodResolver(projectNameSchema),
    mode: "onChange",
    defaultValues: { name: "" },
  });
  const name = useWatch({ control: form.control, name: "name" });
  const { slug, status } = useSlugAvailability(name);

  const reset = () => {
    form.reset();
    setStep("welcome");
  };

  const onSubmit = async (values: ProjectNameValues) => {
    try {
      // The new project becomes the active one; the dashboard re-renders live.
      await createProject({ name: values.name, slug });
      toast.success("Project created");
      reset();
      onOpenChange?.(false);
    } catch (error) {
      toast.error(error instanceof ConvexError ? String(error.data) : "Failed to create project");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        reset();
        onOpenChange?.(next);
      }}
    >
      <DialogContent className="rounded-xl p-2 sm:max-w-2xl lg:max-w-5xl">
        <div className="grid w-full grid-cols-1 md:grid-cols-[1fr_1.2fr] lg:h-[600px]">
          <OnboardingCover />

          <div className="flex flex-col justify-center p-8 md:p-12">
            {step === "welcome" ? (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                  <DialogTitle className="type-hero">Welcome to Testimony.io</DialogTitle>
                  <DialogDescription className="text-base text-fg-2">
                    Testimonials live in projects, one per product or website. Create your first
                    project to get a collection link and an embeddable widget.
                  </DialogDescription>
                </div>
                <Button
                  size="sm"
                  className="self-start"
                  onClick={() => {
                    setStep("create-project");
                  }}
                >
                  Create a project
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                  <DialogTitle className="type-hero">Create your project</DialogTitle>
                  <DialogDescription className="text-base text-fg-2">
                    The name becomes part of your collection link.
                  </DialogDescription>
                </div>
                <form
                  id="create-project-form"
                  onSubmit={(event) => {
                    void form.handleSubmit(onSubmit)(event);
                  }}
                >
                  <FieldGroup>
                    <ProjectNameFields
                      control={form.control}
                      idPrefix="create-project"
                      slug={slug}
                      status={status}
                    />
                    <Field orientation="horizontal" className="justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setStep("welcome");
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={
                          form.formState.isSubmitting ||
                          !form.formState.isValid ||
                          status !== "available"
                        }
                      >
                        {form.formState.isSubmitting ? "Creating..." : "Create project"}
                      </Button>
                    </Field>
                  </FieldGroup>
                </form>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
