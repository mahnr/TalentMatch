import React, { useState, useEffect } from 'react';
import { searchJobs } from '../services/api';
import { JobOpportunity, CandidateProfile } from '../types/analysis';

interface JobDiscoverySectionProps {
  candidateProfile?: CandidateProfile;
  initialQuery?: string;
}

export const JobDiscoverySection: React.FC<JobDiscoverySectionProps> = ({
  candidateProfile,
  initialQuery,
}) => {
  const [query, setQuery] = useState(initialQuery || candidateProfile?.target_job_title || 'Python');
  const [location] = useState(candidateProfile?.location || 'Remote');
  const [workType, setWorkType] = useState('all');
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState('');

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await searchJobs({
        query: query,
        skills: candidateProfile?.skills || ['Python', 'FastAPI', 'Docker', 'PostgreSQL'],
        location: location,
        work_type: workType,
        experience_level: candidateProfile?.experience_level,
      });
      setJobs(resp.jobs);
      setDataSource(resp.data_source);
    } catch (err: any) {
      setError(err.message || 'Unable to retrieve live job listings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="job-discovery-section" aria-labelledby="job-discovery-heading" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="job-discovery-heading" className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Relevant Current Job Opportunities
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified, real job vacancies matched to your candidate profile and skill evidence
          </p>
        </div>

        {dataSource && (
          <span className="text-[11px] text-slate-400 font-mono bg-slate-50 px-2.5 py-1 rounded border border-slate-200 self-start sm:self-center">
            Source: {dataSource}
          </span>
        )}
      </div>

      {/* Search and Filters */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchJobs();
        }}
        className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200"
      >
        <div className="sm:col-span-2 space-y-1">
          <label htmlFor="job-query-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Target Role / Skill Query
          </label>
          <input
            id="job-query-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Python, Backend, Full Stack"
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="work-type-select" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Work Preference
          </label>
          <select
            id="work-type-select"
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="all">All Work Types</option>
            <option value="remote">Remote Only</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <span>Searching...</span>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Find Jobs</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchJobs}
            className="font-semibold underline hover:text-rose-950 ml-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="py-12 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Querying live job feeds and matching your qualifications...</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && jobs.length === 0 && (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <p className="text-sm font-semibold text-slate-700">No active job postings matched your exact query.</p>
          <p className="text-xs text-slate-500">Try broadening your search term or switching the work preference to "All Work Types".</p>
        </div>
      )}

      {/* Job Cards List */}
      {!isLoading && jobs.length > 0 && (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border border-slate-200 rounded-xl p-5 bg-white hover:border-teal-300 hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {job.company_name}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                      job.work_type === 'Remote'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : job.work_type === 'Hybrid'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {job.work_type}
                    </span>
                    {job.posting_date && (
                      <span className="text-[11px] text-slate-400">
                        Posted: {job.posting_date}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{job.job_title}</h3>
                  <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    📍 {job.location}
                  </span>
                </div>

                <a
                  href={job.application_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <span>Apply Now</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              {/* Why the candidate matches */}
              <div className="bg-teal-50/70 border border-teal-200/80 rounded-lg p-3 text-xs flex items-start gap-2">
                <span className="text-teal-700 font-bold">✓</span>
                <div>
                  <span className="font-bold text-teal-950 uppercase tracking-wider block mb-0.5">
                    Why You Match:
                  </span>
                  <span className="text-teal-900 leading-relaxed">{job.why_matched}</span>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-slate-500 text-[11px] mr-1">Required Skills:</span>
                  {job.required_skills.map((skill, sIdx) => (
                    <span key={sIdx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>

                {job.missing_or_preferred_skills && job.missing_or_preferred_skills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
                    <span className="text-slate-400">Bonus/Gaps:</span>
                    <span className="text-amber-700 font-medium">
                      {job.missing_or_preferred_skills.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
