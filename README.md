# LoanFlow

**LoanFlow** is a fictional consumer-loan application built as a production-style React portfolio project.

It demonstrates a realistic fintech journey with reusable UI, typed domain logic, multi-step forms, schema validation, persistent draft state, API-style submission, recoverable error handling and automated quality gates.

> Portfolio project only. LoanFlow is not affiliated with or modeled as the UI of any real bank.

## Implemented product flow

`Calculator → Loan configuration → Personal data → Income & expenses → Review → Submit → Application status`

The current implementation includes:

- responsive landing page and editable loan calculator;
- amortized monthly-payment calculation in an isolated domain library;
- four-step application journey with step-level validation and focus management;
- React Hook Form + Zod validation with accessible field errors;
- Zustand draft persistence across browser reloads;
- TanStack Query mutation around an asynchronous mock application service;
- loading, success and deterministic service-error states;
- generated application reference and status route;
- shared UI, domain, state and data-access libraries inside an Nx workspace;
- Vitest unit coverage for calculations and application validation;
- Cypress coverage for the complete journey, negative validation and submission failure;
- GitHub Actions CI running typecheck, tests, production build and E2E.

## Stack

**Frontend:** React 18 · TypeScript · React Router  
**Forms & state:** React Hook Form · Zod · Zustand  
**Data:** TanStack Query · mock REST-style application service  
**Architecture:** Nx monorepo · shared UI/domain/state/data-access libraries  
**Quality:** Vitest · Cypress · TypeScript · GitHub Actions  
**Tooling:** Vite · Node.js

## Architecture

```text
apps/
└── loanflow/                 # routes and product features

libs/
├── ui/                       # reusable presentation components
├── domain/                   # calculation + validation rules
├── application-state/        # persisted application draft
└── api/                      # data-access boundary / mock service

e2e/                          # Cypress product journeys
docs/                         # engineering/testing notes
.github/workflows/            # CI quality gate
```

The boundary is intentional: product routes orchestrate the experience, while calculation rules, validation, UI primitives, state and data access stay independently inspectable and testable.

## Quality and accessibility

LoanFlow treats failure states and accessibility as product behavior rather than README-only claims. Invalid fields expose semantic error relationships, step changes move keyboard focus, a skip link is available, reduced-motion preferences are respected, and the application flow has a deterministic service-error mode used by Cypress.

See [`docs/test-strategy.md`](docs/test-strategy.md) for the current testing model.

## Run locally

```bash
npm install
npm run dev
```

The development server runs at `http://127.0.0.1:4200`.

## Quality commands

```bash
npm run typecheck
npm run test
npm run build
npm run e2e
npm run ci
```

## Next iterations

- add a component showcase / Storybook layer;
- add automated axe-core scans alongside manual semantic checks;
- replace the mock boundary with MSW-backed REST contract scenarios;
- connect selected visual tokens/components with Asteria;
- publish a live demo and add screenshots to this README.

---

**Kamilla Kuanysheva**  
React Developer · TypeScript · QA Automation
