import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
      <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">
        Start by uploading a resume and adding a job description.
      </h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto">
        Paste your resume and job requirements above to receive an evidence-based match analysis and upskilling roadmap.
      </p>
    </div>
  );
};
