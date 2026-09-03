import { applicationSchema } from './application-schema';

const valid = {
  amount: 300_000, months: 60, firstName: 'Kamilla', lastName: 'Example', email: 'kamilla@example.com',
  phone: '+420 777 123 456', employmentType: 'employee' as const, monthlyIncome: 55_000, monthlyExpenses: 24_000
};

describe('applicationSchema', () => {
  it('accepts a valid application', () => expect(applicationSchema.safeParse(valid).success).toBe(true));
  it('rejects expenses at or above income', () => {
    const result = applicationSchema.safeParse({ ...valid, monthlyExpenses: 55_000 });
    expect(result.success).toBe(false);
  });
  it('rejects invalid contact data', () => {
    const result = applicationSchema.safeParse({ ...valid, email: 'not-email', phone: '12' });
    expect(result.success).toBe(false);
  });
});
