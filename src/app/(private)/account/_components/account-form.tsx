"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient, type Session } from "@/server/better-auth/client";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface AccountFormProps {
  user: Session["user"];
}

export function AccountForm({ user }: AccountFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <ProfileCard user={user} />
      <PasswordCard />
    </div>
  );
}

function ProfileCard({ user }: { user: Session["user"] }) {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      name: user.name ?? "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsUpdating(true);

    const nameChanged = values.name !== user.name;

    try {
      if (nameChanged) {
        await authClient.updateUser({
          name: values.name,
          fetchOptions: {
            onError: (error) => {
              throw new Error(error.error.message);
            },
          },
        });
      }

      setIsUpdating(false);
      form.reset({ name: values.name  });
      router.refresh();
    } catch (error) {
      form.setError("root", {
        message: error instanceof Error ? error.message : "An error occurred",
      });
      setIsUpdating(false);
      toast.error("Failed to update profile");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            {form.formState.errors.root && (
              <Field orientation="horizontal" className="justify-center">
                <FieldError errors={[form.formState.errors.root]} />
              </Field>
            )}

            <Field orientation="horizontal" className="items-center gap-6">
              <Avatar className="size-16 border-2 border-border">
                <AvatarImage
                  src={user.image ?? undefined}
                  alt={user.name ?? "User"}
                />
                <AvatarFallback className="font-semibold text-xl">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
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
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button
            type="submit"
            disabled={isUpdating || !form.formState.isDirty}
          >
            {isUpdating ? (
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

function PasswordCard() {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: PasswordFormValues) => {
    setIsUpdating(true);

    const updatePromise = authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: true,
      fetchOptions: {
        onSuccess: () => {
          setIsUpdating(false);
          form.reset();
        },
        onError: (error) => {
          form.setError("root", {
            message: error.error.message,
          });
          setIsUpdating(false);
        },
      },
    });

    toast.promise(updatePromise, {
      loading: "Updating your password...",
      success: "Password updated successfully",
      error: "Failed to update password",
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            {form.formState.errors.root && (
              <Field orientation="horizontal" className="justify-center">
                <FieldError errors={[form.formState.errors.root]} />
              </Field>
            )}

            <Controller
              control={form.control}
              name="currentPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? <EyeIcon /> : <EyeClosedIcon />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="newPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Label htmlFor="newPassword">New Password</Label>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeIcon /> : <EyeClosedIcon />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeIcon />
                          ) : (
                            <EyeClosedIcon />
                          )}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <FieldDescription>
              Password must be at least 8 characters. Other sessions will be
              logged out.
            </FieldDescription>
          </FieldGroup>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button
            type="submit"
            disabled={isUpdating || !form.formState.isValid}
          >
            {isUpdating ? (
              <>
                <Spinner />
                <span>Updating...</span>
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
