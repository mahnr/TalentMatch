import React from 'react';
import { AnalysisError } from '../types/analysis';

interface ErrorBannerProps {
  error: AnalysisError;
  onRetry: () => void;
  isLoading: boolean;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onRetry, isLoading }) => {
  const isUnavailable = error.type === 'network_unavailable';

  return (
    <div 
      role="alert" 
      className="bg-rose-50 border border-rose-200 rounded-xl p-5 my-4 text-rose-900 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            {isUnavailable ? (
              <>
                <h3 className="text-sm font-bold text-rose-950">
                  The analysis service is unavailable.
                </h3>
                <p className="text-xs text-rose-800 mt-0.5">
                  Make sure the backend is running and try again.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-sm font-bold text-rose-950">
                  We couldn't complete this analysis.
                </h3>
                <p className="text-xs text-rose-800 mt-0.5">
                  Your information is still available. Try again.
                </p>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onRetry}
          disabled={isLoading}
          className="shrink-0 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Retrying...' : 'Try Again'}
        </button>
      </div>
    </div>
  );
};
