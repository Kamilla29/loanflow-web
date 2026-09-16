import { ApolloClient, ApolloLink, InMemoryCache, gql } from '@apollo/client';
import { delay, of, throwError } from 'rxjs';

export type LoanProduct = {
  __typename: 'LoanProduct';
  id: string;
  name: string;
  description: string;
  annualRate: number;
  minAmount: number;
  maxAmount: number;
  minMonths: number;
  maxMonths: number;
  featured: boolean;
};

export type LoanProductsQueryData = {
  loanProducts: LoanProduct[];
};

export type LoanProductsQueryVariables = {
  amount: number;
  months: number;
};

export const LOAN_PRODUCTS_QUERY = gql`
  query LoanProducts($amount: Float!, $months: Int!) {
    loanProducts(amount: $amount, months: $months) {
      id
      name
      description
      annualRate
      minAmount
      maxAmount
      minMonths
      maxMonths
      featured
      __typename
    }
  }
`;

const productCatalog: LoanProduct[] = [
  {
    __typename: 'LoanProduct',
    id: 'flexi',
    name: 'Flexi Loan',
    description: 'Balanced repayment terms for everyday financing.',
    annualRate: 6.9,
    minAmount: 50_000,
    maxAmount: 500_000,
    minMonths: 12,
    maxMonths: 72,
    featured: true
  },
  {
    __typename: 'LoanProduct',
    id: 'plus',
    name: 'Loan Plus',
    description: 'Higher limits and longer terms for larger plans.',
    annualRate: 7.4,
    minAmount: 250_000,
    maxAmount: 1_000_000,
    minMonths: 24,
    maxMonths: 96,
    featured: false
  },
  {
    __typename: 'LoanProduct',
    id: 'quick',
    name: 'Quick Loan',
    description: 'Shorter repayment periods for smaller borrowing needs.',
    annualRate: 6.5,
    minAmount: 50_000,
    maxAmount: 250_000,
    minMonths: 12,
    maxMonths: 48,
    featured: false
  }
];

const mockGraphqlLink = new ApolloLink((operation) => {
  if (operation.operationName !== 'LoanProducts') {
    return throwError(() => new Error(`Unsupported mock GraphQL operation: ${operation.operationName}`));
  }

  const { amount, months } = operation.variables as LoanProductsQueryVariables;
  const loanProducts = productCatalog.filter(
    (product) =>
      amount >= product.minAmount &&
      amount <= product.maxAmount &&
      months >= product.minMonths &&
      months <= product.maxMonths
  );

  return of({ data: { loanProducts } }).pipe(delay(180));
});

export const apolloClient = new ApolloClient({
  link: mockGraphqlLink,
  cache: new InMemoryCache({
    typePolicies: {
      LoanProduct: {
        keyFields: ['id']
      }
    }
  })
});
