"use client";

import { Building2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { setActiveProject } from "@/server/actions/active-project";
import { createProject } from "@/server/actions/project";

export function OnboardingDialog({
  open,
  handleOpen,
}: {
  open: boolean;
  handleOpen: (open: boolean) => void;
}) {
  const [step, setStep] = useState<"choice" | "create-org" | "create-project">(
    "choice"
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateOrg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    try {
      await authClient.organization.create(
        {
          name,
          slug,
        },
        {
          onSuccess: () => {
            toast.success("Organization created successfully");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to create organization");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await createProject(formData);
      if (result.success) {
        toast.success("Project created successfully");
        router.refresh();

        handleOpen(false);
        setActiveProject(result.project?.id ?? "");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Testimony.io</DialogTitle>
          <DialogDescription>
            To get started, you need to create a workspace for your
            testimonials.
          </DialogDescription>
        </DialogHeader>

        {step === "choice" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
            <Card
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setStep("create-org")}
            >
              <CardHeader>
                <Building2 className="w-8 h-8 mb-2 text-primary" />
                <CardTitle className="text-base">Organization</CardTitle>
                <CardDescription>
                  Best for teams and companies. Collaborate with others.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setStep("create-project")}
            >
              <CardHeader>
                <User className="w-8 h-8 mb-2 text-primary" />
                <CardTitle className="text-base">Personal Project</CardTitle>
                <CardDescription>
                  Best for individuals and personal sites.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}

        {step === "create-org" && (
          <form onSubmit={handleCreateOrg} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                name="name"
                placeholder="Acme Corp"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-slug">Slug</Label>
              <Input
                id="org-slug"
                name="slug"
                placeholder="acme-corp"
                required
              />
            </div>
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep("choice")}
              >
                Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Organization"}
              </Button>
            </div>
          </form>
        )}

        {step === "create-project" && (
          <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="proj-name">Project Name</Label>
              <Input
                id="proj-name"
                name="name"
                placeholder="My Awesome Project"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proj-slug">Slug</Label>
              <Input
                id="proj-slug"
                name="slug"
                placeholder="my-project"
                required
              />
            </div>
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep("choice")}
              >
                Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
