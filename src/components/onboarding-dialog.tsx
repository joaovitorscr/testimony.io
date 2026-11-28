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
import { FieldGroup } from "@/components/ui/field";
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
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl lg:max-w-4xl">
        <div className="grid w-full grid-cols-1 md:grid-cols-[1fr_1.25fr] lg:min-h-[520px]">
          <OnboardingCover />

          {step === "welcome" ? (
            <div className="flex flex-col">
              <div className="flex flex-1 flex-col justify-center gap-2 p-8 md:p-10">
                <p className="text-[11px] font-semibold tracking-[0.06em] text-muted-foreground/80 uppercase">
                  Get started
                </p>
                <DialogTitle className="text-2xl font-semibold tracking-tight">
                  Welcome to Testimony.io
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                  Create a project for your product. You get one link to collect testimonials and a
                  widget to show the ones you approve.
                </DialogDescription>
              </div>
              <div className="flex justify-end border-t border-border bg-muted/30 px-8 py-4 md:px-10">
                <Button
                  type="button"
                  onClick={() => {
                    setStep("create-project");
                  }}
                >
                  Create a project
                </Button>
              </div>
            </div>
          ) : (
            <form
              id="create-project-form"
              className="flex flex-col"
              onSubmit={(event) => {
                void form.handleSubmit(onSubmit)(event);
              }}
            >
              <div className="flex flex-1 flex-col justify-center gap-6 p-8 md:p-10">
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] font-semibold tracking-[0.06em] text-muted-foreground/80 uppercase">
                    New project
                  </p>
                  <DialogTitle className="text-2xl font-semibold tracking-tight">
                    Create your project
                  </DialogTitle>
                  <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                    The project URL becomes your collection link. You can rename the project later;
                    the link stays the same.
                  </DialogDescription>
                </div>
                <FieldGroup>
                  <ProjectNameFields
                    control={form.control}
                    idPrefix="create-project"
                    slug={slug}
                    status={status}
                  />
                </FieldGroup>
              </div>
              <div className="flex justify-end gap-2 border-t border-border bg-muted/30 px-8 py-4 md:px-10">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setStep("welcome");
                  }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={
                    form.formState.isSubmitting || !form.formState.isValid || status !== "available"
                  }
                >
                  {form.formState.isSubmitting ? "Creating..." : "Create project"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
