import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../../validation/login.schema';
import { useLogin } from '../useLogin';

export const useLoginForm = (options?: { onSuccess?: () => void; onError?: (err: Error) => void }) => {
  const { mutateAsync: login, isPending: isSubmitting, error } = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      options?.onSuccess?.();
    } catch (err: any) {
      console.error('Login form submission failed', err);
      if (options?.onError) {
        options.onError(err);
      }
    }
  };

  return {
    ...form,
    isSubmitting,
    apiError: error,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
