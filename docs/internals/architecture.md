# Architecture

Testimony.io collects customer testimonials through one shareable link per
project, lets the team approve them, and shows the approved ones in an
embeddable widget or through a public JSON API.

## Stack

- **Next.js 16** (App Router, React Compiler, typed routes) renders the
  dashboard, the public collection page, and the embed.
- **Convex** is the backend: database, queries, mutations, and file storage.
  Every dashboard query is a live subscription, so the UI updates without
  refetching.
- **Convex Auth 2** signs users in with Google or GitHub. Development
  deployments can also turn on email + password (see
  [deployment.md](./deployment.md#local-development)). Sessions use the SSR
  setup: the refresh token lives in an `httpOnly` cookie set by the route
  handlers under `src/app/auth/`, and `src/proxy.ts` refreshes the access
  token before each page request.
- **Convex Rate Limiter** (`@convex-dev/rate-limiter`, registered in
  `convex/convex.config.ts`) throttles the public collection form.
- **Vercel** hosts Next.js and its CDN caches the embed and the public API;
  **Convex Cloud** hosts the backend. See [deployment.md](./deployment.md).

## Data model

Defined in `convex/schema.ts`.

| Table          | Purpose                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| `users`        | Profile from the OAuth provider and the user's active project.                                            |
| `projects`     | A product or site. `slug` is unique and fixed at creation; `isCollecting` and `prompt` drive `/c/<slug>`. |
| `members`      | Who can access a project, with a role (`owner` or `member`).                                              |
| `testimonials` | A submission: text, optional rating, customer details, avatar in file storage, and `status`.              |
| `widgets`      | One per project: display settings. Its id is the public key of the embed.                                 |

A testimonial's `status` is `pending` until a member reviews it, then
`approved` (shown by the widget) or `archived` (kept, shown nowhere). The
dashboard approves and archives; Undo moves it back to where it was. Only
archived testimonials can be deleted.

Creating a project also creates the owner membership and the widget, and makes
the project active for its creator. Renaming a project never changes its slug,
so shared links keep working.

## Access control

Every function that reads or changes project data calls `requireMember`
(`convex/lib/access.ts`) with the project id, and throws "Project not found"
for anyone outside the project. Functions that receive a document id (a
testimonial or a widget) load the document first and check membership on its
`projectId`. The client never decides access.

Public functions are limited to what anonymous visitors need:

- `collect.getForm`, `collect.generateAvatarUploadUrl`, and `collect.submit`,
  keyed by the project slug and refused while the project is paused.
- `widgets.getPublic`, which returns only approved testimonials and display
  settings. They are public by design, so any site may embed a widget or call
  the public API, with no key or domain list. The widget id identifies a
  widget; it is not a secret.

The embed and `/api/v1/` sit outside `src/proxy.ts`, so their responses never
carry cookies and the CDN can cache them.

## Dashboard

Three pages, in the order a new project uses them:

| Page         | Route           | What it does                                                              |
| ------------ | --------------- | ------------------------------------------------------------------------- |
| Testimonials | `/testimonials` | Review queue: Pending, Approved, Archived tabs. First run shows the link. |
| Collect      | `/collect`      | The collection link, the "accept new testimonials" switch, the question.  |
| Display      | `/display`      | Widget settings, live preview, the embed snippet, and the API example.    |

`/` redirects to `/testimonials`. Project rename lives in the sidebar's
Settings dialog. Widget settings are `layout` (grid or list), `order` (newest
or oldest), `theme` (light, dark, auto), `accentColor`, `showRating`, and
`showAvatar`; they save automatically and the preview shows them before they
save.

## Flows

### Collecting a testimonial

1. A member shares the project's link, `/c/<slug>`, from the Collect page (or
   the first-run state of the Testimonials page). It takes any number of
   submissions.
2. `src/app/(main)/(public)/c/[slug]/page.tsx` loads `collect.getForm`: the
   project name and the question to ask, or a "not found" or "paused" page.
3. An optional cropped avatar goes to Convex file storage through an upload
   URL from `collect.generateAvatarUploadUrl`.
4. `collect.submit` validates the fields (limits shared with the form in
   `convex/lib/collect.ts`) and stores the testimonial as pending. A hidden
   honeypot field drops naive bots, and the Convex rate limiter caps
   submissions and uploads per project; review before publishing is the real
   defence.

Known trade-offs, accepted for now:

- Convex sees no IP address, so the rate limit is per project. A determined
  bot can use it up and briefly block real customers; pausing collection and
  archiving the spam is the recovery.
- A photo uploaded by someone who then leaves the page stays in file storage
  unreferenced. Uploads are rate limited, which bounds this.

### Reviewing

The Testimonials page has a tab per status with counts. Pending comes first.
Every move shows a toast with Undo.

### Embedding the widget

The Display page edits the widget settings next to a live preview that uses
the same renderer as the embed (`src/components/widgets/`). Underneath is the
snippet: an iframe of `/embed/<widgetId>` and `public/embed.js`.

- `/embed/<widgetId>` is a Server Component under the `(embed)` route group
  with its own minimal root layout. It is statically cached per widget and
  revalidated in the background every 60 seconds, so a change reaches sites on
  a page load about a minute later. An open page doesn't update live.
- Inside the iframe, `embed-resize.tsx` posts the content height to the parent
  window on load and on every size change.
- `embed.js` resizes every widget iframe on the page from those messages,
  checking the sender's origin and window. Without the script the iframe keeps
  the height in its style attribute and scrolls.
- Styles are inline and scoped to `.tm-root`, with the theme (light, dark, or
  auto from `prefers-color-scheme`) and accent as CSS variables. The grid wraps
  cards to the available width.

### Public API (v1)

For developers who render testimonials with their own markup. Fetched on
their server, the quotes are part of their page's HTML, which an iframe can't
offer. The Display page shows the URL and a fetch example under the embed
snippet.

`GET /api/v1/widgets/<widgetId>` (`src/app/api/v1/widgets/[widgetId]/route.ts`)
reads `widgets.getPublic` uncached and maps it in `src/lib/public-api.ts`:

```json
{
  "testimonials": [
    {
      "id": "…",
      "text": "…",
      "name": "Ada Lovelace",
      "title": "Founder",
      "company": null,
      "rating": 5,
      "avatarUrl": null,
      "createdAt": "2026-01-02T00:00:00.000Z"
    }
  ]
}
```

- Approved testimonials only, at most 100, in the widget's order (newest or
  oldest first). No pagination or filters. An empty array means the widget has
  nothing approved yet.
