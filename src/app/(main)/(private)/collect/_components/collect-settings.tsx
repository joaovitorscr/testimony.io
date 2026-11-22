"use client";

import { api } from "@convex/_generated/api";
import { COLLECT_LIMITS, DEFAULT_PROMPT } from "@convex/lib/collect";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { CollectionLink } from "@/components/collection-link";
import { useProject } from "@/components/project-context";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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
    <FieldGroup className="max-w-xl">
      <Field>
        <FieldLabel htmlFor="collection-link">Your collection link</FieldLabel>
        <CollectionLink />
        <FieldDescription>
          Anyone with the link can send a testimonial. Nothing is public until you approve it.
        </FieldDescription>
      </Field>

      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="is-collecting">Accept new testimonials</FieldLabel>
          <FieldDescription>
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

      <Field>
        <FieldLabel htmlFor="collect-prompt">Question</FieldLabel>
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
        <FieldDescription>
          The headline of your collection page. A specific question gets better answers, like
          &ldquo;What changed after you started using {project.name}?&rdquo; Saves as you type.
        </FieldDescription>
      </Field>
    </FieldGroup>
  );
}
