"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { AvatarPicker } from "./avatar-picker";

const testimonialSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerCompany: z.string().optional(),
  customerTitle: z.string().optional(),
  rating: z.number().min(1, "Please rate your experience").max(5),
  text: z.string().min(10, "Please provide more detail (at least 10 chars)"),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

function isStorageResponse(value: unknown): value is { storageId: Id<"_storage"> } {
  return (
    typeof value === "object" &&
    value !== null &&
    "storageId" in value &&
    typeof value.storageId === "string"
  );
}

/** Uploads a cropped data URL to a Convex upload URL and returns its storage id. */
async function uploadAvatar(uploadUrl: string, dataUrl: string) {
  const image = await fetch(dataUrl);
  const blob = await image.blob();
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": blob.type === "" ? "image/png" : blob.type },
    body: blob,
  });
  const body: unknown = await response.json();
  if (!response.ok || !isStorageResponse(body)) {
    throw new Error("Avatar upload failed");
  }
  return body.storageId;
}

export function TestimonialForm({ token }: { token: string }) {
  const submitTestimonial = useMutation(api.collect.submit);
  const generateAvatarUploadUrl = useMutation(api.collect.generateAvatarUploadUrl);
  const [submitted, setSubmitted] = useState(false);

  const [avatarDataUrl, setAvatarDataUrl] = useState("");

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    mode: "onChange",
    defaultValues: {
      customerName: "",
      customerCompany: "",
      customerTitle: "",
      rating: 0,
      text: "",
    },
  });

  const onSubmit = async (values: TestimonialFormValues) => {
    try {
      const avatarStorageId =
        avatarDataUrl === ""
          ? undefined
          : await uploadAvatar(await generateAvatarUploadUrl({ token }), avatarDataUrl);
      await submitTestimonial({ token, ...values, avatarStorageId });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof ConvexError
          ? String(error.data)
          : "Failed to submit testimonial. Please try again.",
      );
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col gap-2">
        <h2 className="type-lede">Thank you.</h2>
        <p className="text-fg-2">Your testimonial has been received.</p>
      </div>
    );
  }

  return (
    <form
      className="flex w-full flex-col gap-8"
      onSubmit={(event) => {
        void form.handleSubmit(onSubmit)(event);
      }}
    >
      <FieldGroup>
        <AvatarPicker value={avatarDataUrl} onChange={setAvatarDataUrl} />

        <Controller
          name="rating"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Rating</FieldLabel>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`${star} out of 5`}
                    onClick={() => {
                      field.onChange(star);
                    }}
                    className={cn(
                      "rounded-sm p-0.5 transition-colors duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      field.value >= star ? "text-foreground" : "text-fg-faint hover:text-fg-2",
                    )}
                  >
                    <StarIcon className={cn("size-7", field.value >= star && "fill-current")} />
                  </button>
                ))}
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="text"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="text">Your testimonial</FieldLabel>
              <Textarea {...field} id="text" placeholder="Share your experience..." rows={4} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="customerName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="customerName">Your name</FieldLabel>
              <Input {...field} id="customerName" placeholder="John Doe" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-4">
          <Controller
            name="customerTitle"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="customerTitle">Job title (optional)</FieldLabel>
                <Input {...field} id="customerTitle" placeholder="CEO" />
              </Field>
            )}
          />

          <Controller
            name="customerCompany"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="customerCompany">Company (optional)</FieldLabel>
                <Input {...field} id="customerCompany" placeholder="Acme Inc." />
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      <Button
        type="submit"
        className="self-start"
        disabled={form.formState.isSubmitting || !form.formState.isValid}
      >
        {form.formState.isSubmitting ? "Submitting..." : "Submit testimonial"}
      </Button>
    </form>
  );
}
