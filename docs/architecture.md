# Architecture

LoanFlow is split by responsibility rather than by file type.

- `apps/loanflow` owns routing and product orchestration.
- `libs/ui` contains reusable presentation primitives with no product-specific business rules.
- `libs/domain` owns calculations, affordability classification and Zod validation.
- `libs/application-state` owns the persisted application draft.
- `libs/api` contains both REST-style application services and the Apollo GraphQL product catalogue boundary.

The application deliberately keeps transport details outside presentation components. Product UI consumes typed data-access contracts rather than knowing how requests are implemented.

## Data boundaries

LoanFlow intentionally demonstrates two server-state patterns instead of forcing all remote data through one library:

- **TanStack Query** manages the REST-style application submission and status-recovery flow.
- **Apollo Client** manages the GraphQL product catalogue, variable-based matching and normalized cache entries.

The portfolio version uses a deterministic custom Apollo Link as its GraphQL transport, so the query/caching architecture can be inspected and tested without requiring a deployed backend. Replacing that link with an `HttpLink` would move the same operations to a real GraphQL endpoint without changing the feature components.

## State boundaries

Server-like state is handled by the dedicated query clients above. User-entered draft data is client state and persists through Zustand. Form-local validation and touched/error state remain inside React Hook Form.

## GraphQL flow

```text
LoanCalculator
  → useQuery(LoanProducts)
  → Apollo Client
  → GraphQL variables: amount + months
  → mock terminating Apollo Link
  → normalized InMemoryCache by LoanProduct.id
  → matched product rendered in the calculator
```

The GraphQL boundary is covered by unit tests and by the main Cypress journey, which verifies that changing calculator inputs produces a visible product match before the user enters the application flow.

## Failure strategy

A service failure never clears user input. The review step remains available and the user can retry without rebuilding the application from scratch. The GraphQL product catalogue is also non-blocking: if product matching fails, the calculator and application journey remain usable.
