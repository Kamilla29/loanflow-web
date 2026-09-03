import { useEffect, useMemo, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm, type FieldPath } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { submitApplication, type SubmissionSimulation } from '@loanflow/api';
import { useApplicationStore } from '@loanflow/application-state';
import {
  applicationSchema,
  calculateLoanSummary,
  formatCurrency,
  getAffordabilitySnapshot,
  ILLUSTRATIVE_ANNUAL_RATE,
  MAX_AMOUNT,
  MIN_AMOUNT,
  type ApplicationFormValues
} from '@loanflow/domain';
import { Alert, Badge, Button, Card, FormField, ProgressBar, Stepper } from '@loanflow/ui';

const steps = ['Loan', 'Personal', 'Finances', 'Review'];

const stepContent = [
  ['Loan details', 'Confirm the amount and repayment period before continuing.'],
  ['Your details', 'Tell us who is applying and how the demo service could contact you.'],
  ['Income and expenses', 'Add a simple affordability snapshot for this fictional application.'],
  ['Review and submit', 'Check the information before sending it to the mock application service.']
] as const;

const fieldsByStep: FieldPath<ApplicationFormValues>[][] = [
  ['amount', 'months'],
  ['firstName', 'lastName', 'email', 'phone'],
  ['employmentType', 'monthlyIncome', 'monthlyExpenses'],
  []
];

function getSimulation(value: string | null): SubmissionSimulation {
  return value === 'error' || value === 'slow' ? value : 'success';
}

function safeNumber(value: string | null, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
}

