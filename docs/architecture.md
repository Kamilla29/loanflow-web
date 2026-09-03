# Architecture

LoanFlow is split by responsibility rather than by file type.

- `apps/loanflow` owns routing and product orchestration.
- `libs/ui` contains reusable presentation primitives with no product-specific business rules.
- `libs/domain` owns calculations, affordability classification and Zod validation.
- `libs/application-state` owns the persisted application draft.
- `libs/api` exposes the asynchronous application boundary and deterministic demo scenarios.

The application deliberately keeps the network layer mockable. The product UI does not know whether a submission is backed by a real REST endpoint, MSW, or the deterministic demo transport used in this portfolio version.

## State boundaries

Server-like state is modeled through TanStack Query. User-entered draft data is client state and persists through Zustand. Form-local validation and touched/error state remain inside React Hook Form.

## Failure strategy

A service failure never clears user input. The review step remains available and the user can retry without rebuilding the application from scratch.
