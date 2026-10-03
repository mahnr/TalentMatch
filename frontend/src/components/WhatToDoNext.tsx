import React from 'react';

interface WhatToDoNextProps {
  onAnalyzeAnother: () => void;
}

export const WhatToDoNext: React.FC<WhatToDoNextProps> = ({ onAnalyzeAnother }) => {
  const steps = [
    {
      title: 'Review your highest-priority skill gaps',
      desc: 'Focus first on required skills flagged with high priority where project evidence was missing.',
    },
    {
      title: 'Work through the suggested upskilling actions',
      desc: 'Follow the sequential roadmap to build hands-on projects or complete recommended exercises.',
    },
    {
      title: 'Update your resume when you have genuine new evidence',
      desc: 'Once you demonstrate the missing competencies through practical work, add explicit evidence to your resume.',
    },
    {
      title: 'Run another analysis against a different job description',
      desc: 'Compare how your current profile matches across multiple roles in your target field.',
    },
  ];

  return (
    <section aria-labelledby="next-steps-heading" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="pb-3 border-b border-slate-100 mb-4">
        <h2 id="next-steps-heading" className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          What to do next
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Recommended product steps to maximize your application readiness
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {steps.map((step, idx) => (
          <div key={idx} className="p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50">
            <span className="text-xs font-bold text-teal-700 block mb-1">Step {idx + 1}</span>
            <h3 className="text-xs font-semibold text-slate-900">{step.title}</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-slate-500">
          Ready to evaluate another role or updated resume?
        </span>
        <button
          type="button"
          onClick={onAnalyzeAnother}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Analyze Another Resume
        </button>
      </div>
    </section>
  );
};
