# Deployment

| Piece    | Where                         | Notes                                                         |
| -------- | ----------------------------- | ------------------------------------------------------------- |
| Frontend | Vercel project `testimony-io` | Production at https://testimony-io.vercel.app                 |
| Backend  | Convex project `testimony-io` | Deployments `production` (prod) and a personal dev deployment |

Vercel builds with `npx convex deploy --cmd 'next build'` (`vercel.json`): it
pushes the Convex functions to production, sets `NEXT_PUBLIC_CONVEX_URL`, then
builds Next.js. The Vercel project needs `CONVEX_DEPLOY_KEY` (a production
deploy key) and `NEXT_PUBLIC_APP_URL`.

## Environment variables

| Where                 | Variable                                             | Purpose                                                            |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------------------------ |
| Vercel                | `CONVEX_DEPLOY_KEY`                                  | Lets builds deploy the Convex backend                              |
| Vercel / `.env.local` | `NEXT_PUBLIC_APP_URL`                                | Public URL used in collection links and embed snippets             |
| `.env.local`          | `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`        | Written by `convex dev`                                            |
| Convex                | `AUTH_GOOGLE_CLIENT_ID`, `AUTH_GOOGLE_CLIENT_SECRET` | Google OAuth app                                                   |
| Convex                | `AUTH_GITHUB_CLIENT_ID`, `AUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth app                                                   |
| Convex                | `SITE_URL`                                           | Comma-separated frontend origins allowed as OAuth redirect targets |

`convex/convex.config.ts` declares the Convex variables; a deploy fails while a
required one is missing.

## OAuth apps

Each provider redirects to the Convex deployment, not to Next.js. Register
these callback URLs, using the deployment's `CONVEX_SITE_URL`
(`npx convex env get CONVEX_SITE_URL`, add `--prod` for production):

- Google: `<CONVEX_SITE_URL>/oauth/google/callback`
- GitHub: `<CONVEX_SITE_URL>/oauth/github/callback`

Set `SITE_URL` to every origin the app runs on, for example
`https://testimony-io.vercel.app` on production and `http://localhost:3000` on
the dev deployment.

## Local development

```bash
pnpm install
pnpm dev          # convex dev + next dev
```

The first `convex dev` asks you to log in and pick the project, then writes
`.env.local`. Set the OAuth variables on your dev deployment with
`npx convex env set`.
