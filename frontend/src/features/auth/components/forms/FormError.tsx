import React from 'react';

interface FormErrorProps {
  error: Error | string | null;
}

export const FormError: React.FC<FormErrorProps> = ({ error }) => {
  if (!error) return null;

  const message = typeof error === 'string' ? error : error.message || 'An unexpected error occurred';

  return (
    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
      {message}
    </div>
  );
};
