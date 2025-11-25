# Copilot Instructions for dws-frontend

## Project Overview
- This is a Next.js frontend project using TypeScript, pnpm, and Node.js 20 (alpine) for containerization.
- The main app code is in the `app/` and `components/` directories. UI primitives are in `components/ui/`.
- The project uses modern React patterns (function components, hooks) and custom hooks in `hooks/`.

## Build & Run Workflows
- **Install dependencies:** `pnpm install --frozen-lockfile`
- **Build:** `pnpm build` (see Dockerfile for build steps)
- **Start (local):** `pnpm start` or `pnpm dev` (for development)
- **Docker:** Multi-stage build, final image runs as non-root user. Entrypoint is `server.js` (from Next.js standalone build).
- **Helm/Kubernetes:** Deployment manifests in `dws-frontend/templates/` and configuration in `dws-frontend/values.yaml`.

## Key Architectural Patterns
- **Component Structure:**
  - Page-level components in `app/`, shared UI in `components/`, atomic UI in `components/ui/`.
  - Custom hooks for cross-cutting concerns (e.g., `use-toast`, `use-mobile`).
- **Styling:**
  - Global styles in `app/globals.css` and `styles/globals.css`.
  - Uses PostCSS (`postcss.config.mjs`).
- **TypeScript:**
  - Strict typing enforced via `tsconfig.json`.
- **State & Data Flow:**
  - React context and hooks for state management; no Redux/MobX detected.
  - Data fetching patterns follow Next.js conventions (e.g., server/client components).

## Conventions & Patterns
- **File Naming:**
  - Components: PascalCase (`EventCard.tsx`), hooks: camelCase (`useToast.ts`).
  - UI primitives: lowercase with hyphens (`button-group.tsx`).
- **Imports:**
  - Prefer relative imports within feature folders.
- **Testing:**
  - No test files detected; add tests in `__tests__/` or alongside components if needed.
- **Environment Variables:**
  - Use `.env` for local, set via Docker/Helm for production.

## Integration Points
- **External:**
  - Next.js, pnpm, Node.js, PostCSS, Docker, Helm/Kubernetes.
- **Internal:**
  - Shared hooks and UI primitives for consistent UX.

## Example: Adding a New Page
1. Create a folder in `app/` (e.g., `app/newpage/`).
2. Add `page.tsx` for the route.
3. Import shared components from `components/` or `components/ui/`.
4. Add styles to `globals.css` if needed.

---
For questions about build, deployment, or architecture, see `Dockerfile`, `package.json`, and `dws-frontend/templates/`.
