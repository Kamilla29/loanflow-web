import { describe, expect, it } from 'vitest';
import { applicationSchema } from './application-schema';

const validApplication = {
  amount: 250_000,
  months: 48,
  firstName: 'Kamilla',
  lastName: 'Kuanysheva',
  email: 'kamilla@example.com',
  phone: '+420 777 123 456',
  employmentType: 'employee' as const,
  monthlyIncome: 55_000,
  monthlyExpenses: 22_000
};

describe('applicationSchema', () => {
  it('accepts a complete valid application', () => {
    expect(applicationSchema.safeParse(validApplication).success).toBe(true);
  });

  it('rejects malformed contact data', () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      email: 'not-an-email',
      phone: '12'
    });

    expect(result.success).toBe(false);
  });

  it('rejects expenses that are not lower than income', () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      monthlyIncome: 30_000,
      monthlyExpenses: 30_000
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'monthlyExpenses')).toBe(true);
    }
  });
});
