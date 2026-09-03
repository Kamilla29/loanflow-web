# Test strategy

LoanFlow uses a compact risk-based test pyramid focused on the behavior most likely to affect a loan application journey.

## Unit

Vitest covers:

- amortized loan calculation and zero-rate behavior;
- application schema validation;
- affordability classification;
- successful and failed application submission;
- direct-navigation status recovery at the asynchronous data-access boundary.

## End-to-end

Cypress covers:

1. calculator → application → status happy path;
2. step-level validation and focus behavior;
3. recoverable service failure with persisted draft state;
4. shared component showcase availability.

## Accessibility review

Keyboard navigation, visible focus, semantic headings, associated labels/help/error text, `aria-invalid`, `aria-current`, live status regions, skip navigation and reduced-motion behavior are part of the release checklist.

## CI gate

Every pull request and push to `main` runs the same quality path:

`typecheck → unit tests → production build → Cypress E2E`

A change is considered release-ready only after this gate is green.
