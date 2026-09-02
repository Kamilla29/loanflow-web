import type { ApplicationFormValues } from '@loanflow/domain';

export type SubmittedApplication = {
  id: string;
  status: 'received';
  submittedAt: string;
};

export type SubmissionSimulation = 'success' | 'error' | 'slow';

type SubmitApplicationOptions = {
  simulation?: SubmissionSimulation;
};

function wait(milliseconds: number) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, milliseconds));
}

export async function submitApplication(
  application: ApplicationFormValues,
  options: SubmitApplicationOptions = {}
): Promise<SubmittedApplication> {
  const simulation = options.simulation ?? 'success';
  await wait(simulation === 'slow' ? 2_000 : 650);

  if (simulation === 'error') {
    throw new Error('The application service is temporarily unavailable.');
  }

  void application;

  return {
    id: `LF-${Date.now().toString(36).toUpperCase()}`,
    status: 'received',
    submittedAt: new Date().toISOString()
  };
}
