# LoanFlow

**LoanFlow** is a fictional consumer-loan application built as a production-style React portfolio project.

It demonstrates a realistic fintech journey with reusable UI, typed domain logic, multi-step forms, schema validation, client-side application state, API-style submission and automated quality checks.

> Portfolio project only. LoanFlow is not affiliated with or modeled as the UI of any real bank.

## Current MVP

The current implementation includes:

- responsive landing page and loan calculator;
- amortized monthly-payment calculation with isolated domain logic;
- four-step application journey: loan → personal data → finances → review;
- React Hook Form + Zod validation;
- Zustand-backed draft state;
- TanStack Query mutation for an asynchronous mock submission;
- application status route with generated reference ID;
- shared UI components in an Nx library;
- Vitest unit coverage for financial calculation logic;
- Cypress smoke coverage for the calculator → application flow;
- GitHub Actions CI.

## Stack

**Frontend:** React 18 · TypeScript · React Router  
**Forms & state:** React Hook Form · Zod · Zustand  
**Data:** TanStack Query · mock REST-style application service  
**Architecture:** Nx monorepo · shared UI/domain/data-access libraries  
**Quality:** Vitest · Cypress · TypeScript · GitHub Actions  
**Tooling:** Vite · Node.js

## Architecture

```text
apps/
└── loanflow/                 # routes and product features

libs/
├── ui/                       # reusable presentation components
├── domain/                   # calculation + validation rules
├── application-state/        # application draft store
└── api/                      # data-access boundary / mock service

e2e/                          # Cypress journeys
.github/workflows/            # CI
```

The important boundary is intentional: product routes orchestrate the experience, while calculation rules, validation, UI primitives, state and data access stay independently inspectable.

## User flow

`Calculator → Loan configuration → Personal data → Income & expenses → Review → Submit → Application status`

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

## Portfolio roadmap

Next iterations will add richer loading/error states, accessibility checks, API contract tests, deeper Cypress coverage, a reusable component showcase and a stronger link to the Asteria design-token project.

---

**Kamilla Kuanysheva**  
React Developer · TypeScript · QA Automation
