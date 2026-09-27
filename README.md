# LoanFlow

[![CI](https://github.com/Kamilla29/loanflow-web/actions/workflows/ci.yml/badge.svg)](https://github.com/Kamilla29/loanflow-web/actions/workflows/ci.yml)

**LoanFlow** is a fictional consumer-loan application built as a production-style **React 18 + TypeScript** portfolio case focused on product frontend engineering, typed data boundaries, failure handling and testability.

> Portfolio project only. LoanFlow is not affiliated with, copied from, or connected to any real bank.

## Recruiter snapshot

- **Product frontend:** multi-step application flow, reusable components, domain rules and persistent state.
- **Application data:** REST-style services plus GraphQL/Apollo Client behind explicit data-access boundaries.
- **Engineering quality:** validation, loading/error/retry states, accessibility, unit tests, E2E tests and CI.
- **Architecture:** Nx workspace with UI, domain, state and API responsibilities separated into inspectable libraries.
- **Role relevance:** React / Frontend Developer, Junior Software Developer, application-oriented web roles.

## What the project demonstrates

- React 18 application architecture in an Nx workspace;
- reusable shared UI primitives and a dedicated component showcase;
- loan calculation and affordability logic isolated from presentation;
- React Hook Form + Zod multi-step validation;
- persisted draft state with Zustand;
- TanStack Query for REST-style application submission and status recovery;
- Apollo Client + GraphQL for variable-based loan-product matching and normalized caching;
- coexistence of two server-state strategies behind a shared data-access layer;
- deterministic success, slow and failure scenarios at the data-access boundary;
- loading, validation, submission error and retry-safe UX states;
- keyboard/focus semantics, reduced-motion support and accessible form messaging;
- Vitest unit tests and Cypress end-to-end journeys;
- GitHub Actions quality gate for typecheck, tests, production build and E2E.

## Stack

**Frontend:** React 18 · TypeScript · React Router  
**Architecture:** Nx · shared UI/domain/state/data-access libraries  
**Forms & state:** React Hook Form · Zod · Zustand  
**Data:** Apollo Client · GraphQL · TanStack Query · mock REST-style boundary  
**Quality:** Vitest · Cypress · TypeScript · GitHub Actions  
**Tooling:** Vite · Node.js

## Architecture

```text
apps/loanflow/                 # routes and product features
libs/ui/                       # reusable presentation primitives
libs/domain/                   # calculation, affordability and validation
libs/application-state/        # persistent application draft
libs/api/                      # REST-style services + Apollo GraphQL boundary
e2e/                           # Cypress product journeys
docs/                          # architecture, accessibility and test strategy
```

The boundary is intentional: routes orchestrate the product experience while reusable UI, business rules, state and data access stay independently inspectable and testable.

### GraphQL product catalogue

The calculator queries a typed `LoanProducts` GraphQL operation with `amount` and `months` variables. Apollo Client normalizes returned `LoanProduct` entities by id in `InMemoryCache` and the UI renders the best matching product without coupling the calculator to transport implementation.

The portfolio version uses a deterministic custom Apollo Link rather than a deployed GraphQL backend. The same feature can be switched to an HTTP GraphQL endpoint by replacing the transport link while keeping query documents and consuming components intact.

TanStack Query remains responsible for the existing application submission/status flow, making the distinction between REST-style and GraphQL server state explicit rather than replacing one technology purely for portfolio optics.

See [`docs/architecture.md`](docs/architecture.md) for the detailed data-flow rationale.

## Product flow

`Calculator + GraphQL product match → Loan configuration → Personal data → Income & expenses → Review → Submit → Application status`

The `/components` route exposes the shared UI primitives in a compact reviewable catalogue.

## Quality coverage

Unit tests cover financial calculation, affordability rules, application schema validation, the asynchronous application service boundary and Apollo GraphQL product matching/cache identity.

Cypress covers:

- calculator + GraphQL product match → complete application → status happy path;
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
npm run test:api
npm run build
npm run e2e
npm run ci
```

## Deployment

A Vercel SPA configuration is included in `vercel.json`. The production build output is `dist/apps/loanflow`.

## Related portfolio projects

- [`Studio Blocks`](https://github.com/Kamilla29/studio-blocks-wp) demonstrates WordPress/Gutenberg, PHP ↔ React integration and a custom REST endpoint.
- [`QA Automation Lab`](https://github.com/Kamilla29/qa-automation-lab) independently tests a pinned LoanFlow revision with Playwright, API contracts, accessibility checks and cross-browser regression.
- [`PocketFlow Mobile`](https://github.com/Kamilla29/pocketflow-mobile) extends the same fictional product family into a React Native mobile companion focused on repayment and application visibility.

---

**Kamilla Kuanysheva**  
Junior Software Developer · React · APIs · Testing