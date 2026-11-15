"use client";

import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";

import { useProject } from "@/components/project-context";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { env } from "@/env";
import { useCopy } from "@/hooks/use-copy";

/** The active project's public collection URL. */
function useCollectionUrl() {
  const { project } = useProject();
  return `${env.NEXT_PUBLIC_APP_URL}/c/${project.slug}`;
}

/** The project's shareable collection link, with copy and open buttons. */
export function CollectionLink({ id = "collection-link" }: { id?: string }) {
  const url = useCollectionUrl();
  const { copied, copy } = useCopy();

  return (
    <InputGroup className="max-w-xl">
      <InputGroupInput
        id={id}
        aria-label="Collection link"
        value={url}
        readOnly
        className="font-mono text-sm"
        onFocus={(event) => {
          event.target.select();
        }}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          aria-label="Copy collection link"
          onClick={() => {
            void copy(url, "Collection link copied");
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </InputGroupButton>
        <InputGroupButton size="icon-xs" aria-label="Open collection page" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLinkIcon />
          </a>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
