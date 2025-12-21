"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { authClient } from "@/server/better-auth/client";

const signupPayloadSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  confirmPassword: z.string(),
});

export type SignupPayload = z.infer<typeof signupPayloadSchema>;
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [passwordIsHidden, setPasswordIsHidden] = React.useState<boolean>(true);
  const [confirmPasswordIsHidden, setConfirmPasswordIsHidden] =
    React.useState<boolean>(true);

  const form = useForm({
    resolver: zodResolver(signupPayloadSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupPayload) => {
    toast.promise(
      authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: "/testimonies",
      }),
      {
        loading: "Signin up...",
        success: "Account Created!",
        error: "Failed to create account",
      }
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      aria-invalid={fieldState.invalid}
                      type="text"
                      placeholder="John Doe"
                      autoComplete="off"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      autoComplete="off"
                      required
                    />
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Password</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id="password"
                          type={passwordIsHidden ? "password" : "text"}
                          autoComplete="off"
                          placeholder="MySuperSecretPassword"
                          required
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            onClick={() =>
                              setPasswordIsHidden(!passwordIsHidden)
                            }
                          >
                            {passwordIsHidden ? <EyeClosedIcon /> : <EyeIcon />}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                  );
                }}
              />

              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Confirm Password</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id="confirmPassword"
                          type={confirmPasswordIsHidden ? "password" : "text"}
                          autoComplete="off"
                          placeholder="MySuperSecretPassword"
                          required
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
                    </Field>
                  );
                }}
              />

              <Field>
                <Button type="submit">Create Account</Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/sign-in">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
