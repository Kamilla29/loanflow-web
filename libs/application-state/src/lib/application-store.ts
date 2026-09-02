import { create } from 'zustand';
import type { ApplicationFormValues } from '@loanflow/domain';

const initialDraft: ApplicationFormValues = {
  amount: 250_000,
  months: 48,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  employmentType: 'employee',
  monthlyIncome: 45_000,
  monthlyExpenses: 20_000
};

type ApplicationStore = {
  draft: ApplicationFormValues;
  updateDraft: (patch: Partial<ApplicationFormValues>) => void;
  resetDraft: () => void;
};

export const useApplicationStore = create<ApplicationStore>((set) => ({
  draft: initialDraft,
  updateDraft: (patch) => set((state) => ({ draft: { ...state.draft, ...patch } })),
  resetDraft: () => set({ draft: initialDraft })
}));