export function ApplicationWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusStep = useRef(false);
  const { draft, updateDraft, resetDraft } = useApplicationStore();

  const amountFromUrl = safeNumber(searchParams.get('amount'), draft.amount, MIN_AMOUNT, MAX_AMOUNT);
  const monthsFromUrl = safeNumber(searchParams.get('months'), draft.months, 12, 96);
  const simulation = getSimulation(searchParams.get('simulate'));

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    mode: 'onTouched',
    defaultValues: {
      ...draft,
      amount: amountFromUrl,
      months: monthsFromUrl
    }
  });

  useEffect(() => {
    const subscription = form.watch((value) => updateDraft(value as Partial<ApplicationFormValues>));
    return () => subscription.unsubscribe();
  }, [form, updateDraft]);

  useEffect(() => {
    if (!shouldFocusStep.current) return;
    stepHeadingRef.current?.focus();
    stepHeadingRef.current?.scrollIntoView({ block: 'start' });
  }, [activeStep]);

  const values = form.watch();
  const errors = form.formState.errors;

  const summary = useMemo(
    () =>
      calculateLoanSummary({
        amount: Number(values.amount) || 0,
        months: Number(values.months) || 1,
        annualRate: ILLUSTRATIVE_ANNUAL_RATE
      }),
    [values.amount, values.months]
  );

  const affordability = useMemo(
    () =>
      getAffordabilitySnapshot(
        Number(values.monthlyIncome) || 0,
        Number(values.monthlyExpenses) || 0,
        summary.monthlyPayment
      ),
    [values.monthlyIncome, values.monthlyExpenses, summary.monthlyPayment]
  );

  const affordabilityPercent = Math.min(100, affordability.paymentShare * 100);

  const mutation = useMutation({
    mutationFn: (data: ApplicationFormValues) => submitApplication(data, { simulation }),
    onSuccess: (result) => {
      resetDraft();
      navigate(`/status/${result.id}`, { state: result });
    }
  });

  const focusFirstInvalid = (fields: FieldPath<ApplicationFormValues>[]) => {
    const invalidField = fields.find((field) => form.getFieldState(field).invalid);
    if (invalidField) form.setFocus(invalidField);
  };

  const moveToStep = (nextStep: number) => {
    shouldFocusStep.current = true;
    mutation.reset();
    setActiveStep(nextStep);
  };

  const goNext = async () => {
    const fields = fieldsByStep[activeStep];
    const valid = await form.trigger(fields);

    if (!valid) {
      focusFirstInvalid(fields);
      return;
    }

    moveToStep(Math.min(activeStep + 1, steps.length - 1));
  };

  const onSubmit = form.handleSubmit(
    (data) => mutation.mutate(data),
    (submitErrors) => {
      const firstInvalid = Object.keys(submitErrors)[0] as FieldPath<ApplicationFormValues> | undefined;
      if (firstInvalid) form.setFocus(firstInvalid);
    }
  );

  const [stepTitle, stepDescription] = stepContent[activeStep];

  return (
    <main id="main-content" className="page-shell application-page">
      <div className="application-heading">
        <div>
          <p className="eyebrow">Application journey</p>
          <h1 className="page-title">Your loan</h1>
          <p className="page-lead">
            A four-step demo flow with schema validation, persistent draft state, API-style submission
            and resilient error handling.
          </p>
        </div>
        <div className="application-heading__amount" aria-live="polite">
          <span>Monthly estimate</span>
          <strong>{formatCurrency(summary.monthlyPayment)}</strong>
        </div>
      </div>

      <Card>
        <Stepper labels={steps} activeIndex={activeStep} />

        <div className="step-intro">
          <p className="eyebrow">
            Step {activeStep + 1} of {steps.length}
          </p>
          <h2 ref={stepHeadingRef} tabIndex={-1}>
            {stepTitle}
          </h2>
          <p>{stepDescription}</p>
        </div>

        <form onSubmit={onSubmit} noValidate aria-busy={mutation.isPending}>
          {activeStep === 0 && (
            <div className="form-grid">
              <FormField label="Loan amount" htmlFor="amount" error={errors.amount?.message}>
                <input
                  className="lf-input"
                  id="amount"
                  data-cy="apply-amount"
                  type="number"
                  min={MIN_AMOUNT}
                  max={MAX_AMOUNT}
                  step="10000"
                  aria-invalid={Boolean(errors.amount)}
                  aria-describedby={errors.amount ? 'amount-error' : undefined}
                  {...form.register('amount', { valueAsNumber: true })}
                />
              </FormField>

              <FormField
                label="Repayment period (months)"
                htmlFor="months"
                error={errors.months?.message}
              >
                <select
                  className="lf-select"
                  id="months"
                  data-cy="apply-months"
                  aria-invalid={Boolean(errors.months)}
                  aria-describedby={errors.months ? 'months-error' : undefined}
                  {...form.register('months', { valueAsNumber: true })}
                >
                  {[12, 24, 36, 48, 60, 72, 84, 96].map((term) => (
                    <option value={term} key={term}>
                      {term}
                    </option>
                  ))}
                </select>
              </FormField>

              <div className="summary-strip form-grid__wide">
                <div>
                  <span>Rate</span>
                  <strong>{ILLUSTRATIVE_ANNUAL_RATE}%</strong>
                </div>
                <div>
                  <span>Total repayment</span>
                  <strong>{formatCurrency(summary.totalRepayment)}</strong>
                </div>
                <div>
                  <span>Total interest</span>
                  <strong>{formatCurrency(summary.totalInterest)}</strong>
                </div>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="form-grid">
              <FormField label="First name" htmlFor="firstName" error={errors.firstName?.message}>
                <input
                  className="lf-input"
                  id="firstName"
                  autoComplete="given-name"
                  aria-invalid={Boolean(errors.firstName)}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  {...form.register('firstName')}
                />
              </FormField>

              <FormField label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
                <input
                  className="lf-input"
                  id="lastName"
                  autoComplete="family-name"
                  aria-invalid={Boolean(errors.lastName)}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  {...form.register('lastName')}
                />
              </FormField>

              <FormField label="Email" htmlFor="email" error={errors.email?.message}>
                <input
                  className="lf-input"
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  {...form.register('email')}
                />
              </FormField>

              <FormField
                label="Phone"
                htmlFor="phone"
                hint="International format is supported"
                error={errors.phone?.message}
              >
                <input
                  className="lf-input"
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : 'phone-hint'}
                  {...form.register('phone')}
                />
              </FormField>
            </div>
          )}

          {activeStep === 2 && (
            <div className="form-grid">
              <FormField
                label="Employment"
                htmlFor="employmentType"
                error={errors.employmentType?.message}
              >
                <select
                  className="lf-select"
                  id="employmentType"
                  aria-invalid={Boolean(errors.employmentType)}
                  aria-describedby={errors.employmentType ? 'employmentType-error' : undefined}
                  {...form.register('employmentType')}
                >
                  <option value="employee">Employee</option>
                  <option value="self-employed">Self-employed</option>
                  <option value="student">Student</option>
                  <option value="other">Other</option>
                </select>
              </FormField>
              <div />

              <FormField
                label="Monthly net income"
                htmlFor="monthlyIncome"
                error={errors.monthlyIncome?.message}
              >
                <input
                  className="lf-input"
                  id="monthlyIncome"
                  type="number"
                  min="1"
                  step="1000"
                  aria-invalid={Boolean(errors.monthlyIncome)}
                  aria-describedby={errors.monthlyIncome ? 'monthlyIncome-error' : undefined}
                  {...form.register('monthlyIncome', { valueAsNumber: true })}
                />
              </FormField>

              <FormField
                label="Monthly expenses"
                htmlFor="monthlyExpenses"
                error={errors.monthlyExpenses?.message}
              >
                <input
                  className="lf-input"
                  id="monthlyExpenses"
                  type="number"
                  min="0"
                  step="1000"
                  aria-invalid={Boolean(errors.monthlyExpenses)}
                  aria-describedby={errors.monthlyExpenses ? 'monthlyExpenses-error' : undefined}
                  {...form.register('monthlyExpenses', { valueAsNumber: true })}
                />
              </FormField>

              <div className="affordability-card form-grid__wide">
                <div>
                  <Badge
                    tone={
                      affordability.level === 'comfortable'
                        ? 'success'
                        : affordability.level === 'tight'
                          ? 'warning'
                          : 'neutral'
                    }
                  >
                    {affordability.level.replace('-', ' ')}
                  </Badge>
                  <span>Illustrative payment share of income</span>
                </div>
                <ProgressBar
                  value={affordabilityPercent}
                  label={`${formatCurrency(summary.monthlyPayment)} / ${formatCurrency(Number(values.monthlyIncome) || 0)}`}
                />
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="review-grid">
              <section>
                <p className="eyebrow">Loan</p>
                <h3>
                  {formatCurrency(values.amount)} over {values.months} months
                </h3>
                <p>
                  {formatCurrency(summary.monthlyPayment)} estimated monthly payment at{' '}
                  {ILLUSTRATIVE_ANNUAL_RATE}% p.a.
                </p>
              </section>

              <section>
                <p className="eyebrow">Applicant</p>
                <h3>
                  {values.firstName} {values.lastName}
                </h3>
                <p>
                  {values.email}
                  <br />
                  {values.phone}
                </p>
              </section>

              <section>
                <p className="eyebrow">Affordability snapshot</p>
                <h3>{formatCurrency(affordability.disposableIncome)}</h3>
                <p>Illustrative monthly disposable amount. This is not credit scoring.</p>
              </section>

              <Alert title="Portfolio demo" tone="info">
                No identity verification, bureau lookup, real financial decision or personal data
                processing is performed.
              </Alert>
            </div>
          )}

          {mutation.isError && (
            <Alert title="We could not submit the application." tone="danger">
              <span data-cy="submission-error">
                Your draft is still saved. Check the details and try again.
              </span>
            </Alert>
          )}

          <div className="form-actions">
            {activeStep > 0 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => moveToStep(Math.max(activeStep - 1, 0))}
              >
                Back
              </Button>
            ) : (
              <span />
            )}

            {activeStep < steps.length - 1 ? (
              <Button type="button" data-cy="continue" onClick={goNext}>
                Continue
              </Button>
            ) : (
              <Button type="submit" data-cy="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Submitting…' : mutation.isError ? 'Try again' : 'Submit application'}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </main>
  );
}
