import type { PropsWithChildren } from 'react';

type AlertProps = PropsWithChildren<{
  title: string;
  tone?: 'info' | 'danger' | 'success';
}>;

export function Alert({ title, tone = 'info', children }: AlertProps) {
  return (
    <div className={`lf-alert lf-alert--${tone}`} role={tone === 'danger' ? 'alert' : 'status'}>
      <strong>{title}</strong>
      <div>{children}</div>
    </div>
  );
}
