"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
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
import { cn } from "@/lib/utils";
import { authClient } from "@/server/better-auth/client";

const loginPayloadSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8),
  remember: z.boolean().optional(),
});

import { EyeClosedIcon, EyeIcon } from "lucide-react";
import * as React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

type LoginPayload = z.infer<typeof loginPayloadSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [passwordIsHidden, setPasswordIsHidden] = React.useState(true);

  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginPayloadSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (values: LoginPayload) => {
    form.setError("root", {
      message: undefined,
    });

    await authClient.signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: values.remember,
      callbackURL: "/testimonies",
      fetchOptions: {
        onError: (error) => {
          form.setError("root", {
            message: error.error.message,
          });
        },
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            id="login-form"
            className="p-6 md:p-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="font-bold text-2xl">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Testimony.io account
                </p>
              </div>
              {form.formState.errors.root && (
                <Field orientation="horizontal" className="justify-center">
                  <FieldError errors={[form.formState.errors.root]} />
                </Field>
              )}
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
                      autoComplete="username"
                      aria-invalid={fieldState.invalid}
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Link
                        href={"/forgot-password" as Route}
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="password"
                        type={passwordIsHidden ? "password" : "text"}
                        required
                        autoComplete="current-password"
                        placeholder="********"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          onClick={() => setPasswordIsHidden(!passwordIsHidden)}
                        >
                          {passwordIsHidden ? <EyeClosedIcon /> : <EyeIcon />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field>
                <Button type="submit">Login</Button>
              </Field>
              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link href={"/sign-up" as Route}>Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              width={1000}
              height={1000}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
