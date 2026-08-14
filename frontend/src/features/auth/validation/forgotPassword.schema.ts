import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Mobile number or Email is required')
    .refine(
      (val) => /^[6-9]\d{9}$/.test(val) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      'Enter a valid 10-digit mobile number or email address'
    ),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
