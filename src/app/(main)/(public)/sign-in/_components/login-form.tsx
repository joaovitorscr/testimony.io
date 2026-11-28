"use client";

import {
  useOauth as useGithubOauth,
  useSignInWithGithub,
} from "@convex-dev/auth/methods/github/react";
import {
  useOauth as useGoogleOauth,
  useSignInWithGoogle,
} from "@convex-dev/auth/methods/google/react";
import { api } from "@convex/_generated/api";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { type ComponentProps, type SVGProps, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { FieldError, FieldSeparator } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Google } from "@/components/ui/svgs/google";
import { cn } from "@/lib/utils";

import { DevPasswordForm } from "./dev-password-form";

type FlowError = ReturnType<typeof useGoogleOauth>["flowError"];

function describeFlowError(error: NonNullable<FlowError>) {
  switch (error.error) {
    case "ACCESS_DENIED": {
      return "Sign-in was cancelled.";
    }
    case "EXPIRED": {
      return "That sign-in took too long. Please try again.";
    }
    case "INVALID_FLOW": {
      return "This sign-in can't be completed here. Please try again.";
    }
    case "OTHER_ERROR": {
      return "Something went wrong during sign-in. Please try again.";
    }
    default: {
      error satisfies never;
      return "Something went wrong during sign-in. Please try again.";
    }
  }
}

function GithubMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export function LoginForm({
  devPassword,
  className,
  ...props
}: ComponentProps<"div"> & { devPassword: boolean }) {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signIn: signInWithGoogle } = useSignInWithGoogle(api.auth);
  const { signIn: signInWithGithub } = useSignInWithGithub(api.auth);
  const { flowError: googleError } = useGoogleOauth();
  const { flowError: githubError } = useGithubOauth();
  const [pending, setPending] = useState<"google" | "github" | null>(null);
  const [startError, setStartError] = useState<string | null>(null);

  // OAuth finishes on this page after the provider redirects back.
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/testimonials");
    }
  }, [isAuthenticated, router]);

  const start = async (provider: "google" | "github") => {
    setStartError(null);
    setPending(provider);
    const result = await (provider === "google" ? signInWithGoogle() : signInWithGithub());
    if (result.status === "redirect") {
      return;
    }
    console.error(`${provider} sign-in failed to start`, result.userError);
    setStartError("Couldn't start sign-in. Please try again.");
    setPending(null);
  };

  const flowError = googleError ?? githubError;
  const errorMessage = startError ?? (flowError ? describeFlowError(flowError) : null);
  const busy = pending !== null || isLoading || isAuthenticated;

  return (
    <div className={cn("flex flex-col gap-8", className)} {...props}>
      <div className="flex flex-col gap-3">
        <p className="font-mono text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
          Sign in
        </p>
        <h1 className="font-display text-[34px] leading-[1.15] font-normal tracking-[-0.02em] text-balance text-foreground">
          Collect the words your customers already say.
        </h1>
        <p className="text-sm text-muted-foreground">
          Continue with Google or GitHub to start collecting testimonials.
        </p>
      </div>

      {errorMessage !== null && <FieldError>{errorMessage}</FieldError>}

      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => {
            void start("google");
          }}
        >
          {pending === "google" ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <Google data-icon="inline-start" />
          )}
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => {
            void start("github");
          }}
        >
          {pending === "github" ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <GithubMark data-icon="inline-start" />
          )}
          Continue with GitHub
        </Button>
      </div>

      {devPassword && (
        <>
          <FieldSeparator>or</FieldSeparator>
          <DevPasswordForm disabled={busy} />
        </>
      )}

      <p className="border-t border-border pt-4 text-xs text-muted-foreground">
        New here? Your account is created on first sign-in.
      </p>
    </div>
  );
}
