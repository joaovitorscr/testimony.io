"use client";

import { api } from "@convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { useProject } from "@/components/project-context";
import { ProjectNameFields } from "@/components/project-name-fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { useSlugAvailability } from "@/hooks/use-slug-availability";
import { type ProjectNameValues, projectNameSchema } from "@/lib/project-schema";

/** Rename the active project. Mount it only while open so it starts fresh. */
export function ProjectSettings({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const { project } = useProject();
  const updateProject = useMutation(api.projects.update);

  const form = useForm<ProjectNameValues>({
    resolver: zodResolver(projectNameSchema),
    mode: "onChange",
    defaultValues: { name: project.name },
  });
  const name = useWatch({ control: form.control, name: "name" });
  const { slug, status } = useSlugAvailability(name, project._id);

  const onSubmit = async (values: ProjectNameValues) => {
    try {
      await updateProject({ projectId: project._id, name: values.name, slug });
      toast.success("Project updated");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof ConvexError ? String(error.data) : "Failed to update project");
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
          <DialogDescription>
            Rename your project. Collection links keep working after a rename.
          </DialogDescription>
        </DialogHeader>
        <form
          id="update-project-form"
          onSubmit={(event) => {
            void form.handleSubmit(onSubmit)(event);
          }}
        >
          <FieldGroup>
            <ProjectNameFields
              control={form.control}
              idPrefix="update-project"
              slug={slug}
              status={status}
            />
            <Button
              type="submit"
              disabled={
                form.formState.isSubmitting || !form.formState.isValid || status !== "available"
              }
            >
              {form.formState.isSubmitting ? "Saving..." : "Save"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
