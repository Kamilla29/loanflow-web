import type { PropsWithChildren } from 'react';
export function Alert({ title, tone = 'info', children }: PropsWithChildren<{ title: string; tone?: 'info' | 'danger' | 'success' }>) {
  return <div className={`lf-alert lf-alert--${tone}`} role={tone === 'danger' ? 'alert' : 'status'}><strong>{title}</strong><div>{children}</div></div>;
}
