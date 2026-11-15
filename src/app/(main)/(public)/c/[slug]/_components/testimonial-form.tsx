"use client";

import { api } from "@convex/_generated/api";
import { COLLECT_LIMITS } from "@convex/lib/collect";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { AvatarPicker } from "./avatar-picker";
import { RatingField } from "./rating-field";
import { uploadAvatar } from "./upload-avatar";

const { name, detail, text } = COLLECT_LIMITS;

// Mirrors the checks in convex/collect.ts so errors show before submitting.
const testimonialSchema = z.object({
  text: z
    .string()
    .trim()
    .min(text.min, `A little more, please (at least ${text.min} characters)`)
    .max(text.max, `Please keep it under ${text.max} characters`),
  rating: z.number().int().min(0).max(5),
  customerName: z.string().trim().min(1, "Your name is required").max(name.max),
  customerTitle: z.string().trim().max(detail.max),
  customerCompany: z.string().trim().max(detail.max),
  honeypot: z.string(),
});

type Values = z.infer<typeof testimonialSchema>;

const optional = (value: string) => (value === "" ? undefined : value);

function ThankYou({ customerName, projectName }: { customerName: string; projectName: string }) {
  return (
    <output className="flex flex-col gap-2">
      <h2 className="type-lede">Thank you, {customerName.split(/\s+/u)[0]}.</h2>
      <p className="text-fg-2">
        {projectName} will read it before it appears anywhere. You can close this page.
      </p>
    </output>
  );
}

function TextField({ control }: { control: ReturnType<typeof useForm<Values>>["control"] }) {
  return (
    <Controller
      name="text"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="text">Your testimonial</FieldLabel>
          <Textarea
            {...field}
            id="text"
            rows={5}
            maxLength={text.max}
            aria-invalid={fieldState.invalid}
            placeholder="What did it help you do? What would you tell a friend?"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

function DetailField({
  control,
  fieldName,
  label,
  placeholder,
}: {
  control: ReturnType<typeof useForm<Values>>["control"];
  fieldName: "customerName" | "customerTitle" | "customerCompany";
  label: string;
  placeholder: string;
}) {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={fieldName}>{label}</FieldLabel>
          <Input
            {...field}
            id={fieldName}
            maxLength={fieldName === "customerName" ? name.max : detail.max}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

/** The public testimonial form: words and name first, everything else optional. */
export function TestimonialForm({ slug, projectName }: { slug: string; projectName: string }) {
  const submitTestimonial = useMutation(api.collect.submit);
  const generateAvatarUploadUrl = useMutation(api.collect.generateAvatarUploadUrl);
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [avatarDataUrl, setAvatarDataUrl] = useState("");

  const form = useForm<Values>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      text: "",
      rating: 0,
      customerName: "",
      customerTitle: "",
      customerCompany: "",
      honeypot: "",
    },
  });

  const onSubmit = async (values: Values) => {
    try {
      const avatarStorageId =
        avatarDataUrl === ""
          ? undefined
          : await uploadAvatar(await generateAvatarUploadUrl({ slug }), avatarDataUrl);
      await submitTestimonial({
        slug,
        text: values.text,
        rating: values.rating === 0 ? undefined : values.rating,
        customerName: values.customerName,
        customerTitle: optional(values.customerTitle),
        customerCompany: optional(values.customerCompany),
        avatarStorageId,
        honeypot: optional(values.honeypot),
      });
      setSubmittedName(values.customerName);
    } catch (error) {
      toast.error(
        error instanceof ConvexError
          ? String(error.data)
          : "Your testimonial couldn't be sent. Please try again.",
      );
    }
  };

  if (submittedName !== null) {
    return <ThankYou customerName={submittedName} projectName={projectName} />;
  }

  return (
    <form
      noValidate
      className="flex w-full flex-col gap-8"
      onSubmit={(event) => {
        void form.handleSubmit(onSubmit)(event);
      }}
    >
      <FieldGroup>
        <TextField control={form.control} />
        <Controller
          name="rating"
          control={form.control}
          render={({ field }) => (
            <RatingField
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
              }}
            />
          )}
        />
        <DetailField
          control={form.control}
          fieldName="customerName"
          label="Your name"
          placeholder="Ada Lovelace"
        />
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-4">
          <DetailField
            control={form.control}
            fieldName="customerTitle"
            label="Role (optional)"
            placeholder="Founder"
          />
          <DetailField
            control={form.control}
            fieldName="customerCompany"
            label="Company (optional)"
            placeholder="Acme Inc."
          />
        </div>
        <AvatarPicker value={avatarDataUrl} onChange={setAvatarDataUrl} />
        {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
        <input
          {...form.register("honeypot")}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] size-px opacity-0"
        />
      </FieldGroup>

      <div className="flex flex-col gap-3">
        <Button type="submit" className="self-start" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sending..." : "Send testimonial"}
        </Button>
        <p className="type-caption text-muted-foreground">
          By sending, you let {projectName} show your words, name, and details on their website.
        </p>
      </div>
    </form>
  );
}
