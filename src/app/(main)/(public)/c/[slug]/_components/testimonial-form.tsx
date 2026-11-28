"use client";

import { api } from "@convex/_generated/api";
import { COLLECT_LIMITS } from "@convex/lib/collect";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { CheckIcon, StarIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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
type Control = ReturnType<typeof useForm<Values>>["control"];

const optional = (value: string) => (value === "" ? undefined : value);

/** Confirmation card with a preview of what was sent. */
function ThankYou({
  values,
  avatar,
  projectName,
}: {
  values: Values;
  avatar: string;
  projectName: string;
}) {
  const role = [values.customerTitle, values.customerCompany].filter(Boolean).join(", ");

  return (
    <output className="flex flex-col gap-6 rounded-[var(--radius)] border border-border/80 bg-card p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div
          className="flex size-10 items-center justify-center rounded-[var(--radius)] border border-success-border bg-success-surface text-success"
          aria-hidden="true"
        >
          <CheckIcon className="size-5" />
        </div>
        <Badge variant="mint">Received</Badge>
      </div>
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-[26px] leading-[1.2] font-normal tracking-[-0.02em]">
          Thank you, {values.customerName.split(/\s+/u)[0]}.
        </h2>
        <p className="text-sm/relaxed text-muted-foreground">
          {projectName} will read it before it appears anywhere. You can close this page.
        </p>
      </div>
      <figure className="flex flex-col gap-3 rounded-[var(--radius)] border border-border bg-panel p-4">
        {values.rating > 0 && (
          <div className="flex gap-0.5">
            <span className="sr-only">{values.rating} out of 5</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                aria-hidden="true"
                className={cn(
                  "size-3.5",
                  star <= values.rating ? "fill-warning text-warning" : "text-muted-foreground/35",
                )}
              />
            ))}
          </div>
        )}
        <blockquote className="line-clamp-5 font-serif text-[20px] leading-[1.35] text-pretty">
          &ldquo;{values.text}&rdquo;
        </blockquote>
        <figcaption className="flex items-center gap-2.5">
          <Avatar className="size-7 border border-border">
            <AvatarImage src={avatar} alt="" />
            <AvatarFallback className="bg-background text-xs">
              {values.customerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] font-medium">{values.customerName}</span>
            {role !== "" && <span className="truncate text-xs text-muted-foreground">{role}</span>}
          </div>
        </figcaption>
      </figure>
    </output>
  );
}

function TextField({ control }: { control: Control }) {
  return (
    <Controller
      name="text"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className="flex items-baseline justify-between gap-4">
            <FieldLabel htmlFor="text">Your testimonial</FieldLabel>
            <span
              className={cn(
                "font-mono text-xs tabular-nums",
                field.value.length >= text.max ? "text-warning" : "text-muted-foreground",
              )}
            >
              {field.value.length}/{text.max}
            </span>
          </div>
          <Textarea
            {...field}
            id="text"
            rows={5}
            maxLength={text.max}
            aria-invalid={fieldState.invalid}
            placeholder="What did it help you do? What would you tell a friend?"
            className="min-h-32"
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
  control: Control;
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

/** The public testimonial form: rating and words first, then who you are. */
export function TestimonialForm({
  slug,
  projectName,
  prompt,
}: {
  slug: string;
  projectName: string;
  prompt: string;
}) {
  const submitTestimonial = useMutation(api.collect.submit);
  const generateAvatarUploadUrl = useMutation(api.collect.generateAvatarUploadUrl);
  const [submitted, setSubmitted] = useState<Values | null>(null);
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
      setSubmitted(values);
    } catch (error) {
      toast.error(
        error instanceof ConvexError
          ? String(error.data)
          : "Your testimonial couldn't be sent. Please try again.",
      );
    }
  };

  if (submitted !== null) {
    return <ThankYou values={submitted} avatar={avatarDataUrl} projectName={projectName} />;
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-border/80 bg-card">
      <header className="flex flex-col gap-1.5 border-b border-border px-6 py-6 sm:px-8">
        <p className="font-mono text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
          {projectName}
        </p>
        <h1 className="font-display text-[26px] leading-[1.2] font-normal tracking-[-0.02em] text-balance">
          {prompt}
        </h1>
        <p className="text-sm/relaxed text-muted-foreground">
          A few honest sentences are perfect. It takes about a minute.
        </p>
      </header>

      <form
        noValidate
        onSubmit={(event) => {
          void form.handleSubmit(onSubmit)(event);
        }}
      >
        <FieldGroup className="gap-6 px-6 py-6 sm:px-8">
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
          <TextField control={form.control} />
        </FieldGroup>

        <FieldGroup className="gap-5 border-t border-border px-6 py-6 sm:px-8">
          <h2 className="font-mono text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
            About you
          </h2>
          <DetailField
            control={form.control}
            fieldName="customerName"
            label="Your name"
            placeholder="Ada Lovelace"
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
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

        <div className="flex flex-col gap-3 border-t border-border bg-muted/30 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-xs/relaxed text-muted-foreground sm:max-w-64">
            By sending, you let {projectName} show your words, name, and details on their website.
          </p>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Sending..." : "Send testimonial"}
          </Button>
        </div>
      </form>
    </div>
  );
}
