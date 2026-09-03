import { z } from 'zod';
import { MAX_AMOUNT, MAX_TERM, MIN_AMOUNT, MIN_TERM } from './loan';

export const applicationSchema = z.object({
  amount: z.number().min(MIN_AMOUNT, `Minimum loan is ${MIN_AMOUNT}`).max(MAX_AMOUNT, `Maximum loan is ${MAX_AMOUNT}`),
  months: z.number().int().min(MIN_TERM).max(MAX_TERM),
  firstName: z.string().trim().min(2, 'Enter at least 2 characters'),
  lastName: z.string().trim().min(2, 'Enter at least 2 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().regex(/^\+?[0-9 ]{9,16}$/, 'Enter a valid phone number'),
  employmentType: z.enum(['employee', 'self-employed', 'student', 'other']),
  monthlyIncome: z.number().min(1, 'Enter monthly income'),
  monthlyExpenses: z.number().min(0, 'Expenses cannot be negative')
}).refine((values) => values.monthlyExpenses < values.monthlyIncome, {
  message: 'Expenses should be lower than income', path: ['monthlyExpenses']
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
