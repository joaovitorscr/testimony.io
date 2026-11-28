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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
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
      onSubmit={(event) => {
        void form.handleSubmit(onSubmit)(event);
      }}
    >
      <Card className="gap-0 overflow-hidden pb-0">
        <CardHeader className="border-b border-border pb-5 [.border-b]:pb-5">
          <CardTitle className="font-display text-[17px] font-normal tracking-[-0.01em]">
            Profile
          </CardTitle>
          <CardDescription className="text-[13px]">
            Your display name is yours to change. Your email and avatar come from your sign-in
            provider.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 py-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-12">
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
              <AvatarFallback className="text-base">
                {(user.name ?? "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">{user.name ?? "Unnamed"}</span>
              {user.email !== null && (
                <span className="truncate text-[13px] text-muted-foreground">{user.email}</span>
              )}
            </div>
          </div>

          <FieldGroup className="gap-5">
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
            {user.email !== null && (
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  readOnly
                  className="bg-muted/40 text-muted-foreground"
                />
                <FieldDescription className="text-[13px]">
                  Managed by your sign-in provider.
                </FieldDescription>
              </Field>
            )}
          </FieldGroup>
        </CardContent>

        <CardFooter className="justify-end border-t border-border bg-muted/30 py-3 [.border-t]:pt-3">
          <Button
            type="submit"
            size="sm"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}
            {form.formState.isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
