"use client";

import { DEFAULT_MIN_PASSWORD_LENGTH } from "@convex-dev/auth/methods/username-password";
import {
  type SignInWithUsernamePasswordResult,
  type SignUpWithUsernamePasswordResult,
  useSignInWithUsernamePassword,
  useSignUpWithUsernamePassword,
} from "@convex-dev/auth/methods/username-password/react";
import { api } from "@convex/_generated/api";
import { ConvexError } from "convex/values";
import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

type Failure = Extract<
  SignInWithUsernamePasswordResult | SignUpWithUsernamePasswordResult,
  { status: "error" }
>["userError"];

function describeFailure(failure: Failure) {
  switch (failure.error) {
    case "INVALID_CREDENTIALS": {
      return "Wrong password for that email.";
    }
    case "RATE_LIMITED": {
      return "Too many attempts. Wait a moment and try again.";
    }
    case "PASSWORD_TOO_SHORT": {
      return `Use at least ${failure.minimumLength} characters.`;
    }
    case "PASSWORD_TOO_LONG": {
      return `Use at most ${failure.maximumLength} characters.`;
    }
    case "PASSWORD_TOO_COMMON": {
      return "That password is too common. Pick another.";
    }
    case "PASSWORD_HAS_SURROUNDING_WHITESPACE": {
      return "Remove the spaces around the password.";
    }
    case "USER_NOT_FOUND":
    case "USERNAME_TAKEN":
    case "USERNAME_TOO_SHORT":
    case "USERNAME_TOO_LONG":
    case "USERNAME_HAS_INVALID_CHARACTERS":
    case "USERNAME_HAS_SURROUNDING_WHITESPACE": {
      return "That email can't be used. Try another.";
    }
    case "OTHER_ERROR": {
      // The server rejects password sign-ins unless AUTH_DEV_PASSWORD is set.
      const { cause } = failure;
      return cause instanceof ConvexError && typeof cause.data === "string"
        ? `${cause.data} Run: npx convex env set AUTH_DEV_PASSWORD true`
        : "Something went wrong. Please try again.";
    }
    default: {
      failure satisfies never;
      return "Something went wrong. Please try again.";
    }
  }
}

/**
 * Email + password sign-in for development deployments. Signs in, or creates
 * the account when the email has none.
 */
export function DevPasswordForm({ disabled }: { disabled: boolean }) {
  const { signIn, pending: signingIn } = useSignInWithUsernamePassword(api.auth);
  const { signUp, pending: signingUp } = useSignUpWithUsernamePassword(api.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const pending = signingIn || signingUp;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const credentials = { username: email.trim().toLowerCase(), password };
    const signedIn = await signIn(credentials);
    const result =
      signedIn.status === "error" && signedIn.userError.error === "USER_NOT_FOUND"
        ? await signUp(credentials)
        : signedIn;
    if (result.status === "error") {
      setError(describeFailure(result.userError));
    }
  };

  return (
    <form
      onSubmit={(event) => {
        void submit(event);
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </Field>
        <Field data-invalid={error !== null}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            minLength={DEFAULT_MIN_PASSWORD_LENGTH}
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            aria-invalid={error !== null}
          />
          {error === null ? (
            <FieldDescription>
              Development only. A new email creates its account on first sign-in.
            </FieldDescription>
          ) : (
            <FieldError>{error}</FieldError>
          )}
        </Field>
        <Button type="submit" variant="secondary" disabled={disabled || pending}>
          {pending && <Spinner data-icon="inline-start" />}
          Continue with email
        </Button>
      </FieldGroup>
    </form>
  );
}
