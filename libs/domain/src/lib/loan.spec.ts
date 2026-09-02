import { describe, expect, it } from 'vitest';
import { calculateLoanSummary } from './loan';

describe('calculateLoanSummary', () => {
  it('calculates an amortized monthly payment', () => {
    const result = calculateLoanSummary({ amount: 250_000, months: 48, annualRate: 7.9 });

    expect(result.monthlyPayment).toBeCloseTo(6091.5, 1);
    expect(result.totalRepayment).toBeGreaterThan(250_000);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it('supports a zero-interest scenario', () => {
    const result = calculateLoanSummary({ amount: 120_000, months: 12, annualRate: 0 });

    expect(result.monthlyPayment).toBe(10_000);
    expect(result.totalInterest).toBe(0);
  });
});
