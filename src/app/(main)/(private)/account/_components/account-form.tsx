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
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

type User = NonNullable<FunctionReturnType<typeof api.users.me>>;

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function AccountForm({ user }: { user: User }) {
  return (
    <div className="flex flex-col gap-6">
      <ProfileCard user={user} />
    </div>
  );
}

function ProfileCard({ user }: { user: User }) {
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
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your display name. Your email and avatar come from your Google or GitHub account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field orientation="horizontal" className="items-center gap-6">
              <Avatar className="size-16 border-2 border-border">
                <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                <AvatarFallback className="text-xl font-semibold">
                  {(user.name ?? "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-1 flex-col gap-4">
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label htmlFor="name">Name</Label>
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
              </div>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
            {form.formState.isSubmitting ? (
              <>
                <Spinner />
                <span>Saving...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
