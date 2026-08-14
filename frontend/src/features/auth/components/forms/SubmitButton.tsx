import React from 'react';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  isLoading, 
  children, 
  disabled, 
  className = '', 
  ...props 
}) => {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className={`w-full bg-gradient-to-r from-[#4ADE80] to-[#22c55e] hover:from-[#22c55e] hover:to-[#16a34a] text-white rounded-xl py-3.5 font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#4ADE80]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
