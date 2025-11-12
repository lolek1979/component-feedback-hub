Related UserStory: https://dev.azure.com/vzp/NIS/_workitems/edit/74869

---

# How-to: Migrating the Current Frontend Repository to a Unified Monorepo (Frontend + Backend Services)

This document describes the recommended procedure, structure, and rules for moving an existing Next.js/React frontend application into a new monorepo repository, shared also for backend services (C# / .NET, Java, Python) using Nx and Azure DevOps (Azure Repos + Azure Pipelines).

1. Create a clear 3‑layer frontend architecture: "core" → "design system" → "domains".
2. Enable scalable addition of domain modules without unwanted cross-module dependencies.
3. Set up tooling (build, tests, lint, storybook, types, CI/CD) so that only necessary parts are run (incremental / affected).
4. Ensure consistent code sharing between frontend and backend where it makes sense (e.g., API schemas, contracts, generated clients).
5. Provide a step-by-step migration strategy minimizing risk (phases, checkpoints).

---

## 1. Target Directory Structure (Proposal)

Monorepo root:

```
repo-root/
  apps/
    frontend/                # Next.js App (app router)
    audit-log-api/           # (example) backend service (C# / Java / Python) - optional
    ...
  packages/
    core/                    # "core": runtime config, shared hooks, utils, i18n infra, auth, API clients
    design-system/           # "design system": components, tokens, theme, Storybook integration
    domains/
      audit-log/
      code-table-admin/
      e-orders/
      limits-copayments/
      settings/
      pdf-comparison/
      administrative-proceedings/
  libs/
  tools/
  azure-pipelines/           # YAML templates for Azure Pipelines (optional)
  nx.json
  package.json
  tsconfig.base.json
  how-to-monorepo.md
```

Notes:

- `packages/core` and `packages/design-system` are the only allowed entry points for sharing between domains.
- Domain modules do not export internal implementations outside their package.
- Backend services may reside under `apps/` or in separate folders per company conventions.

---

## 2. Frontend Layers – Definition and Contents

### 2.1 Core (packages/core)

Contents:

- Infrastructure (environment config, SSR helpers, error boundary, logging adapters)
- Shared hooks (authentication, feature flags, response caching)
- API clients (generated from OpenAPI/GraphQL) – ideally from shared contracts
- Internationalization (i18n provider, translation utilities)
- Routing helpers (path constants, URL generators) – domain parts only in domains
- Form handling baseline (basic wrappers, validation schema base)
- Types that are truly cross‑domain (User, Session, FeatureFlag...)

Excluded:

- Specific UI components from the Design System (these belong in design-system)
- Domain-specific data structures (e.g., AuditLogEntry)

### 2.2 Design System (packages/design-system)

Contents:

- Atomic / basic components (Button, Input, Table, Modal, Tooltip, Avatar...) – highly reusable
- Theming (tokens: colors, spacing, typography, z-index, breakpoints)
- Composite components that are still generic (DataTable, Pagination, Breadcrumbs) – must not include business logic
- Storybook + MDX documentation (Chromatic / local screenshots optional)
- Export a main entry `index.ts` + side-entries as needed (e.g., `design-system/theme`)

Excluded:

- Domain-specific variants (e.g., AuditLogTable) – these remain in the domain.

### 2.3 Domains (packages/domains/\*)

Contents of each module:

- `components/` – domain UI (can compose DS components and core utilities)
- `features/` (optional) – bundles logic + UI for specific user flow
- `hooks/` – domain hooks (e.g., useAuditLogFilters)
- `services/` – domain API calls (can use generated client from core)
- `types/` – only types for that domain
- `index.ts` – NOT mandatory to export everything; consider boundaries—if cross-domain re-export isn't needed, keep private

Rules:

- Domains must not import other domains.
- Domain may only import `core` and `design-system`.
- Domains may not define global styles – only module/scoped styles.

---

## 3. Enforcement of Boundaries

### 3.1 TypeScript Path Mapping

Define aliases in `tsconfig.base.json`:

```
"paths": {
  "@core/*": ["packages/core/src/*"],
  "@design-system/*": ["packages/design-system/src/*"],
  "@domain-audit-log/*": ["packages/domains/audit-log/src/*"],
  ...
}
```

Domains will not map externally (other domains)—preventing convenient import.

### 3.2 ESLint Rules

- Nx `enforce-module-boundaries` with config:
  - Tags: `core`, `design-system`, `domain`.
  - Allowed: `domain → (design-system|core)`, `design-system → core`, `core → (nothing higher)`.
- Ban relative parent imports going outside the package root (`no-relative-parent-imports`).

### 3.3 Build Graph

- Nx dependency graph—control for unauthorized edges (part of CI).

### 3.4 Runtime Guard (optional)

Dev check (babel plugin / runtime assert) warning upon attempted domain-to-domain import.

---

## 4. Storybook Integration

Location: `packages/design-system/.storybook/`

- Storybook runs only on the design system package (faster start, clean boundaries).
- Domain scenarios outside DS are not stored in the DS package.
- Visual tests optional (Chromatic / Playwright screenshots)—run only on DS changes.

---

## 5. Generated Clients / Shared Contracts (frontend ↔ backend)

### 5.1 Contract Location

- `libs/contracts` (OpenAPI / AsyncAPI / JSON Schema)
- Generated TS types + fetch/axios client: output to `packages/core/src/api/clients`.
- Generation script: `tools/generate-clients.ts` (`npm run generate:clients` or `nx run contracts:generate`).

### 5.2 Backend

- Each service uses the same source contracts—minimizing drift.

---

## 6. Build and Deployment

### 6.1 Frontend

- `nx build frontend` – uses output of dependent packages.
- Note: In the current (pre-monorepo) state, build runs with `npm run build` (calls `next build`). After migrating to Nx monorepo, a target `build` will be defined for the `frontend` app and `nx build frontend` will internally run the same logic (Next.js build + possible extra steps). Locally, after migration, you can still run `npm run build` in the app directory, but the standardized CI command will be `nx build frontend` due to dependency graph and cache.
- Incremental caching (Nx Cloud / remote cache).

### 6.2 Backend

- Each service: own Dockerfile + CI matrix (affected-only build).
- Shared base image definitions in `resources/docker/` (optional).

### 6.3 Artifacts & Versioning

- Changesets (independent versions) or unified version (simplification).
- DS can be published to internal registry upon tagging.

---

## 7. Dependency Management... - Use **npm workspaces** (npm 7+) – definition in `package.json` (`workspaces` field).

- Root `package.json`: only build/test/dev tools and workspace declaration.
- Each package: own `package.json` (`name`, `version`, `private`, `exports`).
- React as a peer dependency in design-system.
- Lockfile: `package-lock.json` committed (deterministic builds).

Example (root `package.json` excerpt):

```
{
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*",
    "packages/domains/*",
    "libs/*"
  ]
}
```

---

## 8. Environment Variables

- Root: `.env.example` (common keys).
- Frontend: `.env.local`, `.env.production` (Next.js convention).
- No secrets in packages – runtime injection (K8s, Vault, etc.).
- `core/config.ts` validates variables (Zod/Yup).

---

## 9. Code Ownership & Review Flow

Azure DevOps equivalent to CODEOWNERS:

- Branch Policies + Path Filters: to protect main branches (e.g., `main`, `release/*`).
- Minimum number of reviewers per path (e.g., pattern `packages/design-system/*`).
- Mandatory: build validation pipeline (affected lint + test) before merge.
- Auto-labels can be simulated using tags/custom pipeline task (optional).

Recommendations:

- Maintain owners table in README or `OWNERS.md` at root.
- For breaking change exports → require approval by core/design-system maintainer.

---

## 10. Lint, Format, Typecheck, Tests

- Scripts:
  - `lint`: `nx affected -t lint`
  - `typecheck`: `nx affected -t typecheck`
  - `test`: `nx affected -t test`
  - `format:check` / `format:write` (Prettier)
- Simple unit tests in Jest (components, hooks, utils). E2E/visual tests optional.
- Internal ESLint plugin (`eslint-plugin-internal`) optional.

Azure Pipelines (example stage excerpt):

```
- stage: CI
  jobs:
    - job: affected
      pool: { vmImage: 'ubuntu-latest' }
      steps:
        - task: NodeTool@0
          inputs: { versionSpec: '20.x' }
        - script: npm ci
        - script: npx nx affected -t lint typecheck test --parallel --max-parallel=3
        - script: npx nx affected -t build --parallel --configuration=production
```

---

## 11. Security & Quality Controls

- Dependency updates: Renovate bot (self-hosted / SaaS) for Azure Repos.
- SAST: Microsoft Security DevOps task (or CodeQL in separate GitHub mirror if necessary).
- Dependency/License scanning: `npm audit` + 3rd party (OWASP Dependency Check) in pipeline.
- Secret scanning: Gitleaks task (optional) in pipeline.

---

## 12. Migration – Phased Plan

### Phase 0: Preparation

- Initialize empty Nx PoC repository (Azure Repos).
- Write mapping of old folders → new layers.

### Phase 1: Skeleton

- Add `package.json`, `tsconfig.base.json`, `nx.json`.
- Create empty `packages/core`, `packages/design-system`.
- Move ESLint/Prettier configs to root.

### Phase 2: Move Frontend

- Copy existing Next.js app to `apps/frontend`.
- Temporary import aliases (`@core`, `@design-system`).

### Phase 3: Core Extraction

- Move shared hooks, utils, config, API clients to `core`.
- Update imports.
- Set `exports` in `core/package.json`.

### Phase 4: Design System Extraction

- Move basic components, theming, tokens.
- Initialize Storybook.
- MDX/Stories documentation.

### Phase 5: Domains

- Create `packages/domains/<english-name>`.
- Move domain logic + UI.
- Decide what to promote (core/design-system) in case of conflicts.

### Phase 6: Boundary Enforcement

- Enable strict ESLint rules.
- Fix violations.

### Phase 7: CI/CD

- Azure Pipeline: affected build/test.
- Remote cache (Nx Cloud) + local fallback.
- Branch policies (review + build validation).

### Phase 8: Contracts & Generated Clients (if relevant)

- Add `libs/contracts` and generator.
- Refactor API layer in core to generated clients.

### Phase 9: Stabilization

- Regression unit tests + smoke build.
- Check bundle size.

### Phase 10: Archiving

- Announce freeze of old repository.
- Update references (pipeline badge, documentation).

---

## 13. Naming and Domain Mapping (Proposal)

| Original Name              | Directory Name             | Note                                    |
| -------------------------- | -------------------------- | --------------------------------------- |
| audit-log                  | audit-log                  | Already in English                      |
| centralni-sprava-ciselniku | code-table-admin           | Or "catalog-admin" per terminology      |
| e-zadanky                  | e-orders                   | Exact domain to be clarified            |
| limity-a-doplatky          | limits-copayments          |                                         |
| nastaveni                  | settings                   |                                         |
| porovnani-pdf              | pdf-comparison             |                                         |
| spravni-rizeni             | administrative-proceedings | May be shortened to `admin-proceedings` |

Approval of names with domain owners / product team.

---

## 14. Criteria for Migration Completion (Definition of Done)

- [ ] All shared components are in `design-system`.
- [ ] Shared utilities/hooks outside UI are in `core`.
- [ ] No domain imports another domain (lint pass).
- [ ] Storybook covers key DS components.
- [ ] Unit tests (Jest) pass (all affected green).
- [ ] CI affected build/test < X minutes.
- [ ] Contract generation (if used) is deterministic + documented.
- [ ] This document updated.

---

## 15. Potential Future Extensions

Azure DevOps-specific extensions:

- Multi-stage pipeline (Build → Quality Gates → Deploy Preview → Promote).
- Automatic changelog generation (git tag + script) and publishing as a Pipeline artifact.
- Task for bundle size check (compared to baseline JSON artifact).

---

## 16. Quick Checklists

### A. New Domain Module

1. `npx nx g @workspace/domain my-new-domain`
2. `components/`, `hooks/`, `services/` folders
3. Unit tests + README
4. Clean boundary lint

### B. New Shared Component

1. Assess generality → design-system?
2. Implement in `design-system/src/components/<Component>`
3. Story + test + export
4. Build Storybook (quick visual check)

### C. Contract Update

1. Modify `libs/contracts/*`
2. `npm run generate:clients`
3. Commit generated clients
4. Run affected tests

---

## 17. Minimizing Migration Risks

| Risk                                    | Mitigation                                       |
| --------------------------------------- | ------------------------------------------------ |
| Cyclic dependencies                     | ESLint boundary rules + Nx graph review          |
| Domain logic leaking into design-system | Code review + Do not export guidelines           |
| Breaking prod build during extraction   | Gradual moves + alias fallback                   |
| Bundle size growth                      | `next build` report + dynamic imports in domains |
| API contract drift                      | Automatic generation in CI                       |

---

## 18. Communication Plan

- Each phase: brief report (scope, risks, next step).
- Progress board (Notion/Jira): Backlog / In progress / Review / Done.
- Release freeze announced at least 3 days before cutover.

---

## 19. Summary... Architecture (core → design-system → domains) with Nx + Azure DevOps provides:

- Predictable boundaries and clean dependencies.
- Fast incremental builds & tests (affected) in Azure Pipelines.
- Better DX (scaffolding, aliases, DS isolation in Storybook).
- Shared types and generated clients across frontend and backends.
