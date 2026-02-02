"use client";

import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { Label } from "./ui/label";

export function CopyWidgetId() {
  const [widgetConfig] = api.widget.getWidgetConfig.useSuspenseQuery();

  const copyToClipboard = () => {
    if (!widgetConfig?.id) return;

    navigator.clipboard.writeText(widgetConfig.id);
    toast.success("Widget ID copied to clipboard");
  };

  if (!widgetConfig) return null;

  return (
    <div className="flex flex-col items-start gap-2">
      <Label>Widget ID</Label>
      <InputGroup className="w-64">
        <InputGroupInput value={widgetConfig.id} disabled />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={copyToClipboard}>
            <CopyIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
