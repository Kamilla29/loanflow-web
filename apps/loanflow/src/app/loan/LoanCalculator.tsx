import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Link } from 'react-router-dom';
import {
  LOAN_PRODUCTS_QUERY,
  type LoanProductsQueryData,
  type LoanProductsQueryVariables
} from '@loanflow/api';
import {
  calculateLoanSummary,
  formatCurrency,
  ILLUSTRATIVE_ANNUAL_RATE,
  MAX_AMOUNT,
  MAX_TERM,
  MIN_AMOUNT,
  MIN_TERM
} from '@loanflow/domain';
import { Card, FormField } from '@loanflow/ui';

function normalizeAmount(value: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return MIN_AMOUNT;
  return Math.min(MAX_AMOUNT, Math.max(MIN_AMOUNT, parsed));
}

export function LoanCalculator() {
  const [amountInput, setAmountInput] = useState('250000');
  const [months, setMonths] = useState(48);
  const amount = normalizeAmount(amountInput);

  const summary = useMemo(
    () => calculateLoanSummary({ amount, months, annualRate: ILLUSTRATIVE_ANNUAL_RATE }),
    [amount, months]
  );

  const productQuery = useQuery<LoanProductsQueryData, LoanProductsQueryVariables>(
    LOAN_PRODUCTS_QUERY,
    {
      variables: { amount, months }
    }
  );

  const matchedProduct =
    productQuery.data?.loanProducts.find((product) => product.featured) ??
    productQuery.data?.loanProducts[0];

  return (
    <Card className="calculator" data-cy="loan-calculator">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Illustrative calculator</p>
          <h2>Shape your loan</h2>
        </div>
        <span className="rate-pill">{ILLUSTRATIVE_ANNUAL_RATE}% p.a.</span>
      </div>

      <div className="calculator__grid">
        <div className="calculator__controls">
          <FormField
            label="Loan amount"
            htmlFor="loan-amount"
            hint={`${formatCurrency(MIN_AMOUNT)} – ${formatCurrency(MAX_AMOUNT)}`}
          >
            <input
              className="lf-input"
              id="loan-amount"
              data-cy="loan-amount"
              type="number"
              inputMode="numeric"
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              step={10_000}
              value={amountInput}
              aria-describedby="loan-amount-hint"
              onChange={(event) => setAmountInput(event.target.value)}
              onBlur={() => setAmountInput(String(amount))}
            />
          </FormField>

          <FormField
            label="Repayment period"
            htmlFor="loan-term"
            hint={`${MIN_TERM} – ${MAX_TERM} months`}
          >
            <select
              className="lf-select"
              id="loan-term"
              data-cy="loan-term"
              value={months}
              aria-describedby="loan-term-hint"
              onChange={(event) => setMonths(Number(event.target.value))}
            >
              {[12, 24, 36, 48, 60, 72, 84, 96].map((term) => (
                <option key={term} value={term}>
                  {term} months
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="calculator__summary" aria-live="polite">
          <span>Estimated monthly payment</span>
          <strong data-cy="monthly-payment">{formatCurrency(summary.monthlyPayment)}</strong>
          <dl>
            <div>
              <dt>Total repayment</dt>
              <dd>{formatCurrency(summary.totalRepayment)}</dd>
            </div>
            <div>
              <dt>Interest</dt>
              <dd>{formatCurrency(summary.totalInterest)}</dd>
            </div>
          </dl>
          <Link
            className="lf-button lf-button--primary"
            to={`/apply?amount=${amount}&months=${months}`}
          >
            Start application
          </Link>
          <small>Illustrative calculation only; not a real credit offer.</small>
        </div>
      </div>

      <section className="graphql-match" aria-live="polite" data-cy="graphql-product">
        <div>
          <p className="eyebrow">GraphQL product match</p>
          <h3>
            {productQuery.loading
              ? 'Matching available products…'
              : matchedProduct?.name ?? 'Individual review'}
          </h3>
          <p>
            {productQuery.error
              ? 'The product catalogue is temporarily unavailable; the calculator remains usable.'
              : matchedProduct?.description ??
                'No standard catalogue product covers this combination, so an individual review would be required.'}
          </p>
        </div>

        {matchedProduct && !productQuery.loading && (
          <div className="graphql-match__rate">
            <span>Matched product rate</span>
            <strong>{matchedProduct.annualRate.toFixed(1)}% p.a.</strong>
            <small>Apollo Client · cached GraphQL query</small>
          </div>
        )}
      </section>
    </Card>
  );
}
