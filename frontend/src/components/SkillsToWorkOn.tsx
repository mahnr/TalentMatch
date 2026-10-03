import React from 'react';
import { SkillGap, UpskillingItem } from '../types/analysis';

interface SkillsToWorkOnProps {
  gaps: SkillGap[];
  upskillingPlan: UpskillingItem[];
}

export const SkillsToWorkOn: React.FC<SkillsToWorkOnProps> = ({ gaps, upskillingPlan }) => {
  if (!gaps || gaps.length === 0) {
    return (
      <section aria-labelledby="gaps-heading" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 id="gaps-heading" className="text-lg font-semibold text-slate-900 mb-2">
          Skills to Work On
        </h2>
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-4 text-emerald-900 text-sm">
          No specific skill gaps were identified from the provided information.
        </div>
      </section>
    );
  }

  // Helper to find matching upskilling item
  const findUpskillingMatch = (skillName: string) => {
    return upskillingPlan.find(
      (item) => item.skill.toLowerCase() === skillName.toLowerCase()
    );
  };

  return (
    <section aria-labelledby="gaps-heading" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="pb-4 border-b border-slate-100 mb-4">
        <h2 id="gaps-heading" className="text-lg font-semibold text-slate-900">
          Skills to Work On
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Priority areas where requirement evidence was missing or insufficient in the resume
        </p>
      </div>

      <div className="space-y-4">
        {gaps.map((gap, index) => {
          const upskillingMatch = findUpskillingMatch(gap.skill);
          const priority = gap.priority || upskillingMatch?.priority || 'Medium';
          const nextStep = gap.next_step || upskillingMatch?.suggested_action;

          const priorityBadge = 
            priority.toLowerCase() === 'high'
              ? 'bg-rose-100 text-rose-800 border-rose-300'
              : priority.toLowerCase() === 'medium'
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : 'bg-slate-100 text-slate-700 border-slate-300';

          return (
            <div
              key={`${gap.skill}-${index}`}
              className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 text-base">{gap.skill}</h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {gap.importance ? `${gap.importance} skill` : 'Required skill'} • <span className="text-rose-600 font-semibold">Gap</span>
                  </span>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${priorityBadge}`}>
                  {priority} Priority
                </span>
              </div>

              {/* Why it matters */}
              <div className="mt-3 text-xs leading-relaxed">
                <span className="font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Why it matters:
                </span>
                <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200/80">
                  {gap.reason}
                </p>
              </div>

              {/* Visually connected Next Step if available */}
              {nextStep && (
                <div className="mt-2.5 text-xs">
                  <div className="flex items-start gap-2 bg-teal-50/70 border border-teal-200/80 rounded p-2.5">
                    <span className="font-semibold uppercase tracking-wider text-teal-800 shrink-0 mt-0.5">
                      Next step:
                    </span>
                    <span className="text-teal-950 leading-relaxed">
                      {nextStep}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
