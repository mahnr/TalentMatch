import React from 'react';

interface MatchScoreCardProps {
  score: number;
  confidence: string;
  summary: string;
  matchLevel?: string;
}

export const MatchScoreCard: React.FC<MatchScoreCardProps> = ({
  score,
  confidence,
  summary,
  matchLevel,
}) => {
  // Confidence badge color mapping
  const confLower = confidence.toLowerCase();
  const confStyle = 
    confLower === 'high' 
      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
      : confLower === 'medium'
      ? 'bg-amber-50 text-amber-800 border-amber-300'
      : 'bg-rose-50 text-rose-800 border-rose-300';

  // Overall match level badge
  const levelText = matchLevel || (score >= 80 ? 'Strong Match' : score >= 60 ? 'Moderate Match' : 'Low Match');
  const levelStyle =
    score >= 80
      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
      : score >= 60
      ? 'bg-amber-100 text-amber-900 border-amber-300'
      : 'bg-rose-100 text-rose-900 border-rose-300';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Requirement Match Score Block */}
        <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-slate-100 pb-5 md:pb-0 md:pr-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Requirement Match Score
            </span>
          </div>
          <div className="flex items-baseline justify-center md:justify-start gap-3">
            <span className="text-5xl font-extrabold text-teal-800 tracking-tight">{score}%</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${levelStyle}`}>
              {levelText}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Based on the requirements provided in this job description.
          </p>
          <p className="text-xs text-slate-400 mt-1 italic">
            This is not a prediction of hiring or employment.
          </p>
        </div>

        {/* Confidence Block & Summary */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">Analysis Confidence:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${confStyle}`}>
                {confidence}
              </span>
            </div>
            <span className="text-xs text-slate-500 italic">
              Confidence reflects the completeness and clarity of the evidence provided.
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3.5">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400 block mb-1">
              Assessment Summary
            </span>
            <p className="text-sm text-slate-700 leading-relaxed">
              {summary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
