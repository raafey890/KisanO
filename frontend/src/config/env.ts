import { z } from 'zod';

const envSchema = z.object({
  // Vite specific variables (Vite uses import.meta.env)
  VITE_API_URL: z.string().url().default('http://localhost:3000/api'),
  VITE_APP_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // Add other required public variables here. NEVER add secrets to the frontend env config.
});

// Since Vite injects env variables at build time, we parse import.meta.env
// Note: We cast import.meta.env to any to avoid TypeScript strict checking issues 
// if standard Vite types are not fully configured in the project.
const envProcess = envSchema.safeParse(import.meta.env as any);

if (!envProcess.success) {
  console.error('❌ Invalid environment configuration:', envProcess.error.format());
  throw new Error('Invalid environment configuration. Check your .env file.');
}

export const env = envProcess.data;
