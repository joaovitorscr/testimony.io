"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { authClient } from "@/server/better-auth/client";

const signupPayloadSchema = z
  .object({
    name: z.string().min(4),
    email: z.email("Invalid email address"),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignupPayload = z.infer<typeof signupPayloadSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [creatingAccount, setCreatingAccount] = React.useState(false);

  const [passwordIsHidden, setPasswordIsHidden] = React.useState(true);
  const [confirmPasswordIsHidden, setConfirmPasswordIsHidden] =
    React.useState(true);

  const router = useRouter();

  const form = useForm<SignupPayload>({
    resolver: zodResolver(signupPayloadSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignupPayload) => {
    form.setError("root", {
      message: undefined,
    });

    setCreatingAccount(true);
    await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: "/testimonies",
      fetchOptions: {
        onSuccess: () => {
          setCreatingAccount(false);

          router.push("/testimonies");
        },
        onError: (error) => {
          form.setError("root", {
            message: error.error.message,
          });
          setCreatingAccount(false);
        },
      },
    });
  };

  return (
    <div className={cn("flex h-full flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden bg-muted md:block">
            <Image
              src="https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              width={1000}
              height={1000}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
            />
          </div>
          <form
            id="signup-form"
            className="p-6 md:p-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="font-bold text-2xl">Create your account</h1>
                <p className="text-balance text-muted-foreground text-sm">
                  Enter your email below to create your account
                </p>
              </div>
              {form.formState.errors.root && (
                <Field orientation="horizontal" className="justify-center">
                  <FieldError errors={[form.formState.errors.root]} />
                </Field>
              )}
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
                      placeholder="John Doe"
                      required
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      We&apos;ll use this to contact you. We will not share your
                      email with anyone else.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            id="password"
                            type={passwordIsHidden ? "password" : "text"}
                            required
                            autoComplete="new-password"
                            placeholder="********"
                            aria-invalid={fieldState.invalid}
                          />
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              onClick={() =>
                                setPasswordIsHidden(!passwordIsHidden)
                              }
                            >
                              {passwordIsHidden ? (
                                <EyeClosedIcon />
                              ) : (
                                <EyeIcon />
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
                  <Controller
                    control={form.control}
                    name="confirmPassword"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="confirm-password">
                          Confirm Password
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            id="confirm-password"
                            type={confirmPasswordIsHidden ? "password" : "text"}
                            required
                            autoComplete="new-password"
                            placeholder="********"
                            aria-invalid={fieldState.invalid}
                          />
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              onClick={() =>
                                setConfirmPasswordIsHidden(
                                  !confirmPasswordIsHidden
                                )
                              }
                            >
                              {confirmPasswordIsHidden ? (
                                <EyeClosedIcon />
                              ) : (
                                <EyeIcon />
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
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={creatingAccount || !form.formState.isValid}
                >
                  {creatingAccount ? (
                    <>
                      <Spinner />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link href={"/sign-in" as Route}>Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
