import type { ApplicationFormValues } from '@loanflow/domain';

export type SubmittedApplication = {
  id: string;
  status: 'received';
  submittedAt: string;
};

export async function submitApplication(_application: ApplicationFormValues): Promise<SubmittedApplication> {
  await new Promise((resolve) => window.setTimeout(resolve, 650));

  return {
    id: `LF-${Date.now().toString(36).toUpperCase()}`,
    status: 'received',
    submittedAt: new Date().toISOString()
  };
}
