import { setupGithub } from "@convex-dev/auth/methods/github/server";
import { setupGoogle } from "@convex-dev/auth/methods/google/server";
import { setupUsernamePassword } from "@convex-dev/auth/methods/username-password/server";
import { setupConvexAuth } from "@convex-dev/auth/server";

import { components, internal } from "./_generated/api";
import { env } from "./_generated/server";

const allowedRedirectOrigins = (env.SITE_URL ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const auth = setupConvexAuth({ component: components.auth });

export const { signOut, refreshSession, isAuthenticated } = auth;

const userCallbacks = {
  createUser: internal.users.createUser,
  onSignIn: internal.users.onSignIn,
};

export const { startSignInWithGoogle, completeSignInWithGoogle } = setupGoogle(auth, {
  component: components.authGoogle,
  allowedRedirectOrigins,
}).attachUserCallbacks(userCallbacks);

export const { startSignInWithGithub, completeSignInWithGithub } = setupGithub(auth, {
  component: components.authGithub,
  allowedRedirectOrigins,
}).attachUserCallbacks(userCallbacks);

// Development only: the username is the email. users.onSignIn rejects these
// sign-ins unless the deployment sets AUTH_DEV_PASSWORD.
export const { signUpWithUsernamePassword, signInWithUsernamePassword } = setupUsernamePassword(
  auth,
  { component: components.authPassword, usernameComponent: components.authUsername },
).attachUserCallbacks(userCallbacks);
