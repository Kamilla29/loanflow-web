export type LoanTerms = {
  amount: number;
  months: number;
  annualRate: number;
};

export type LoanSummary = LoanTerms & {
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
};

export const MIN_AMOUNT = 50_000;
export const MAX_AMOUNT = 1_200_000;
export const MIN_TERM = 12;
export const MAX_TERM = 96;
export const ILLUSTRATIVE_ANNUAL_RATE = 7.9;

export function calculateLoanSummary({ amount, months, annualRate }: LoanTerms): LoanSummary {
  const principal = Math.max(0, amount);
  const term = Math.max(1, Math.round(months));
  const monthlyRate = annualRate / 100 / 12;

  const monthlyPayment = monthlyRate === 0
    ? principal / term
    : principal * (monthlyRate * (1 + monthlyRate) ** term) / ((1 + monthlyRate) ** term - 1);

  const totalRepayment = monthlyPayment * term;

  return {
    amount: principal,
    months: term,
    annualRate,
    monthlyPayment,
    totalRepayment,
    totalInterest: totalRepayment - principal
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0
  }).format(value);
}
