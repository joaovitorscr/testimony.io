"use client";

import { api } from "@convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useProject } from "@/components/project-context";
import { ProjectNameFields } from "@/components/project-name-fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { type ProjectNameValues, projectNameSchema } from "@/lib/project-schema";

/** Rename the active project. Mount it only while open so it starts fresh. */
export function ProjectSettings({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const { project } = useProject();
  const renameProject = useMutation(api.projects.rename);

  const form = useForm<ProjectNameValues>({
    resolver: zodResolver(projectNameSchema),
    mode: "onChange",
    defaultValues: { name: project.name },
  });

  const onSubmit = async (values: ProjectNameValues) => {
    try {
      await renameProject({ projectId: project._id, name: values.name });
      toast.success("Project renamed");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? String(error.data) : "Couldn't rename the project",
      );
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0">
        <DialogHeader className="gap-1.5 p-6 pb-5">
          <DialogTitle className="text-[15px] font-semibold tracking-[-0.01em]">
            Project settings
          </DialogTitle>
          <DialogDescription className="text-[13px]">
            Rename your project. Its URL, and so your collection link, stays the same.
          </DialogDescription>
        </DialogHeader>
        <form
          id="update-project-form"
          onSubmit={(event) => {
            void form.handleSubmit(onSubmit)(event);
          }}
        >
          <FieldGroup className="px-6 pb-6">
            <ProjectNameFields
              control={form.control}
              idPrefix="update-project"
              slug={project.slug}
              status="idle"
            />
          </FieldGroup>
          <DialogFooter className="border-t border-border bg-muted/30 px-6 py-4">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid}>
              {form.formState.isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
