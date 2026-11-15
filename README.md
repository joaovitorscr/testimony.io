<a href="https://testimony.io.joaovitorscr.com" target="_blank" rel="noopener">
  <picture>
    <source media="(prefers-color-scheme: dark)" alt="Testimony.io" srcset="https://testimony.io.joaovitorscr.com/branding_white.png" />
    <img alt="Testimony.io" src="https://testimony.io.joaovitorscr.com/branding_black.png" />
  </picture>
</a>

<h4 align="center">
  Collect, manage, and showcase customer testimonials with ease.
</h4>

<p align="center">
  <a href="https://testimony.io.joaovitorscr.com">Live App</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-environment-variables">Environment Variables</a> •
  <a href="#-project-structure">Project Structure</a>
</p>

<br />

## ✨ Features

- 📝 **Collect Testimonials** - Create single-use links to collect testimonials from your customers
- 🎨 **Customizable Widget** - Embed a customizable widget on your website
- 👥 **Multi-Project Support** - Manage testimonials for multiple projects/products
- ✅ **Approval Workflow** - Only approved testimonials appear in your widget
- ⭐ **Rating System** - Collect star ratings alongside text testimonials
- 🔒 **One-click sign-in** - Google and GitHub via Convex Auth
- 🌐 **Domain Allowlist** - Control which domains can embed your widget
- ⚡ **Realtime dashboard** - New testimonials appear instantly

<br />

## 🛠️ Tech Stack

| | |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Backend & database** | [Convex](https://convex.dev) (queries, mutations, file storage) |
| **Authentication** | [Convex Auth](https://docs.convex.dev/auth/convex-auth) 2 (Google + GitHub OAuth, SSR cookies) |
| **Styling / UI** | Tailwind CSS 4, Radix UI + shadcn/ui |
| **Forms** | React Hook Form + Zod |
| **Hosting** | Vercel (frontend) + Convex Cloud (backend) |
| **Tooling** | Bun, Biome, TypeScript |

<br />

## 🚀 Getting Started

```bash
bun install
bun run dev   # runs `convex dev` and `next dev` together
```

The first `convex dev` run asks you to log in and pick a project, then writes
`CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` to `.env.local`.

### OAuth setup

Create a Google OAuth client and a GitHub OAuth app. Use these callback URLs,
where `<site>` is your deployment's `CONVEX_SITE_URL`
(`npx convex env get CONVEX_SITE_URL`):

- Google: `<site>/oauth/google/callback`
- GitHub: `<site>/oauth/github/callback`

Then set them on the Convex deployment:

```bash
npx convex env set AUTH_GOOGLE_CLIENT_ID ...
npx convex env set AUTH_GOOGLE_CLIENT_SECRET ...
npx convex env set AUTH_GITHUB_CLIENT_ID ...
npx convex env set AUTH_GITHUB_CLIENT_SECRET ...
# Comma-separated frontend origins allowed as OAuth redirect targets
npx convex env set SITE_URL http://localhost:3000
```

<br />

## 🔑 Environment Variables

| Where | Variable | Description |
|---|---|---|
| Next.js | `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL (written by `convex dev`, set by `convex deploy` on Vercel) |
| Next.js | `NEXT_PUBLIC_APP_URL` | Public URL of the app (defaults to `http://localhost:3000` in dev) |
| Vercel | `CONVEX_DEPLOY_KEY` | Production deploy key, so Vercel builds also deploy the Convex backend |
| Convex | `AUTH_GOOGLE_CLIENT_ID` / `_SECRET` | Google OAuth credentials |
| Convex | `AUTH_GITHUB_CLIENT_ID` / `_SECRET` | GitHub OAuth credentials |
| Convex | `SITE_URL` | Allowed OAuth redirect origins, comma-separated |

<br />

## 🚢 Deploying

Vercel runs `npx convex deploy --cmd 'next build'` (see `vercel.json`), which
pushes the Convex functions to production and builds Next.js against them.

<br />

## 📁 Project Structure

```
testimony.io/
├── convex/                 # Backend: schema, queries, mutations, auth
├── public/                 # Static assets
└── src/
    ├── app/
    │   ├── (main)/         # App root layout
    │   │   ├── (private)/  # Dashboard (signed in)
    │   │   └── (public)/   # Sign-in and collection pages
    │   ├── (embed)/        # Minimal root layout for the embeddable widget
    │   └── auth/           # Convex Auth sign-in/refresh/sign-out handlers
    ├── components/         # React components (ui/ is shadcn)
    ├── lib/                # Convex Auth setup, utilities
    └── proxy.ts            # Auth redirects
```

<br />

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Convex and Next.js dev servers |
| `bun run build` | Build Next.js for production |
| `bun run typecheck` | Typecheck the app and the Convex functions |
| `bun run lint` | Run Biome |
| `bun run format` | Format code with Biome |

<br />

## 🔌 Widget Embed Example

Add your site under **Widget → Domains**, then embed:

```html
<iframe
  src="https://your-domain.com/embed/YOUR_WIDGET_ID"
  title="Testimonials"
  width="100%"
  height="600"
  style="border: 0"
></iframe>
```
