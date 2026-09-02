import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm, type FieldPath } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { submitApplication } from '@loanflow/api';
import { useApplicationStore } from '@loanflow/application-state';
import {
  applicationSchema,
  calculateLoanSummary,
  formatCurrency,
  ILLUSTRATIVE_ANNUAL_RATE,
  type ApplicationFormValues
} from '@loanflow/domain';
import { Button, Card, FormField, Stepper } from '@loanflow/ui';

const steps = ['Loan', 'Personal', 'Finances', 'Review'];

const fieldsByStep: FieldPath<ApplicationFormValues>[][] = [
  ['amount', 'months'],
  ['firstName', 'lastName', 'email', 'phone'],
  ['employmentType', 'monthlyIncome', 'monthlyExpenses'],
  []
];

export function ApplicationWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { draft, updateDraft, resetDraft } = useApplicationStore();

  const amountFromUrl = Number(searchParams.get('amount')) || draft.amount;
  const monthsFromUrl = Number(searchParams.get('months')) || draft.months;

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    mode: 'onTouched',
    defaultValues: {
      ...draft,
      amount: amountFromUrl,
      months: monthsFromUrl
    }
  });

  const values = form.watch();
  const summary = useMemo(
    () => calculateLoanSummary({
      amount: Number(values.amount) || 0,
      months: Number(values.months) || 1,
      annualRate: ILLUSTRATIVE_ANNUAL_RATE
    }),
    [values.amount, values.months]
  );

  const mutation = useMutation({
    mutationFn: submitApplication,
    onSuccess: (result) => {
      resetDraft();
      navigate(`/status/${result.id}`, { state: result });
    }
  });

  const goNext = async () => {
    const valid = await form.trigger(fieldsByStep[activeStep]);
    if (!valid) return;

    updateDraft(form.getValues());
    setActiveStep((step) => Math.min(step + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => setActiveStep((step) => Math.max(step - 1, 0));

  const onSubmit = form.handleSubmit((data) => {
    updateDraft(data);
    mutation.mutate(data);
  });

  return (
    <main className="page-shell application-page">
      <div className="application-heading">
        <div>
          <p className="eyebrow">Application journey</p>
          <h1 className="page-title">Your loan</h1>
          <p className="page-lead">A four-step demo flow with schema validation, persisted client state and API-style submission.</p>
        </div>
        <div className="application-heading__amount">
          <span>Monthly estimate</span>
          <strong>{formatCurrency(summary.monthlyPayment)}</strong>
        </div>
      </div>

      <Card>
        <Stepper labels={steps} activeIndex={activeStep} />
        <form onSubmit={onSubmit} noValidate>
          {activeStep === 0 && (
            <div className="form-grid">
              <FormField label="Loan amount" htmlFor="amount" error={form.formState.errors.amount?.message}>
                <input className="lf-input" id="amount" type="number" step="10000" {...form.register('amount', { valueAsNumber: true })} />
              </FormField>
              <FormField label="Repayment period (months)" htmlFor="months" error={form.formState.errors.months?.message}>
                <select className="lf-select" id="months" {...form.register('months', { valueAsNumber: true })}>
                  {[12, 24, 36, 48, 60, 72, 84, 96].map((term) => <option value={term} key={term}>{term}</option>)}
                </select>
              </FormField>
              <div className="summary-strip form-grid__wide">
                <div><span>Rate</span><strong>{ILLUSTRATIVE_ANNUAL_RATE}%</strong></div>
                <div><span>Total repayment</span><strong>{formatCurrency(summary.totalRepayment)}</strong></div>
                <div><span>Total interest</span><strong>{formatCurrency(summary.totalInterest)}</strong></div>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="form-grid">
              <FormField label="First name" htmlFor="firstName" error={form.formState.errors.firstName?.message}>
                <input className="lf-input" id="firstName" autoComplete="given-name" {...form.register('firstName')} />
              </FormField>
              <FormField label="Last name" htmlFor="lastName" error={form.formState.errors.lastName?.message}>
                <input className="lf-input" id="lastName" autoComplete="family-name" {...form.register('lastName')} />
              </FormField>
              <FormField label="Email" htmlFor="email" error={form.formState.errors.email?.message}>
                <input className="lf-input" id="email" type="email" autoComplete="email" {...form.register('email')} />
              </FormField>
              <FormField label="Phone" htmlFor="phone" hint="International format is supported" error={form.formState.errors.phone?.message}>
                <input className="lf-input" id="phone" type="tel" autoComplete="tel" {...form.register('phone')} />
              </FormField>
            </div>
          )}

          {activeStep === 2 && (
            <div className="form-grid">
              <FormField label="Employment" htmlFor="employmentType" error={form.formState.errors.employmentType?.message}>
                <select className="lf-select" id="employmentType" {...form.register('employmentType')}>
                  <option value="employee">Employee</option>
                  <option value="self-employed">Self-employed</option>
                  <option value="student">Student</option>
                  <option value="other">Other</option>
                </select>
              </FormField>
              <div />
              <FormField label="Monthly net income" htmlFor="monthlyIncome" error={form.formState.errors.monthlyIncome?.message}>
                <input className="lf-input" id="monthlyIncome" type="number" step="1000" {...form.register('monthlyIncome', { valueAsNumber: true })} />
              </FormField>
              <FormField label="Monthly expenses" htmlFor="monthlyExpenses" error={form.formState.errors.monthlyExpenses?.message}>
                <input className="lf-input" id="monthlyExpenses" type="number" step="1000" {...form.register('monthlyExpenses', { valueAsNumber: true })} />
              </FormField>
            </div>
          )}

          {activeStep === 3 && (
            <div className="review-grid">
              <section>
                <p className="eyebrow">Loan</p>
                <h2>{formatCurrency(values.amount)} over {values.months} months</h2>
                <p>{formatCurrency(summary.monthlyPayment)} estimated monthly payment at {ILLUSTRATIVE_ANNUAL_RATE}% p.a.</p>
              </section>
              <section>
                <p className="eyebrow">Applicant</p>
                <h2>{values.firstName} {values.lastName}</h2>
                <p>{values.email}<br />{values.phone}</p>
              </section>
              <section>
                <p className="eyebrow">Affordability snapshot</p>
                <h2>{formatCurrency(values.monthlyIncome - values.monthlyExpenses)}</h2>
                <p>Illustrative monthly disposable amount based on the values entered.</p>
              </section>
              <p className="review-note">This portfolio demo does not perform credit scoring, identity verification or any real financial decision.</p>
            </div>
          )}

          {mutation.isError && <p className="form-error" role="alert">The demo submission failed. Please try again.</p>}

          <div className="form-actions">
            {activeStep > 0 ? <Button type="button" variant="secondary" onClick={goBack}>Back</Button> : <span />}
            {activeStep < steps.length - 1 ? (
              <Button type="button" onClick={goNext}>Continue</Button>
            ) : (
              <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Submitting…' : 'Submit application'}</Button>
            )}
          </div>
        </form>
      </Card>
    </main>
  );
}
