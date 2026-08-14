import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../../validation/forgotPassword.schema';
// TODO: Import useForgotPassword when API is ready
// import { useForgotPassword } from '../useForgotPassword';

export const useForgotPasswordForm = (options?: { onSuccess?: (data: ForgotPasswordFormData) => void; onError?: (err: Error) => void }) => {
  // const { mutateAsync: forgotPassword, isPending: isSubmitting, error } = useForgotPassword();
  const isSubmitting = false;
  const error = null;

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { identifier: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      // await forgotPassword(data);
      console.log('Forgot password data:', data);
      options?.onSuccess?.(data);
    } catch (err) {
      console.error('Forgot password submission failed', err);
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
