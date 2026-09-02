import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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

export function LoanCalculator() {
  const [amount, setAmount] = useState(250_000);
  const [months, setMonths] = useState(48);

  const summary = useMemo(
    () => calculateLoanSummary({ amount, months, annualRate: ILLUSTRATIVE_ANNUAL_RATE }),
    [amount, months]
  );

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
          <FormField label="Loan amount" htmlFor="loan-amount" hint={`${formatCurrency(MIN_AMOUNT)} – ${formatCurrency(MAX_AMOUNT)}`}>
            <input
              className="lf-input"
              id="loan-amount"
              data-cy="loan-amount"
              type="number"
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              step={10_000}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value) || MIN_AMOUNT)}
            />
          </FormField>

          <FormField label="Repayment period" htmlFor="loan-term" hint={`${MIN_TERM} – ${MAX_TERM} months`}>
            <select
              className="lf-select"
              id="loan-term"
              data-cy="loan-term"
              value={months}
              onChange={(event) => setMonths(Number(event.target.value))}
            >
              {[12, 24, 36, 48, 60, 72, 84, 96].map((term) => (
                <option key={term} value={term}>{term} months</option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="calculator__summary" aria-live="polite">
          <span>Estimated monthly payment</span>
          <strong data-cy="monthly-payment">{formatCurrency(summary.monthlyPayment)}</strong>
          <dl>
            <div><dt>Total repayment</dt><dd>{formatCurrency(summary.totalRepayment)}</dd></div>
            <div><dt>Interest</dt><dd>{formatCurrency(summary.totalInterest)}</dd></div>
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
    </Card>
  );
}
