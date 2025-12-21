"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";

export default function ProjectDetails() {
  const [project] = api.project.currentProject.useSuspenseQuery();

  if (!project) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>Basic information about your project.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="font-medium text-sm">Project Name</div>
          <div className="text-muted-foreground text-sm">{project.name}</div>
        </div>
        <div className="mt-4 grid gap-2">
          <div className="font-medium text-sm">Slug</div>
          <div className="text-muted-foreground text-sm">{project.slug}</div>
        </div>
      </CardContent>
    </Card>
  );
}
