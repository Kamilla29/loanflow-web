import type { PropsWithChildren } from 'react';

type BadgeProps = PropsWithChildren<{
  tone?: 'brand' | 'success' | 'warning' | 'neutral';
}>;

export function Badge({ tone = 'brand', children }: BadgeProps) {
  return <span className={`lf-badge lf-badge--${tone}`}>{children}</span>;
}
