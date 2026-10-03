import React, { useState } from 'react';
import { recheckResume } from '../services/api';
import { RecheckResponse, AnalyzeResponse } from '../types/analysis';

interface RecheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalResumeText: string;
  jobDescription: string;
  previousMatchScore: number;
  previousMissingSkills: string[];
  onApplyNewAnalysis: (newAnalysis: AnalyzeResponse) => void;
}

export const RecheckModal: React.FC<RecheckModalProps> = ({
  isOpen,
  onClose,
  originalResumeText,
  jobDescription,
  previousMatchScore,
  previousMissingSkills,
  onApplyNewAnalysis,
}) => {
  const [updatedResume, setUpdatedResume] = useState(originalResumeText);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRecheckSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatedResume.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const resp = await recheckResume({
        original_resume_text: originalResumeText,
        updated_resume_text: updatedResume,
        job_description: jobDescription,
        previous_match_score: previousMatchScore,
        previous_missing_skills: previousMissingSkills,
      });
      setResult(resp);
    } catch (err: any) {
      setError(err.message || 'Unable to re-check resume. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (result) {
      onApplyNewAnalysis(result.analysis);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold">
              ↻
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Re-check My Resume</h2>
              <p className="text-xs text-slate-500">
                Measure score progress after learning missing skills or updating project evidence
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Previous Baseline Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-slate-500 font-medium">Previous Match Score:</span>
            <span className="ml-1.5 font-bold text-slate-900 text-sm">{previousMatchScore}%</span>
          </div>
          {previousMissingSkills && previousMissingSkills.length > 0 && (
            <div className="text-slate-600">
              <span className="font-medium text-slate-500">Targeting gaps:</span>{' '}
              <span className="font-semibold text-rose-700">{previousMissingSkills.slice(0, 3).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        {!result && (
          <form onSubmit={handleRecheckSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="updated-resume" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Updated Resume Content (Add your new projects & skills)
              </label>
              <textarea
                id="updated-resume"
                rows={9}
                value={updatedResume}
                onChange={(e) => setUpdatedResume(e.target.value)}
                placeholder="Paste your improved resume here with newly acquired competencies..."
                className="w-full text-xs font-mono p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-800">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Comparing Re-check...</span>
                  </>
                ) : (
                  <span>Run Re-Check Analysis</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Results Comparison View */}
        {result && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Score Comparison Display */}
            <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 flex flex-wrap items-center justify-around gap-4 text-center">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase block">Previous Match</span>
                <span className="text-2xl font-bold text-slate-700">{result.previous_match_score}%</span>
              </div>
              <div className="text-slate-400 font-bold text-xl">→</div>
              <div>
                <span className="text-[11px] font-semibold text-teal-800 uppercase block">New Match</span>
                <span className="text-3xl font-extrabold text-teal-900">{result.new_match_score}%</span>
              </div>
              <div className="pl-3 border-l border-teal-200">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  result.score_delta > 0
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : result.score_delta < 0
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {result.score_delta >= 0 ? `+${result.score_delta}% Progress` : `${result.score_delta}%`}
                </span>
              </div>
            </div>

            {/* Resolved Requirements */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                Resolved Requirements ({result.resolved_requirements.length})
              </h3>
              {result.resolved_requirements.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.resolved_requirements.map((resSkill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-300"
                    >
                      <span className="text-emerald-700 font-bold">✓</span>
                      {resSkill}
                      <span className="text-[10px] text-emerald-700 font-normal">Newly Evidenced!</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded border border-slate-200">
                  No previously flagged gaps were resolved in this edit. Make sure to explicitly document the missing skills in projects or skills section.
                </p>
              )}
            </div>

            {/* Remaining Gaps */}
            {result.remaining_gaps.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Remaining Gaps to Work On ({result.remaining_gaps.length})
                </h3>
                <div className="flex flex-wrap gap-1.5 text-xs text-slate-700">
                  {result.remaining_gaps.map((gap, gIdx) => (
                    <span key={gIdx} className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-xs">
                      {gap}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setResult(null)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                Edit Resume Again
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
              >
                Apply New Analysis to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
