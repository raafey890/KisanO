import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const FormInput = React.forwardRef(
  (
    {
      label,
      type = 'text',
      error,
      icon: Icon,
      placeholder,
      disabled,
      required,
      className = '',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';
    const computedType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={`w-full flex flex-col ${className}`}>
        {label && (
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>
              {label} {required && <span className="text-green-400">*</span>}
            </span>
          </label>
        )}

        <div className="relative flex items-center w-full">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center justify-center z-10">
              <Icon className="w-5 h-5" />
            </div>
          )}

          <input
            ref={ref}
            type={computedType}
            disabled={disabled}
            placeholder={placeholder}
            style={{
              paddingLeft: Icon ? '48px' : '16px',
              paddingRight: isPasswordType ? '48px' : '16px',
            }}
            className={`w-full h-[50px] bg-gray-900/90 text-white placeholder-gray-500 text-sm font-medium rounded-xl border ${
              error
                ? 'border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-white/10 focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20'
            } transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
            {...props}
          />

          {isPasswordType && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 flex items-center justify-center z-10"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>

        {error && (
          <span className="text-xs font-medium text-red-400 mt-1.5 animate-fadeIn">
            {error.message || error}
          </span>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
