"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Quote } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { setActiveProject } from "@/server/actions/active-project";
import { checkSlugAvailability } from "@/server/actions/check-slug";
import { createProject } from "@/server/actions/project";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";

const createProjectPayloadSchema = z.object({
  name: z
    .string({
      error: "Project Name is required",
    })
    .min(2, {
      error: "Project Name needs at least 2 characters",
    }),
  slug: z.string(),
});

type CreateProjectPayload = z.infer<typeof createProjectPayloadSchema>;

export function OnboardingDialog({
  open,
  handleOpen,
}: {
  open: boolean;
  handleOpen?: (open: boolean) => void;
}) {
  const [step, setStep] = useState<"choice" | "create-org" | "create-project">(
    "choice"
  );

  const router = useRouter();

  const form = useForm<CreateProjectPayload>({
    resolver: zodResolver(createProjectPayloadSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const projectName = form.watch("name");
  const [debouncedProjectName] = useDebounce(projectName, 500);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  useEffect(() => {
    async function generateAndCheckSlug() {
      if (!debouncedProjectName) {
        form.setValue("slug", "");
        return;
      }

      setIsCheckingSlug(true);
      const generatedSlug = debouncedProjectName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      form.setValue("slug", generatedSlug);

      try {
        const result = await checkSlugAvailability(generatedSlug);
        if (result.success && !result.available) {
          form.setError("slug", {
            type: "manual",
            message: "This project name is already taken",
          });
        } else {
          form.clearErrors("slug");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsCheckingSlug(false);
      }
    }

    generateAndCheckSlug();
  }, [debouncedProjectName, form]);

  const onSubmit = async (values: CreateProjectPayload) => {
    try {
      const result = await createProject(values);

      if (result.success) {
        toast.success("Project created successfully");
        router.refresh();

        if (handleOpen) {
          handleOpen(false);
        }

        setActiveProject(result.project?.id ?? "");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="overflow-hidden border-0 p-0 sm:max-w-5xl">
        <div className="grid h-[600px] w-full grid-cols-[1fr_1.2fr]">
          <OnboardingCover />

          <div className="relative flex flex-col justify-center p-12">
            <AnimatePresence mode="wait" initial={false}>
              {step === "choice" && (
                <motion.div
                  key="choice"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <DialogTitle className="font-bold text-3xl tracking-tight">
                      Welcome to Testimony.io
                    </DialogTitle>
                    <DialogDescription className="text-base text-zinc-500 leading-relaxed">
                      To get started, you need to create a workspace for your
                      testimonials. In our platform we organize in projects, you
                      will start creating your one and also will be able to
                      already invite people to work in the same project as you.
                    </DialogDescription>
                  </div>

                  <Button
                    size="lg"
                    className="w-full font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => setStep("create-project")}
                  >
                    Create a Project
                  </Button>
                </motion.div>
              )}

              {step === "create-project" && (
                <motion.div
                  key="create-project"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <DialogTitle className="font-bold text-2xl tracking-tight">
                      Create your Project
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      Give your project a name and a slug.
                    </DialogDescription>
                  </div>

                  <form
                    id="create-project-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FieldGroup>
                      <Controller
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="project-name">
                              Project Name
                            </FieldLabel>
                            <InputGroup className="h-11">
                              <InputGroupInput
                                {...field}
                                autoComplete="off"
                                id="project-name"
                                name="project-name"
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
                            <FieldLabel htmlFor="project-slug">Slug</FieldLabel>
                            <Input
                              disabled
                              className="h-11"
                              {...field}
                              autoComplete="off"
                              id="project-slug"
                              name="project-slug"
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
                          type="button"
                          variant="ghost"
                          size="lg"
                          className="flex-1"
                          onClick={() => setStep("choice")}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={
                            form.formState.isSubmitting ||
                            !form.formState.isValid ||
                            isCheckingSlug
                          }
                          size="lg"
                          className="flex-1"
                        >
                          {form.formState.isSubmitting
                            ? "Creating..."
                            : "Create Project"}
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

export function OnboardingCover() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-l-lg bg-zinc-900">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="-left-10 -top-10 absolute h-64 w-64 rounded-full bg-indigo-500/30 blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 4,
        }}
        className="-bottom-10 -right-10 absolute h-64 w-64 rounded-full bg-purple-500/30 blur-[100px]"
      />

      <div className="relative z-10 flex flex-col items-center justify-center gap-6 text-white/80">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
          className="flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-br from-white/10 to-white/5 shadow-2xl ring-1 ring-white/20 backdrop-blur-md"
        >
          <Quote className="h-10 w-10 fill-white/20 text-white" />
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-2 text-center"
        >
          <h3 className="font-bold text-white text-xl tracking-tight">
            Testimony.io
          </h3>
          <p className="font-medium text-sm text-zinc-400">
            Collect feedback effortlessly
          </p>
        </motion.div>
      </div>

      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
