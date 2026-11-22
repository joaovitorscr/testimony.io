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

- 🔗 **One link per project** - Share `/c/<your-project>` anywhere; customers need no account
- ✅ **Review before publishing** - Pending, approved, and archived, with Undo
- 🎨 **Embeddable widget** - One snippet, any site; sizes itself, light/dark/auto themes
- 🧩 **Public JSON API** - Render approved testimonials with your own components
- ⭐ **Optional ratings and photos** - The quote and a name are all that's required
- 👥 **Multi-Project Support** - Manage testimonials for multiple products
- 🔒 **One-click sign-in** - Google and GitHub via Convex Auth
- ⚡ **Realtime dashboard** - New testimonials appear instantly

<br />

## 🛠️ Tech Stack

|                        |                                                                               |
| ---------------------- | ----------------------------------------------------------------------------- |
| **Framework**          | Next.js 16 (App Router, React Compiler)                                       |
| **Backend & database** | [Convex](https://convex.dev) (queries, mutations, file storage)               |
| **Authentication**     | [Convex Auth](https://docs.convex.dev/auth/convex-auth) 2 (Google and GitHub) |
| **Styling / UI**       | Tailwind CSS 4, shadcn/ui                                                     |
| **Hosting**            | Vercel (frontend) and Convex Cloud (backend)                                  |
| **Tooling**            | pnpm, oxlint, oxfmt, Vitest + convex-test, `bun check` in CI                  |

<br />

## 🚀 Getting Started

```bash
pnpm install
pnpm dev   # runs `convex dev` and `next dev` together
```

The first `convex dev` asks you to log in and pick a project, then writes
`.env.local`. Sign-in needs Google and GitHub OAuth apps; see
[docs/internals/deployment.md](docs/internals/deployment.md).

<br />

## 📜 Scripts

| Command                             | Description                                     |
| ----------------------------------- | ----------------------------------------------- |
| `pnpm dev`                          | Convex and Next.js dev servers                  |
| `pnpm build`                        | Production build                                |
| `pnpm lint` / `pnpm lint:fix`       | oxlint with every category on                   |
| `pnpm format` / `pnpm format:check` | oxfmt                                           |
| `pnpm typecheck`                    | TypeScript for the app and the Convex functions |
| `pnpm test` / `pnpm test:watch`     | Vitest                                          |

<br />

## 📚 Documentation

- [Architecture](docs/internals/architecture.md): data model, access control, collect/review/display flows, the public API, decisions, code layout
- [Tooling and CI](docs/internals/tooling.md): lint policy, type checking, tests, the sharded CI pipeline
- [Deployment](docs/internals/deployment.md): Vercel, Convex, environment variables, OAuth setup

<br />

## 🔌 Showing testimonials on your site

Copy the snippet from **Display** in the dashboard. It works on any site, with
no setup:

```html
<iframe
  src="https://testimony-io.vercel.app/embed/YOUR_WIDGET_ID"
  title="Testimonials"
  loading="lazy"
  style="width:100%;height:480px;border:0"
></iframe>
<script src="https://testimony-io.vercel.app/embed.js" async></script>
```

Or fetch them as JSON on your server and render them yourself:

```ts
const res = await fetch("https://testimony-io.vercel.app/api/v1/widgets/YOUR_WIDGET_ID");
const { testimonials } = await res.json();
```

See [the API contract](docs/internals/architecture.md#public-api-v1).
