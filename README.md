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

- [Architecture](docs/internals/architecture.md): data model, access control, collection and embed flows, code layout
- [Tooling and CI](docs/internals/tooling.md): lint policy, type checking, tests, the sharded CI pipeline
- [Deployment](docs/internals/deployment.md): Vercel, Convex, environment variables, OAuth setup

<br />

## 🔌 Widget Embed Example

Add your site under **Widget → Domains**, then embed:

```html
<iframe
  src="https://testimony-io.vercel.app/embed/YOUR_WIDGET_ID"
  title="Testimonials"
  width="100%"
  height="600"
  style="border: 0"
></iframe>
```
