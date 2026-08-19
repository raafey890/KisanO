import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../../validation/register.schema';
import { useRegister } from '../useRegister';
import { USER_ROLES } from '../../utils/roleHierarchy';

export const useRegisterForm = (defaultRole: keyof typeof USER_ROLES = 'FARMER', options?: { onSuccess?: (data: RegisterFormData) => void; onError?: (err: Error) => void }) => {
  const { mutateAsync: register, isPending: isSubmitting, error } = useRegister();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      district: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
      role: defaultRole,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data);
      options?.onSuccess?.(data);
    } catch (err: any) {
      console.error('Register form submission failed', err);
      // Pass the backend message directly
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
