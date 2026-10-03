import React from 'react';
import { SkillMatch } from '../types/analysis';

interface SkillMatchingSectionProps {
  requiredSkills: SkillMatch[];
  preferredSkills?: SkillMatch[];
}

export const SkillMatchingSection: React.FC<SkillMatchingSectionProps> = ({
  requiredSkills,
  preferredSkills = [],
}) => {
  const allSkills = [...requiredSkills, ...preferredSkills];

  if (!allSkills || allSkills.length === 0) {
    return (
      <section aria-labelledby="skills-heading" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 id="skills-heading" className="text-base font-semibold text-slate-900 mb-2">
          Skill Gap Analysis
        </h2>
        <p className="text-sm text-slate-500 italic">
          No specific skills were extracted from the provided information.
        </p>
      </section>
    );
  }

  const renderStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'match' || s === 'matched') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
          <span className="text-emerald-700 font-bold">✓</span>
          Match
        </span>
      );
    }
    if (s === 'partial match' || s === 'partial') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
          <span className="text-amber-700 font-bold">△</span>
          Partial Match
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300">
        <span className="text-rose-700 font-bold">✗</span>
        Missing
      </span>
    );
  };

  const renderSkillGroup = (skills: SkillMatch[], title: string, subtitle: string, badgeColor: string) => {
    if (!skills || skills.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{title}</h3>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${badgeColor}`}>
              {skills.length} Items
            </span>
          </div>
          <span className="text-xs text-slate-500">{subtitle}</span>
        </div>

        <div className="space-y-2.5">
          {skills.map((skill, index) => {
            const isMissing = skill.status.toLowerCase() === 'missing' || skill.status.toLowerCase() === 'gap';
            const isPartial = skill.status.toLowerCase().includes('partial');

            return (
              <div
                key={`${skill.name}-${index}`}
                className={`p-3.5 rounded-lg border transition-all ${
                  isMissing
                    ? 'border-rose-200/80 bg-rose-50/25'
                    : isPartial
                    ? 'border-amber-200/80 bg-amber-50/25'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">{skill.name}</span>
                    {skill.already_present ? (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium border border-emerald-200">
                        Present in Resume
                      </span>
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-medium border border-rose-200">
                        Not in Resume
                      </span>
                    )}
                  </div>
                  <div>{renderStatusBadge(skill.status)}</div>
                </div>

                {/* Evidence and Explanation of why it matters */}
                <div className="text-xs pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                  <span className="font-semibold uppercase tracking-wider text-slate-500 shrink-0 sm:w-20">
                    {isMissing ? 'Gap Detail:' : 'Evidence:'}
                  </span>
                  <span className={`leading-relaxed ${isMissing ? 'text-rose-900 font-medium' : 'text-slate-700'}`}>
                    {skill.evidence}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section aria-labelledby="skills-heading" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-5">
        <div>
          <h2 id="skills-heading" className="text-lg font-semibold text-slate-900">
            Skill Gap Analysis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent comparison separating core required qualifications from preferred bonus skills
          </p>
        </div>

        {/* Visual Legend */}
        <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Match</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-600 font-bold">△</span>
            <span>Partial Match</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-rose-600 font-bold">✗</span>
            <span>Missing</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Required Skills Section */}
        {renderSkillGroup(
          requiredSkills,
          'Required Skills & Qualifications',
          'Must-have capabilities for this role',
          'bg-rose-100 text-rose-800'
        )}

        {/* Preferred Skills Section */}
        {preferredSkills && preferredSkills.length > 0 && renderSkillGroup(
          preferredSkills,
          'Preferred & Bonus Qualifications',
          'Nice-to-have secondary skills',
          'bg-slate-100 text-slate-700'
        )}
      </div>
    </section>
  );
};
