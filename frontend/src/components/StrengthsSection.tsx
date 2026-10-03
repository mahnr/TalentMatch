import React from 'react';

interface StrengthsSectionProps {
  strengths: string[];
}

export const StrengthsSection: React.FC<StrengthsSectionProps> = ({ strengths }) => {
  const hasStrengths = strengths && strengths.length > 0;

  return (
    <section aria-labelledby="strengths-heading" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="pb-3 border-b border-slate-100 mb-3 flex items-center justify-between">
        <h2 id="strengths-heading" className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Demonstrated Strengths
        </h2>
        {hasStrengths && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            {strengths.length} Evidenced
          </span>
        )}
      </div>

      {!hasStrengths ? (
        <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded border border-slate-100">
          No specific strengths were identified from the provided information.
        </p>
      ) : (
        <ul className="space-y-2 text-xs">
          {strengths.map((str, idx) => (
            <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50/40 border border-emerald-100/70 text-slate-800">
              <span className="text-emerald-600 font-bold mt-0.5 shrink-0">✓</span>
              <span className="leading-relaxed">{str}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
