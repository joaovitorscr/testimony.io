"use client";

import { api } from "@convex/_generated/api";
import { COLLECT_LIMITS, DEFAULT_PROMPT } from "@convex/lib/collect";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { CollectionLink } from "@/components/collection-link";
import { useProject } from "@/components/project-context";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

/** The collection link, whether it accepts testimonials, and the question it asks. */
export function CollectSettings() {
  const { project } = useProject();
  // Keyed so switching projects starts from that project's saved question.
  return <CollectForm key={project._id} />;
}

function CollectForm() {
  const { project } = useProject();
  const updateCollection = useMutation(api.projects.updateCollection);
  const [prompt, setPrompt] = useState(project.prompt ?? "");

  const save = async (change: { isCollecting: boolean } | { prompt: string }) => {
    try {
      await updateCollection({ projectId: project._id, ...change });
    } catch {
      toast.error("Couldn't save your collection settings");
    }
  };
  const savePrompt = useDebouncedCallback((value: string) => {
    void save({ prompt: value });
  }, 600);

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-[17px] font-normal tracking-[-0.01em]">
            Collection link
          </CardTitle>
          <CardDescription className="text-[13px]">
            Anyone with the link can send a testimonial. Nothing is public until you approve it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CollectionLink />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Field orientation="horizontal" className="items-center gap-6">
            <FieldContent>
              <div className="flex items-center gap-2">
                <FieldLabel htmlFor="is-collecting" className="text-[15px] font-medium">
                  Accept new testimonials
                </FieldLabel>
                {project.isCollecting ? (
                  <Badge variant="mint">Active</Badge>
                ) : (
                  <Badge variant="secondary">Paused</Badge>
                )}
              </div>
              <FieldDescription className="text-[13px]">
                Turn this off to pause the form. Your widget keeps showing approved testimonials.
              </FieldDescription>
            </FieldContent>
            <Switch
              id="is-collecting"
              checked={project.isCollecting}
              onCheckedChange={(isCollecting) => {
                void save({ isCollecting });
              }}
            />
          </Field>
        </CardContent>
      </Card>

      <Card className="gap-0 overflow-hidden pb-0">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-[17px] font-normal tracking-[-0.01em]">
            <label htmlFor="collect-prompt">Question</label>
          </CardTitle>
          <CardDescription className="text-[13px]">
            The headline of your collection page. A specific question gets better answers, like
            &ldquo;What changed after you started using {project.name}?&rdquo;
          </CardDescription>
          <CardAction>
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {prompt.length}/{COLLECT_LIMITS.prompt.max}
            </span>
          </CardAction>
        </CardHeader>
        <CardContent className="pb-5">
          <Textarea
            id="collect-prompt"
            rows={2}
            value={prompt}
            maxLength={COLLECT_LIMITS.prompt.max}
            placeholder={DEFAULT_PROMPT}
            onChange={(event) => {
              setPrompt(event.target.value);
              savePrompt(event.target.value);
            }}
            onBlur={() => {
              savePrompt.flush();
            }}
          />
        </CardContent>
        <CardFooter className="border-t border-border bg-muted/30 py-3 text-[13px] text-muted-foreground [.border-t]:pt-3">
          Saves as you type. Leave it empty to ask the default question.
        </CardFooter>
      </Card>
    </div>
  );
}
