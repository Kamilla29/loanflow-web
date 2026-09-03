import type { ApplicationFormValues } from '@loanflow/domain';

export type ApplicationStatusValue = 'received' | 'reviewing' | 'decision-ready';
export type SubmittedApplication = { id: string; status: ApplicationStatusValue; submittedAt: string };
export type SubmissionSimulation = 'success' | 'error' | 'slow';

type SubmitApplicationOptions = { simulation?: SubmissionSimulation };

function wait(milliseconds: number) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, milliseconds));
}

function referenceId() {
  return `LF-${Date.now().toString(36).toUpperCase()}`;
}

export async function submitApplication(application: ApplicationFormValues, options: SubmitApplicationOptions = {}): Promise<SubmittedApplication> {
  const simulation = options.simulation ?? 'success';
  await wait(simulation === 'slow' ? 1_800 : 450);
  if (simulation === 'error') throw new Error('The application service is temporarily unavailable.');
  void application;
  return { id: referenceId(), status: 'received', submittedAt: new Date().toISOString() };
}

export async function getApplicationStatus(id: string): Promise<SubmittedApplication> {
  await wait(260);
  return { id, status: 'reviewing', submittedAt: new Date().toISOString() };
}
