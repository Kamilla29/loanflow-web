# LoanFlow test strategy

LoanFlow uses a small testing pyramid aimed at the risks of a form-heavy fintech-style frontend.

## 1. Static quality gate

TypeScript checks the application and library boundaries before runtime tests execute. A production Vite build is also required in CI so import, bundling and route-level integration errors fail the pipeline.

## 2. Domain unit tests

Vitest covers logic that should stay independent from the browser:

- amortized loan calculations;
- application schema acceptance and rejection;
- affordability validation rules.

## 3. End-to-end journeys

Cypress runs against the production preview build and covers:

- calculator → application parameter handoff;
- the complete four-step happy path;
- invalid personal data and accessible error state;
- asynchronous submission failure and draft preservation.

The mock application service exposes a deterministic `simulate=error` query mode so failure handling can be verified without flaky network behavior.

## 4. Accessibility checks in scope

The current implementation explicitly verifies or implements:

- label/control association;
- `aria-invalid` and `aria-describedby` on invalid fields;
- alert semantics for validation and submission errors;
- `aria-current="step"` in progress navigation;
- keyboard-visible skip link;
- focus movement when a multi-step form changes step;
- reduced-motion handling.

A future iteration can add automated axe-core scanning as a second layer, not as a replacement for semantic assertions and manual keyboard review.

## CI gate

Every push and pull request runs:

`typecheck → unit tests → production build → Cypress E2E`

A change should not be merged while this gate is red.