- Optional fields are always present and `null` when blank. `avatarUrl` is an
  opaque Convex storage URL: it can change, and stops working once the
  testimonial is deleted, so don't copy it into another store.
- An unknown or malformed id is `404 {"error":{"code":"widget_not_found"}}`. A
  backend failure is `500 {"error":{"code":"internal_error"}}`, never cached.
- `Access-Control-Allow-Origin: *` on every response. It is a plain `GET`, so
  browsers send no preflight.
- Caching is only the CDN, from the response's `Cache-Control`: 200s are fresh
  for 60 seconds and then served stale for up to 60 more while one request
  refreshes them, so a change shows within about two minutes. 404s are cached
  for 60 seconds; a widget exists from the moment its project does.
- The contract is `v1`: fields may be added, but never renamed, removed, or
  given a new meaning. The mapping is the only place that knows both shapes,
  and `src/lib/public-api.test.ts` pins it.
- Out of scope until someone needs it: keys, pagination, an SDK or React
  package, writes. A secret key becomes worth it only for non-public data,
  such as reading pending testimonials or submitting from your own form.

## Decisions

Choices made on purpose, with the reason, so they aren't undone by accident.
Revisit one only with a concrete user need.

- **One reusable link, no single-use invitations.** One link per customer made
  owners create and track a link for every person, and nothing could be
  shared in an email footer or an app. Review before publishing makes an open
  link safe. Per-recipient tracking would need a real use case first.
- **The slug never changes.** It is the collection link, so a rename that
  changed it would break every link already sent.
- **`status` instead of `isApproved` and `isFeatured`.** Two booleans couldn't
  tell "not reviewed" from "decided against", and Featured changed nothing on
  the page. Curated subsets (featured, per-page selections) wait for demand.
- **No domain allow-list, no publishable key.** Approved testimonials are
  public by design. Referer and Origin checks only bind browsers, broke
  localhost, previews, and `no-referrer` sites, and made a new widget show
  nothing until configured. The widget id identifies a widget and is not a
  secret. Load is the CDN's job.
- **An iframe first, the API second.** The iframe needs no code and isolates
  styles; `embed.js` fixes its sizing. The API serves developers who want the
  quotes in their own HTML, for SEO and their own design. A web component or
  an npm package would be a second renderer to maintain.
- **Cached, not live, on customer sites.** The embed and the API refresh about
  every minute instead of holding a live subscription on every visitor's
  page. The dashboard stays live.
- **No email, notifications, imports, analytics, or multiple widgets yet.**
  Each is a feature to add when someone asks, not before.

## Code layout

```
convex/                 Backend functions, schema, auth setup
  lib/access.ts         Auth and membership checks
  lib/slug.ts, collect.ts Pure helpers, also imported by the client
  *.test.ts             Function tests (see tooling.md)
src/
  app/(main)/           App root layout
    (private)/          Dashboard, behind sign-in
    (public)/           Sign-in and the collection page
  app/(embed)/          Root layout and page of the embeddable widget
  app/api/v1/           Public read API (lib/public-api.ts holds its contract)
  app/auth/             Convex Auth sign-in, refresh, and sign-out handlers
  components/           App components; components/ui is vendored shadcn
  hooks/, lib/          Client hooks and setup
  proxy.ts              Sign-in redirects and token refresh
public/embed.js         Resizes widget iframes on the embedding site
scripts/                CI helpers
```

Rules worth knowing:

- Logic that both Convex and the client need (slugs, form limits) lives in pure
  modules under `convex/lib/` with no server imports, so the client can import
  it without pulling in backend code.
- `src/env.ts` is the only place that reads `process.env`.
- `src/components/ui/` is managed by `shadcn add`; do not edit it by hand.
- `DESIGN.md` is the visual spec. Its tokens live in `src/styles/globals.css`
  (shadcn variables plus `fg-2`, `fg-faint`, the footage colours and the
  `type-*` utilities). Colour appears only inside `MediaFrame`
  (`src/components/media-frame.tsx`); the rest of the UI stays greyscale.
  Dashboard pages open with `PageHeading`.
