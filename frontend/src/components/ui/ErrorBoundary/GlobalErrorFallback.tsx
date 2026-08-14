import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface GlobalErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function GlobalErrorFallback({ error, resetErrorBoundary }: GlobalErrorFallbackProps) {
  // We use standard window.location as fallback if navigate isn't available due to router context death
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10" />
        </div>
        
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Something went wrong</h1>
          <p className="text-sm font-medium text-gray-500 mt-2">
            An unexpected error occurred in the application. Our technical team has been notified.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-left border border-gray-200 overflow-x-auto">
          <p className="text-xs font-mono text-red-600 break-words">
            {error.message || 'Unknown runtime error'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button 
            onClick={resetErrorBoundary}
            className="flex-1 h-12 bg-gray-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-md"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <button 
            onClick={handleGoHome}
            className="flex-1 h-12 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" /> Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
