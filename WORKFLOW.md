---
# NightOwl per-repo configuration for DyslexiAid.
# Picked up automatically by the NightOwl board watcher when it works on a
# ticket targeting this repo. Full schema:
# https://github.com/ishangtxl/NightOwl/blob/main/docs/workflow-md.md

tracker:
  kind: linear
  team: ISH
  active_states: [Todo, "In Progress", Backlog]
  terminal_states: [Done, Cancelled, Duplicate]
  eligibility:
    require_labels: [nightowl]
    require_assignee: null

polling:
  interval_seconds: 30
  max_concurrent_runs: 2

agent:
  model: claude-opus-4-5
  hard_timeout_minutes: 15
  role: solo

repo:
  default_branch: main

  # Install both workspaces. The root package.json defines `install-all`.
  install: |
    npm run install-all

  # No automated test suite yet. CRA's `react-scripts test` is interactive by
  # default and would hang. NightOwl will skip the test gate until tests are
  # added — at which point set this to `cd frontend && npm test -- --watchAll=false`.
  # test: ""

  # No lint config yet. Add one (eslint or biome) and wire here later.
  # lint: ""

  # Verify the frontend still builds. This matches what Vercel runs at deploy.
  build: |
    cd frontend && CI=false npm run build

deploy:
  provider: vercel
  preview_on_pr: true
  prod_requires_approval: true

hooks:
  before_run: |
    node --version
    npm --version

pr:
  draft_on_test_failure: true
  closes_keyword: true
  reviewers: [ishangtxl]
---

# NightOwl prompt for DyslexiAid

You are NightOwl working autonomously on a ticket for the DyslexiAid project — an AI-assisted reading and learning tool for dyslexic children.

## Project shape

- **`frontend/`** — React 18 app (Create React App, JavaScript, not TypeScript). Uses `styled-components`, `react-router-dom`, `axios`, and `tesseract.js`. Main app code in `frontend/src/`.
- **`backend/`** — Express server (Node, JavaScript). Routes in `backend/routes/`. Uses `@google/generative-ai` (Gemini) and ElevenLabs for voice. Server entry at `backend/server.js`.
- **`vercel.json`** at the repo root routes `/api/*` to the backend serverless function and everything else to the frontend static build.

## Conventions

- JavaScript (not TypeScript). Match the existing style — function components, hooks, no class components.
- Frontend → backend calls go through `axios` to `/api/*` routes. Don't hardcode hostnames; let the Vercel rewrite handle routing.
- Backend routes live in `backend/routes/`. Add new routes there; mount them in `backend/server.js`.
- Don't cross-import frontend code from backend or vice versa.

## Boundaries

- Don't touch `vercel.json` unless the ticket explicitly asks — deployment is a separate concern.
- Don't add API keys or secrets to any committed file. Use environment variables; document them in the deployment doc with placeholder values only.
- Don't run `npm audit fix --force` or bump major versions of `react-scripts` or `react` as a side effect of feature work.
- Don't introduce TypeScript or a new build system.

## Defaults when in doubt

- Lean small. A draft PR with a follow-up comment is better than a sprawling diff.
- For UI work, place new components under `frontend/src/components/` matching the existing folder pattern.
- For new backend routes, add a smoke test of the endpoint shape in the PR description (curl example + expected response).
- If a ticket is ambiguous about scope, make the smallest plausible interpretation, document the assumption in the PR body, and open the PR as a draft.
