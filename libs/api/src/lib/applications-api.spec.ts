import { getApplicationStatus, submitApplication } from './applications-api';

const application = {
  amount: 300_000, months: 60, firstName: 'Kamilla', lastName: 'Example', email: 'kamilla@example.com',
  phone: '+420 777 123 456', employmentType: 'employee' as const, monthlyIncome: 55_000, monthlyExpenses: 24_000
};

describe('applications api boundary', () => {
  it('returns a reference for successful submissions', async () => {
    const result = await submitApplication(application);
    expect(result.id).toMatch(/^LF-/);
    expect(result.status).toBe('received');
  });
  it('exposes a recoverable simulated service failure', async () => {
    await expect(submitApplication(application, { simulation: 'error' })).rejects.toThrow('temporarily unavailable');
  });
  it('recovers application status for direct navigation', async () => {
    const result = await getApplicationStatus('LF-DEMO123');
    expect(result.id).toBe('LF-DEMO123');
    expect(result.status).toBe('reviewing');
  });
});
