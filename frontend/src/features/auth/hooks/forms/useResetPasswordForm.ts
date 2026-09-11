import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormData } from '../../validation/resetPassword.schema';
// TODO: Import useResetPassword when API is ready

export const useResetPasswordForm = (options?: { identifier?: string; otp?: string; onSuccess?: (data: ResetPasswordFormData) => void; onError?: (err: Error) => void }) => {
  const isSubmitting = false;
  const error = null;

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const payload = {
        identifier: options?.identifier,
        otp: options?.otp,
        newPassword: data.password
      };
      console.log('Reset password data:', payload);
      // await authApi.resetPassword(payload);
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
