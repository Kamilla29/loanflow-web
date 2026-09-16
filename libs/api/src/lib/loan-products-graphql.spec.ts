import { apolloClient, LOAN_PRODUCTS_QUERY, type LoanProductsQueryData, type LoanProductsQueryVariables } from './loan-products-graphql';

describe('Apollo GraphQL product catalogue', () => {
  it('returns matching products for amount and term variables', async () => {
    const result = await apolloClient.query<LoanProductsQueryData, LoanProductsQueryVariables>({
      query: LOAN_PRODUCTS_QUERY,
      variables: { amount: 250_000, months: 48 },
      fetchPolicy: 'network-only'
    });

    expect(result.data?.loanProducts.map((product) => product.id)).toContain('flexi');
    expect(result.data?.loanProducts.every((product) => product.minAmount <= 250_000)).toBe(true);
  });

  it('normalizes products into the Apollo cache by id', async () => {
    await apolloClient.query<LoanProductsQueryData, LoanProductsQueryVariables>({
      query: LOAN_PRODUCTS_QUERY,
      variables: { amount: 300_000, months: 60 },
      fetchPolicy: 'network-only'
    });

    const cached = apolloClient.cache.extract();
    expect(cached['LoanProduct:{"id":"flexi"}']).toBeDefined();
  });
});
