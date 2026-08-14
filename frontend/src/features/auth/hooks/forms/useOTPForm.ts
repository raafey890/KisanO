import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, OTPFormData } from '../../validation/otp.schema';

export const useOTPForm = (options?: { onSuccess?: (data: OTPFormData) => void; onError?: (err: Error) => void }) => {
  const isSubmitting = false;
  const error = null;

  const form = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const onSubmit = async (data: OTPFormData) => {
    try {
      console.log('OTP data:', data);
      options?.onSuccess?.(data);
    } catch (err) {
      console.error('OTP submission failed', err);
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
