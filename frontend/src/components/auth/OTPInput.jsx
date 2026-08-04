import React, { useRef, useState, useEffect } from 'react';

export default function OTPInput({ length = 6, onChange, onComplete, disabled }) {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const otpString = newOtp.join('');
    if (onChange) onChange(otpString);
    if (otpString.length === length && onComplete) {
      onComplete(otpString);
    }

    // Auto-focus next input box
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, length).split('');
    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      newOtp[i] = digit;
    });
    setOtp(newOtp);

    const otpString = newOtp.join('');
    if (onChange) onChange(otpString);
    if (otpString.length === length && onComplete) {
      onComplete(otpString);
    }

    const focusIndex = Math.min(digits.length, length - 1);
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          disabled={disabled}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          aria-label={`OTP Digit ${index + 1}`}
          className={`w-11 h-13 sm:w-13 sm:h-14 text-center text-xl font-extrabold bg-gray-900 text-white rounded-xl border ${
            digit ? 'border-green-500 ring-2 ring-green-500/20' : 'border-white/10'
          } focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none transition-all disabled:opacity-50`}
        />
      ))}
    </div>
  );
}
