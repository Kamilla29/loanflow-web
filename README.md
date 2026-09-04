# LoanFlow

**LoanFlow** is a fictional consumer-loan application built as a production-style **React 18 + TypeScript** portfolio project.

It demonstrates a realistic frontend journey with reusable UI architecture, typed domain rules, multi-step forms, persisted drafts, asynchronous data boundaries, failure recovery, accessibility-minded interaction design and automated testing.

> Portfolio project only. LoanFlow is not affiliated with, copied from, or connected to any real bank.

## What the project demonstrates

- React 18 application architecture in an Nx workspace;
- reusable shared UI primitives and a dedicated component showcase;
- loan calculation and affordability logic isolated from presentation;
- React Hook Form + Zod multi-step validation;
- persisted draft state with Zustand;
- TanStack Query for asynchronous status recovery;
- deterministic success, slow and failure scenarios at the data-access boundary;
- loading, validation, submission error and retry-safe UX states;
- keyboard/focus semantics, reduced-motion support and accessible form messaging;
- Vitest unit tests and Cypress end-to-end journeys;
- GitHub Actions quality gate for typecheck, tests, production build and E2E.

## Stack

**Frontend:** React 18 · TypeScript · React Router  
**Architecture:** Nx · shared UI/domain/state/data-access libraries  
**Forms & state:** React Hook Form · Zod · Zustand  
**Async data:** TanStack Query · mock REST-style service boundary  
**Quality:** Vitest · Cypress · TypeScript · GitHub Actions  
**Tooling:** Vite · Node.js

## Architecture

```text
apps/loanflow/                 # routes and product features
libs/ui/                       # reusable presentation primitives
libs/domain/                   # calculation, affordability and validation
libs/application-state/        # persistent application draft
libs/api/                      # asynchronous data-access boundary
e2e/                           # Cypress product journeys
docs/                          # architecture, accessibility and test strategy
```

The boundary is intentional: routes orchestrate the product experience while reusable UI, business rules, state and data access stay independently inspectable and testable.

## Product flow

`Calculator → Loan configuration → Personal data → Income & expenses → Review → Submit → Application status`

The `/components` route exposes the shared UI primitives in a compact reviewable catalogue.

## Quality coverage

Unit tests cover financial calculation, affordability rules, application schema validation and the asynchronous application service boundary.

Cypress covers:

- calculator → complete application → status happy path;
- invalid-field blocking and focus behavior;
- recoverable submission failure with persisted draft data;
- shared component showcase availability.

See [`docs/test-strategy.md`](docs/test-strategy.md) and [`docs/accessibility.md`](docs/accessibility.md) for the testing and accessibility approach.

## Run locally

```bash
npm ci
npm run dev
```

Development server: `http://127.0.0.1:4200`

## Quality commands

```bash
npm run typecheck
npm run test
npm run build
npm run e2e
npm run ci
```

## Deployment

A Vercel SPA configuration is included in `vercel.json`. The production build output is `dist/apps/loanflow`.

---

**Kamilla Kuanysheva**  
React Developer · TypeScript · QA Automation
