"use client";

import { api } from "@convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { AnimatePresence, motion } from "motion/react";
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

const stepMotion = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 },
};

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
      <DialogContent className="overflow-hidden border-0 p-0 sm:max-w-2xl lg:max-w-5xl">
        <div className="grid w-full grid-cols-1 md:grid-cols-[1fr_1.2fr] lg:h-[600px]">
          <OnboardingCover />

          <div className="relative flex flex-col justify-center p-12">
            <AnimatePresence mode="wait" initial={false}>
              {step === "welcome" ? (
                <motion.div key="welcome" {...stepMotion} className="space-y-8">
                  <div className="space-y-4">
                    <DialogTitle className="text-3xl font-bold tracking-tight">
                      Welcome to Testimony.io
                    </DialogTitle>
                    <DialogDescription className="text-base leading-relaxed text-zinc-500">
                      Testimonials live in projects, one per product or website. Create your first
                      project to get a collection link and an embeddable widget.
                    </DialogDescription>
                  </div>
                  <Button
                    size="lg"
                    className="w-full text-base font-semibold"
                    onClick={() => {
                      setStep("create-project");
                    }}
                  >
                    Create a Project
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="create-project" {...stepMotion} className="space-y-8">
                  <div className="space-y-2">
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                      Create your Project
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      The name becomes part of your collection link.
                    </DialogDescription>
                  </div>
                  <form
                    id="create-project-form"
                    className="space-y-6"
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
                      <Field orientation="horizontal">
                        <Button
                          type="button"
                          variant="ghost"
                          size="lg"
                          className="flex-1"
                          onClick={() => {
                            setStep("welcome");
                          }}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          size="lg"
                          className="flex-1"
                          disabled={
                            form.formState.isSubmitting ||
                            !form.formState.isValid ||
                            status !== "available"
                          }
                        >
                          {form.formState.isSubmitting ? "Creating..." : "Create Project"}
                        </Button>
                      </Field>
                    </FieldGroup>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
