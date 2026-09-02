import type { PropsWithChildren } from 'react';

type FormFieldProps = PropsWithChildren<{
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
}>;

export function FormField({ label, htmlFor, hint, error, children }: FormFieldProps) {
  return (
    <div className="lf-field">
      <label className="lf-field__label" htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? <p className="lf-field__error" role="alert">{error}</p> : hint ? <p className="lf-field__hint">{hint}</p> : null}
    </div>
  );
}
