import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    { label: 'Resume', desc: 'Provided candidate experience' },
    { label: 'Job Requirements', desc: 'Target role competencies' },
    { label: 'Evidence-Based Matching', desc: 'Direct proof comparison' },
    { label: 'Skill Gaps', desc: 'Identified missing requirements' },
    { label: 'Upskilling Plan', desc: 'Sequential action steps' },
  ];

  return (
    <section aria-label="How the analysis works" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
        Analysis Methodology
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50 border border-slate-100 h-full justify-center">
              <span className="text-xs font-bold text-teal-700 mb-1">0{idx + 1}</span>
              <span className="text-sm font-semibold text-slate-800">{step.label}</span>
              <span className="text-xs text-slate-500 mt-0.5 leading-snug">{step.desc}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className="hidden sm:flex justify-center text-slate-400" aria-hidden="true">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};
