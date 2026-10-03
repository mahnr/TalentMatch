import React from 'react';
import { UpskillingItem } from '../types/analysis';

interface UpskillingPlanSectionProps {
  plan: UpskillingItem[];
}

export const UpskillingPlanSection: React.FC<UpskillingPlanSectionProps> = ({ plan }) => {
  if (!plan || plan.length === 0) {
    return (
      <section aria-labelledby="upskilling-heading" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 id="upskilling-heading" className="text-lg font-semibold text-slate-900 mb-2">
          Upskilling Plan
        </h2>
        <p className="text-sm text-slate-500 italic">
          No upskilling recommendations generated for this analysis.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="upskilling-heading" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="pb-4 border-b border-slate-100 mb-4">
        <h2 id="upskilling-heading" className="text-lg font-semibold text-slate-900">
          Upskilling Plan
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Sequential roadmap designed to close identified skill gaps
        </p>
      </div>

      <div className="space-y-4">
        {plan.map((item, index) => {
          const sequenceNumber = String(item.order || index + 1).padStart(2, '0');
          const priority = item.priority || 'Medium';

          const priorityStyle =
            priority.toLowerCase() === 'high'
              ? 'bg-rose-50 text-rose-800 border-rose-300'
              : priority.toLowerCase() === 'medium'
              ? 'bg-amber-50 text-amber-800 border-amber-300'
              : 'bg-slate-50 text-slate-700 border-slate-300';

          return (
            <div
              key={`${item.skill}-${index}`}
              className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors"
            >
              {/* Sequence Number */}
              <div className="flex sm:flex-col items-center justify-center shrink-0 w-12 h-12 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-bold text-lg">
                {sequenceNumber}
              </div>

              {/* Content */}
              <div className="flex-1 w-full space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-slate-900">
                    {item.skill}
                  </h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${priorityStyle}`}>
                    {priority} Priority
                  </span>
                </div>

                <div className="text-xs space-y-1.5 pt-1">
                  <div>
                    <span className="font-semibold text-slate-500 uppercase tracking-wider block">
                      Why:
                    </span>
                    <p className="text-slate-700 leading-relaxed mt-0.5">
                      {item.why}
                    </p>
                  </div>

                  <div className="pt-1">
                    <span className="font-semibold text-teal-700 uppercase tracking-wider block">
                      Suggested action:
                    </span>
                    <p className="text-slate-800 bg-slate-50 p-2.5 rounded border border-slate-200/70 leading-relaxed mt-0.5 font-medium">
                      {item.suggested_action}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
