import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormData } from '../../validation/resetPassword.schema';
// TODO: Import useResetPassword when API is ready

export const useResetPasswordForm = (options?: { onSuccess?: (data: ResetPasswordFormData) => void; onError?: (err: Error) => void }) => {
  const isSubmitting = false;
  const error = null;

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      console.log('Reset password data:', data);
      options?.onSuccess?.(data);
    } catch (err) {
      console.error('Reset password submission failed', err);
      options?.onError?.(err as Error);
    }
  };

  return {
    ...form,
    isSubmitting,
    apiError: error,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
