import React from 'react';
import { CompanyDiscoverySection } from '../components/CompanyDiscoverySection';
import { JobDiscoverySection } from '../components/JobDiscoverySection';
import { CandidateProfile } from '../types/analysis';

interface JobsPageProps {
  candidateProfile: CandidateProfile | null;
}

export const JobsPage: React.FC<JobsPageProps> = ({ candidateProfile }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Jobs for Your Profile
        </h1>
        <p className="text-sm text-slate-600">
          Explore roles matched to the skills and experience from your resume.
        </p>
      </header>

      {candidateProfile ? (
        <>
          <JobDiscoverySection
            candidateProfile={candidateProfile}
            initialQuery={candidateProfile.target_job_title}
          />
          <CompanyDiscoverySection />
        </>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Analyze your resume first</h2>
          <p className="mt-2 text-sm text-slate-600">
            Run an analysis to find jobs matched to your resume.
          </p>
        </section>
      )}
    </div>
  );
};
