# Repository Guidelines

## Project Structure & Module Organization

- `app/`: Next.js (App Router) frontend UI (React + Tailwind). Key areas:
  - `app/components/`: UI components (upload, gallery, modals)
  - `app/utils/`: client utilities (API requests, concurrent upload, ZIP helpers)
- `worker/`: Cloudflare Worker backend (Hono) and infrastructure bindings:
  - `worker/src/handlers/`: HTTP route handlers (upload/images/tags/system)
  - `worker/src/services/`: D1/R2/KV/Images/Queue services
  - `worker/src/utils/`: shared helpers (validation/response)
- `docs/`: API and deployment docs
- `public/`: static assets

## Build, Test, and Development Commands

Frontend (repo root):
- `pnpm install`: install dependencies
- `pnpm dev`: run Next.js dev server
- `pnpm build` / `pnpm start`: production build and run
- `pnpm lint`: ESLint checks
- `pnpm exec tsc --noEmit`: TypeScript typecheck

Worker:
- `cd worker && pnpm install`
- `cd worker && pnpm dev`: local Worker via `wrangler dev`
- `cd worker && pnpm deploy`: deploy Worker
- `cd worker && pnpm tail`: stream logs
- `pnpm -C worker exec tsc --noEmit`: Worker typecheck

## Coding Style & Naming Conventions

- TypeScript throughout; prefer 2-space indentation and existing file patterns.
- React components: `PascalCase.tsx`; hooks: `useSomething.ts`.
- Worker routes live in `worker/src/handlers/*` and are wired in `worker/src/index.ts`.
- Keep changes scoped: avoid refactors unrelated to the task.

## Testing Guidelines

There is no dedicated test runner yet. Validate changes with:
- `pnpm exec tsc --noEmit` (and `pnpm -C worker exec tsc --noEmit`)
- `pnpm lint`
- Manual smoke tests: run `wrangler dev` and exercise endpoints (e.g. `POST /api/upload/single`, `DELETE /api/tags/:name`).

## Commit & Pull Request Guidelines

- Commits use short, imperative summaries (e.g., “Add ZIP upload functionality”, “Fix tag deletion”).
- PRs should include: problem statement, what changed, how to test locally, and screenshots for UI changes.
- If you change D1 schema, include the migration steps/commands in the PR description.

## Security & Configuration Tips

- Do not commit secrets. Use `.env.example` and `worker/wrangler.example.toml` as templates.
- Frontend expects `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_REMOTE_PATTERNS`.
- Worker binds R2/D1/KV/Queues/Images via `worker/wrangler.toml`.


## Additional Agent Rules

### Package Management

* The project **must use pnpm exclusively** as the package manager for all frontend and Worker workflows.
* Do not introduce npm, yarn, or mixed lockfiles. Ensure `pnpm-lock.yaml` remains the single source of truth.

### Changelog Requirements

**Important: When making functional changes to the codebase, you MUST update the changelog files.**

Maintain both changelog files and keep them in sync:

* `CHANGELOG.md` — English
* `CHANGELOG_CN.md` — 中文

Follow the **Keep a Changelog** specification with the following sections:

* `Added` — New features
* `Changed` — Changes to existing functionality
* `Deprecated` — Features planned for removal
* `Removed` — Removed features
* `Fixed` — Bug fixes
* `Security` — Security-related fixes

Changelog updates are mandatory for any user-facing behavior change, API change, schema change, or performance-impacting modification.

### Backend Design Constraints (Cloudflare Workers)

* Any new backend feature **must comply with Cloudflare Workers best practices**, including:

  * Stateless request handling
  * Correct use of bindings (D1/R2/KV/Queues/Images)
  * Avoidance of long-running CPU tasks and blocking operations
  * Respect for Workers execution time and memory limits
* Prefer edge-native patterns (streaming, batching, queue offloading) where applicable.

### Performance Standards

* Code should be written and reviewed with **high performance as a first-class requirement**.
* Avoid unnecessary allocations, excessive JSON parsing/stringification, and redundant network or storage operations.
* Frontend changes should minimize bundle size, re-renders, and client-side blocking work.
* Backend changes should prioritize low latency, efficient I/O, and scalable concurrency.

