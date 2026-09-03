import { getAffordabilitySnapshot } from './affordability';

describe('getAffordabilitySnapshot', () => {
  it('marks a low payment share as comfortable', () => {
    expect(getAffordabilitySnapshot(60_000, 20_000, 8_000).level).toBe('comfortable');
  });
  it('marks unaffordable payments as high-risk', () => {
    expect(getAffordabilitySnapshot(30_000, 25_000, 8_000).level).toBe('high-risk');
  });
});
