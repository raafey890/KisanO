import { z } from 'zod';
import { USER_ROLES } from '../utils/roleHierarchy';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number'),
  email: z.string().email('Enter a valid email address').or(z.literal('')),
  district: z.string().min(2, 'District is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the Terms of Service' }),
  }),
  role: z.enum([USER_ROLES.FARMER, USER_ROLES.EQUIPMENT_OWNER, USER_ROLES.SPRAYER, USER_ROLES.ADMIN], {
    errorMap: () => ({ message: 'Please select a valid role' })
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
