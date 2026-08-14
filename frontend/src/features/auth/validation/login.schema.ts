import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Phone number or Email is required')
    .refine(
      (val) => /^[6-9]\d{9}$/.test(val) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      'Enter a valid 10-digit mobile number or email address'
    ),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
