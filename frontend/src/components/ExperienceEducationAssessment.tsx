import React from 'react';
import { AssessmentDetail } from '../types/analysis';

interface ExperienceEducationAssessmentProps {
  experience: AssessmentDetail;
  education: AssessmentDetail;
}

export const ExperienceEducationAssessment: React.FC<ExperienceEducationAssessmentProps> = ({
  experience,
  education,
}) => {
  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'demonstrated') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
          Demonstrated
        </span>
      );
    }
    if (s === 'partial') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
          Partial
        </span>
      );
    }
    if (s === 'unknown') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
          Unknown
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300">
        Insufficient
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Experience Assessment */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Experience Assessment
          </h3>
          <div>{renderStatusBadge(experience?.status)}</div>
        </div>
        <div className="text-xs space-y-1">
          <span className="font-semibold text-slate-500 uppercase tracking-wider block">
            Evidence:
          </span>
          <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
            {experience?.evidence || 'No experience details available.'}
          </p>
        </div>
      </div>

      {/* Education Assessment */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
            Education Assessment
          </h3>
          <div>{renderStatusBadge(education?.status)}</div>
        </div>
        <div className="text-xs space-y-1">
          <span className="font-semibold text-slate-500 uppercase tracking-wider block">
            Evidence:
          </span>
          <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
            {education?.evidence || 'No education details available.'}
          </p>
        </div>
      </div>
    </div>
  );
};
