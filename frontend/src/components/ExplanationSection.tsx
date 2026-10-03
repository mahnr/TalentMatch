import React, { useState } from 'react';

interface ExplanationSectionProps {
  explanation: string;
}

export const ExplanationSection: React.FC<ExplanationSectionProps> = ({ explanation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // If text is short (< 280 chars), we don't need expand/collapse
  const isLong = (explanation || '').length > 280;
  const displayText = isLong && !isExpanded 
    ? `${explanation.slice(0, 260)}...` 
    : explanation;

  return (
    <section aria-labelledby="explanation-heading" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <h2 id="explanation-heading" className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Why this result?
        </h2>
        <span className="text-xs text-slate-400 font-medium">Explainable Analysis</span>
      </div>

      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4">
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {displayText}
        </p>

        {isLong && (
          <div className="mt-3 pt-2 border-t border-slate-200/60">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded px-1 py-0.5 inline-flex items-center gap-1 transition-colors"
            >
              {isExpanded ? (
                <>
                  <span>Show less</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Read full explanation</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
