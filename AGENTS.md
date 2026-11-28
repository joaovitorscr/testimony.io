# Testimony.io

A open-source platform for collecting user testimonies.

## Note from Testimony.io contributors

Ambitious ideas, simple system and software that feels obvious are the core of how we wanna build this service. Do not preserve complexity jsut because it already exists or introduce machinery because it looks architecturally impressive. Understand the real constraint, then fight for the smallest model that makes the correct behavior unsurprising.

Channel both "measure twice, cut once" and "yagni". Fight scope creep. Try to honor the dev's intent in both a minimal and realistic fashion.

The rest of this document is meant to help you navigate the codebase and make changes effectively. Think of these instructions less as "hard rules", more as "good defaults". The developer's preferences should be able to override anything here.

## Ways to hurt yourself

1. Killing by pattern. Never pkill -f, pgrep | kill, or kill a PID you found by matching a name, path, or worktree string. Your own agent process has this worktree's path in its argv, and this machine runs several other dev servers at once.

## Development Servers

Run development commands from the repository root so it can leverage vite plus

- `pnpm dev` runs all the development servers (Convex and Next.js)
- pnpm is the package manager. Bun runs only in CI, for `bun check`.

## Docs

- `docs/internals/architecture.md`: data model, access control, flows, code layout
- `docs/internals/tooling.md`: lint policy, type checking, tests, CI
- `docs/internals/deployment.md`: Vercel, Convex, env vars, OAuth

## Verifying

- Use the smallest proof that the change works. Do not run every check in both layers unless I ask; CI owns the full suite.
- After making changes, run `pnpm run lint` and fix all errors.
- Other checks: `pnpm typecheck`, `pnpm test`, `pnpm format:check`.
- Every oxlint category is on. Turn a rule off only for a contradiction, a framework requirement, or AGENTS.md, with the reason next to it in `.oxlintrc.json`.

## Pull Requests

- Never make a PR unless the developer explicitly asks you to do so.
- Conventional commit titles, plain language: fix(web): new threads no longer spike CPU.
- Body: the problem in a sentence or two, then how you fixed it. End with the model and harness that did the work.
- UI changes need before/after images. Motion or timing needs a short video.
- Capture PR images and videos from a production build (`pnpm build && pnpm start`), not `pnpm dev`, so no dev overlays show up: the Next.js indicator and error toasts, Convex or TanStack devtools, or anything similar. Retake any capture that has one.
- Upload PR evidence to GitHub. Never commit PR-only screenshots or assets such as .github/pr-assets/, and never push branches just to host them.
- Use `--attach` on `gh pr create`, `gh pr edit`, or `gh pr comment`. Repeat it per file and add alt text after `#`: `gh pr edit 49 --attach './before.png#Go card before' --attach ./after.png`.
- To place images in the body, reference them by relative path (`![Before](./before.png)`) and pass the same files with `--attach`. gh uploads them and rewrites the references to `github.com/user-attachments` URLs. Without a body reference, the attachment is appended to the end.
- Run gh from the directory the relative paths resolve against. Keep the files outside the worktree, for example in /tmp.
- One concern per PR. If the description says "also", split it.

## Plans and work artifacts

- Do not commit implementation plans, research notes, or agent scratch files. Keep temporary working material outside the worktree. .plans/ is gitignored only as a safety net for legacy tooling.
- Put durable architecture, constraints, and decisions in docs/internals/. Update those docs when the product changes so agents find current facts instead of abandoned intentions.
- A merged PR is the implementation record. Close or update its tracking item when the work lands; do not preserve a second checklist in the repository.

## Taste

- Complexity belongs at the adapter boundary. Orchestration stays pure, UI stays dumb.
- Inferred types over annotations. any is the enemy.
- Comments describe how a thing is used, and move when the code moves. To be used mostly to describe functions, not to annotate every line of behavior.
- Our users are most of the time developers and people that pay attentions to little details and will notice fps drops, lying spinner, stale labels. No continuously repainting animations; they peg the GPU on high-refresh displays.
- If a rule here fights the task in front of you, say so loudly and get a human sign-off before breaking it.
- All the components used should be from shadcn, from shadcn registry at components.json or a custom built component we approved you to create with base-ui.
- When working on the frontend (anything under src/ that renders UI), always read and follow DESIGN.md at the repo root. Its colors, typography, radii, and component rules are the source of truth; update DESIGN.md in the same change if the design intentionally changes.

## Additional Tips

- Don't verify with browsers or computer use unless the user explicitly agrees, requests it or is necessary to add screenshots to pr.
- Security is important, but should not be over-indexed on, especially for dev mode/maintainer-only features.
