export type AffordabilityLevel = 'comfortable' | 'tight' | 'high-risk';

export type AffordabilitySnapshot = {
  disposableIncome: number;
  paymentShare: number;
  level: AffordabilityLevel;
};

export function getAffordabilitySnapshot(monthlyIncome: number, monthlyExpenses: number, monthlyPayment: number): AffordabilitySnapshot {
  const disposableIncome = Math.max(0, monthlyIncome - monthlyExpenses);
  const paymentShare = monthlyIncome <= 0 ? 1 : monthlyPayment / monthlyIncome;
  const level: AffordabilityLevel = paymentShare <= 0.25 && monthlyPayment <= disposableIncome
    ? 'comfortable'
    : paymentShare <= 0.4 && monthlyPayment <= disposableIncome
      ? 'tight'
      : 'high-risk';
  return { disposableIncome, paymentShare, level };
}
