# Architecture

Testimony.io collects customer testimonials through single-use links and shows
the approved ones in an embeddable widget.

## Stack

- **Next.js 16** (App Router, React Compiler, typed routes) renders the
  dashboard, the public collection page, and the embed.
- **Convex** is the backend: database, queries, mutations, and file storage.
  Every dashboard query is a live subscription, so the UI updates without
  refetching.
- **Convex Auth 2** signs users in with Google or GitHub. Sessions use the SSR
  setup: the refresh token lives in an `httpOnly` cookie set by the route
  handlers under `src/app/auth/`, and `src/proxy.ts` refreshes the access
  token before each page request.
- **Vercel** hosts Next.js; **Convex Cloud** hosts the backend. See
  [deployment.md](./deployment.md).

## Data model

Defined in `convex/schema.ts`.

| Table          | Purpose                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------- |
| `users`        | Profile from the OAuth provider and the user's active project.                                    |
| `projects`     | A product or site that collects testimonials. `slug` is unique.                                   |
| `members`      | Who can access a project, with a role (`owner` or `member`).                                      |
| `testimonials` | A submission: text, rating, customer details, avatar in file storage, `isApproved`, `isFeatured`. |
| `requests`     | A single-use collection link: random `token` and `status` (`active`, `used`, `cancelled`).        |
| `widgets`      | One per project: display settings and the domains allowed to embed it.                            |

Creating a project also creates the owner membership and the widget, and makes
the project active for its creator.

## Access control

Every function that reads or changes project data calls `requireMember`
(`convex/lib/access.ts`) with the project id, and throws "Project not found"
for anyone outside the project. Functions that receive a document id (a
testimonial, a link, a widget) load the document first and check membership on
its `projectId`. The client never decides access.

Public functions are limited to what anonymous visitors need:

- `collect.getLink`, `collect.generateAvatarUploadUrl`, and `collect.submit`,
  each gated by a usable link token.
- `widgets.getPublic`, gated by the widget's allowed domains.

## Flows

### Collecting a testimonial

1. A member creates a link on the Collect Link page (`requests.create`), which
   copies `/c/<slug>?token=<token>` to the clipboard.
2. The customer opens it. `src/app/(main)/(public)/c/[projectName]/page.tsx`
   looks the token up with `collect.getLink`; the slug is cosmetic, so links
   survive a project rename.
3. An optional cropped avatar goes to Convex file storage through an upload
   URL from `collect.generateAvatarUploadUrl`.
4. `collect.submit` validates the fields, stores the testimonial as pending,
   and marks the link used. A link accepts one submission.

### Embedding the widget

The embed is an iframe of `/embed/<widgetId>`, a Server Component under the
`(embed)` route group with its own minimal root layout. The browser sends the
embedding page as the `Referer`; `widgets.getPublic` compares its host with the
allowed domains (ignoring `www.` and paths) and returns only approved
testimonials. A widget with no allowed domains shows a setup hint instead.

## Code layout

```
convex/                 Backend functions, schema, auth setup
  lib/access.ts         Auth and membership checks
  lib/slug.ts, hosts.ts Pure helpers, also imported by the client
  *.test.ts             Function tests (see tooling.md)
src/
  app/(main)/           App root layout
    (private)/          Dashboard, behind sign-in
    (public)/           Sign-in and the collection page
  app/(embed)/          Root layout and page of the embeddable widget
  app/auth/             Convex Auth sign-in, refresh, and sign-out handlers
  components/           App components; components/ui is vendored shadcn
  hooks/, lib/          Client hooks and setup
  proxy.ts              Sign-in redirects and token refresh
scripts/                CI helpers
```

Rules worth knowing:

- Logic that both Convex and the client need (slugs, hostnames) lives in pure
  modules under `convex/lib/` with no server imports, so the client can import
  it without pulling in backend code.
- `src/env.ts` is the only place that reads `process.env`.
- `src/components/ui/` is managed by `shadcn add`; do not edit it by hand.
