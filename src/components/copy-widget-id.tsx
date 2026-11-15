"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { useProject } from "@/components/project-provider";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { Label } from "./ui/label";

export function CopyWidgetId() {
  const { project } = useProject();
  const widgetConfig = useQuery(api.widgets.get, { projectId: project._id });

  const copyToClipboard = () => {
    if (!widgetConfig?._id) return;

    navigator.clipboard.writeText(widgetConfig._id);
    toast.success("Widget ID copied to clipboard");
  };

  if (!widgetConfig) return null;

  return (
    <div className="flex flex-col items-start gap-2">
      <Label>Widget ID</Label>
      <InputGroup className="w-64">
        <InputGroupInput value={widgetConfig._id} disabled />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={copyToClipboard}>
            <CopyIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
