import React from 'react';
import { StrongMatchDetails } from '../types/analysis';

interface StrongMatchBannerProps {
  details: StrongMatchDetails;
  onFindRelevantJobs: () => void;
}

export const StrongMatchBanner: React.FC<StrongMatchBannerProps> = ({
  details,
  onFindRelevantJobs,
}) => {
  return (
    <section aria-labelledby="strong-match-heading" className="bg-gradient-to-r from-teal-900 to-teal-800 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-teal-700/60">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            High Candidate Readiness
          </div>
          <h2 id="strong-match-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {details.headline || "You're a strong match for this role."}
          </h2>
          <p className="text-xs sm:text-sm text-teal-200">
            Your provided resume shows verified evidence across the core technical competencies required for this role.
          </p>
        </div>

        <button
          type="button"
          onClick={onFindRelevantJobs}
          className="shrink-0 px-5 py-3 rounded-xl bg-white hover:bg-teal-50 text-teal-900 font-bold text-xs shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all flex items-center gap-2"
        >
          <span>Find Relevant Jobs</span>
          <svg className="w-4 h-4 text-teal-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
        {/* Matching Skills */}
        <div className="bg-teal-950/40 border border-teal-700/50 rounded-xl p-4 space-y-2">
          <h3 className="font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>✓</span> Matching Skills
          </h3>
          <ul className="space-y-1 text-teal-100">
            {details.matching_skills.map((skill, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                <span className="text-emerald-400 text-xs">•</span>
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Matching Qualifications */}
        <div className="bg-teal-950/40 border border-teal-700/50 rounded-xl p-4 space-y-2">
          <h3 className="font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>✓</span> Qualifications & Education
          </h3>
          <ul className="space-y-1.5 text-teal-100">
            {details.matching_qualifications.map((qual, idx) => (
              <li key={idx} className="leading-relaxed">
                {qual}
              </li>
            ))}
          </ul>
        </div>

        {/* Relevant Experience & Minor Gaps */}
        <div className="bg-teal-950/40 border border-teal-700/50 rounded-xl p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-bold text-teal-300 uppercase tracking-wider">
              Relevant Projects & Experience
            </h3>
            <p className="text-teal-100 leading-relaxed">
              {details.relevant_projects_or_experience.join(' ')}
            </p>
          </div>

          {details.minor_gaps && details.minor_gaps.length > 0 && (
            <div className="pt-2 border-t border-teal-700/50">
              <span className="text-amber-300 font-semibold block mb-1">
                Remaining Minor Gaps:
              </span>
              <div className="flex flex-wrap gap-1">
                {details.minor_gaps.map((gap, gIdx) => (
                  <span key={gIdx} className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-400/30 text-[11px]">
                    {gap}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
