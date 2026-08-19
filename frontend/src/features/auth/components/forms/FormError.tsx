import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface FormErrorProps {
  error: Error | string | null;
}

export const FormError: React.FC<FormErrorProps> = ({ error }) => {
  if (!error) return null;
  const message = typeof error === 'string' ? error : error.message || 'An unexpected error occurred';

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex items-start gap-2.5 p-3.5 rounded-[var(--auth-radius)] bg-red-500/10 border border-red-500/25 text-red-300 text-[14px]"
    >
      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-400" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};
