"use client";

import { api } from "@convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

type User = NonNullable<FunctionReturnType<typeof api.users.me>>;

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function AccountForm({ user }: { user: User }) {
  return <ProfileSection user={user} />;
}

function ProfileSection({ user }: { user: User }) {
  const updateProfile = useMutation(api.users.updateProfile);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      name: user.name ?? "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateProfile({ name: values.name });
      form.reset({ name: values.name });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        void form.handleSubmit(onSubmit)(event);
      }}
    >
      <div className="flex flex-col gap-2">
        <h2 className="type-title text-fg-2">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Update your display name. Your email and avatar come from your Google or GitHub account.
        </p>
      </div>
      <FieldGroup>
        <Field orientation="horizontal" className="items-center gap-6">
          <Avatar className="size-16">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
            <AvatarFallback className="text-xl">
              {(user.name ?? "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...field}
                  id="name"
                  type="text"
                  placeholder="Your name"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </Field>
        <FieldSeparator />
        <Field orientation="horizontal">
          <Button
            type="submit"
            size="sm"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}
            {form.formState.isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
