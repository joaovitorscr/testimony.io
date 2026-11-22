# Tooling and CI

| Task       | Local                                       | CI                                    |
| ---------- | ------------------------------------------- | ------------------------------------- |
| Install    | `pnpm install`                              | `pnpm install --frozen-lockfile`      |
| Lint       | `pnpm lint` (`pnpm lint:fix` applies fixes) | `oxlint --format github`              |
| Format     | `pnpm format` / `pnpm format:check`         | `oxfmt --check`                       |
| Type check | `pnpm typecheck` (`tsc`)                    | `bun check` and `bun check -p convex` |
| Test       | `pnpm test` (`pnpm test:watch`)             | Sharded `vitest run`                  |
| Build      | `pnpm build`                                | `pnpm build`                          |

pnpm is the package manager. Bun runs only in CI, for `bun check`. Don't add a
package script named `check`: `bun check` would run it instead of the type
checker.

## Linting (oxlint)

`.oxlintrc.json` turns on every category (`correctness`, `suspicious`,
`pedantic`, `perf`, `style`, `restriction`, `nursery`) as errors, for every
plugin that applies: TypeScript (type-aware), unicorn, oxc, import, React,
React perf, Next.js, jsx-a11y, promise, node, JSDoc, and Vitest for test files.

A rule is only turned off for one of these reasons, each noted next to it in
the config:

- **Contradictions.** Some rules demand opposite things, such as
  `import/no-default-export` and `import/prefer-default-export`, or
  `promise-function-async` and `require-await`. We keep one side.
- **Framework requirements.** Next.js pages and configs need default exports,
  the automatic JSX runtime makes `react-in-jsx-scope` obsolete, the React
  Compiler memoizes props, and the `oxc/no-*` syntax bans target old runtimes.
- **AGENTS.md.** Inferred types over annotations, so explicit return types and
  readonly parameter types are off.
- **No real constraint.** `sort-keys`, `no-magic-numbers`, and
  `react/jsx-max-depth` would only churn code.

Rules that only needed tuning keep running with options instead, for example
the complexity budgets (`max-lines-per-function` 150, `max-statements` 20,
`max-lines` 300). Fix the code before you reach for a disable comment; if a
rule really contradicts the task, change the config with a reason.

`src/components/ui/.oxlintrc.json` exempts vendored shadcn files from a few
upstream design choices so they can be updated with `shadcn add`.

## Formatting (oxfmt)

`.oxfmtrc.json` sorts imports and Tailwind classes (including inside `cn()` and
`cva()`). Oxlint's `sort-imports` is off so the two never disagree.

## Type checking

`bun check` is Bun's TypeScript checker, which follows TypeScript 7. Locally,
`pnpm typecheck` uses the installed `tsc`. To reproduce CI exactly without Bun,
run TypeScript 7 through pnpm:

```bash
pnpm dlx --package=typescript@7 tsc --noEmit
pnpm dlx --package=typescript@7 tsc -p convex --noEmit
```

TypeScript 7 checks side-effect imports, which is why `src/types/css.d.ts`
declares `*.css`. CI runs `next typegen` first so typed routes resolve.
`next build` skips type checking because CI checks types in its own job.

## Tests (Vitest + convex-test)

Tests live next to the code as `*.test.ts`. Convex functions run against an
in-memory backend from `convex-test`; `convex/test.setup.ts` provides:

- `setupBackend()`: a fresh backend with the Convex Auth and rate limiter
  components registered.
- `signInAs(backend)`: creates a user with a real session and returns a client
  acting as them (`as.query`, `as.mutation`), so tests go through the same
  `getAuthUserId` and membership checks as production.
- `acmeProject(backend)` (a project at `/c/acme`), `review` (a valid
  submission to it), and `only(items)` for common setup.

Prefer testing behavior through public functions: what a member, a stranger,
and an anonymous visitor can and cannot do.

## CI pipeline

`.github/workflows/ci.yml` runs on pull requests and on pushes to `main`.

- `lint`, `typecheck`, `build`, and `test-plan` start at the same time.
- `test-plan` runs `scripts/test-shards.ts plan`. On a pull request it lists
  only the test files the diff can reach (`vitest list --changed
  origin/<base>`; changes to `package.json` or the Vitest config rerun
  everything). It then packs the files into up to four shards with the
  longest-first heuristic, using each file's recorded duration.
- `test` runs one job per shard, as soon as the plan is ready. A pull request
  that reaches no tests skips it.
- On `main`, `record-test-timings` merges the shards' JSON reports into
  `.test-timings.json` and saves it to the Actions cache. Every later plan
  restores the newest copy; files without a recorded time count as the median.
- `ci` passes when every job succeeded or was skipped. Make it the single
  required status check, because shard job names change with each plan.
