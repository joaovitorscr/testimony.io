"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
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
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { AppleDark } from "@/components/ui/svgs/appleDark";
import { Google } from "@/components/ui/svgs/google";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const signinPayloadSchema = z.object({
  email: z.email(),
  password: z.string(),
});

type signinPayload = z.infer<typeof signinPayloadSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [passwordIsHidden, setPasswordIsHidden] = React.useState<boolean>(true);
  const { signIn } = authClient;

  const form = useForm({
    resolver: zodResolver(signinPayloadSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: signinPayload) => {
    signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: "/",
      rememberMe: true,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with Email or Social Accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
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

              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/sign-up">Sign up</a>
                </FieldDescription>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field>
                <Button variant="outline" type="button">
                  <AppleDark />
                  Login with Apple
                </Button>
                <Button variant="outline" type="button">
                  <Google />
                  Login with Google
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
