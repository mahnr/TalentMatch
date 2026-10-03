import React from 'react';

export const ResumeNote: React.FC = () => {
  return (
    <div className="bg-teal-50/70 border border-teal-200/80 rounded-lg p-4 text-sm text-teal-900 flex items-start gap-3 my-4">
      <div className="text-teal-600 font-bold shrink-0 mt-0.5">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <span className="font-semibold text-teal-950">Important:</span>{' '}
        A skill may be missing from this analysis simply because it was not demonstrated in the provided resume.
      </div>
    </div>
  );
};
