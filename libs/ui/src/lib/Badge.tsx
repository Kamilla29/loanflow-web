import type { PropsWithChildren } from 'react';
export function Badge({ tone = 'brand', children }: PropsWithChildren<{ tone?: 'brand' | 'success' | 'warning' | 'neutral' }>) {
  return <span className={`lf-badge lf-badge--${tone}`}>{children}</span>;
}
