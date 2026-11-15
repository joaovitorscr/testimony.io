"use client";

import { type Control, Controller } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import type { SlugStatus } from "@/hooks/use-slug-availability";

/** Project name input plus the read-only slug derived from it. */
export function ProjectNameFields({
  control,
  idPrefix,
  slug,
  status,
}: {
  control: Control<{ name: string }>;
  idPrefix: string;
  slug: string;
  status: SlugStatus;
}) {
  return (
    <>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`${idPrefix}-name`}>Project name</FieldLabel>
            <InputGroup>
              <InputGroupInput
                {...field}
                autoComplete="off"
                id={`${idPrefix}-name`}
                placeholder="My Awesome Project"
                required
                aria-invalid={fieldState.invalid}
              />
              {status === "checking" && (
                <InputGroupAddon align="inline-end">
                  <Spinner />
                </InputGroupAddon>
              )}
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Field data-invalid={status === "taken"}>
        <FieldLabel htmlFor={`${idPrefix}-slug`}>Project URL</FieldLabel>
        <Input
          disabled
          id={`${idPrefix}-slug`}
          value={slug}
          placeholder="my-awesome-project"
          aria-invalid={status === "taken"}
        />
        {status === "taken" && <FieldError>This project URL is already taken</FieldError>}
      </Field>
    </>
  );
}
