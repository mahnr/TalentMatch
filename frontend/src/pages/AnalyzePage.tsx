import React, { useState } from 'react';
import { analyzeResume } from '../services/api';
import { AnalyzeResponse, AnalysisError, CandidateProfile } from '../types/analysis';
import { HowItWorks } from '../components/HowItWorks';
import { ResumeNote } from '../components/ResumeNote';
import { MatchScoreCard } from '../components/MatchScoreCard';
import { SkillMatchingSection } from '../components/SkillMatchingSection';
import { PersonalizedLearningPlan } from '../components/PersonalizedLearningPlan';
import { StrongMatchBanner } from '../components/StrongMatchBanner';
import { RecheckModal } from '../components/RecheckModal';
import { ExperienceEducationAssessment } from '../components/ExperienceEducationAssessment';
import { StrengthsSection } from '../components/StrengthsSection';
import { ExplanationSection } from '../components/ExplanationSection';
import { WhatToDoNext } from '../components/WhatToDoNext';
import { EmptyState } from '../components/EmptyState';
import { ErrorBanner } from '../components/ErrorBanner';

const SAMPLE_RESUME = `Muhammad Faizan
Software Engineer & Backend Specialist
Email: faizan@example.com | GitHub: github.com/faizan | LinkedIn: linkedin.com/in/faizan

Professional Summary:
Backend Engineer with 3+ years of experience designing and scaling web services, RESTful APIs, and microservices in Python (FastAPI, Flask) and Node.js. Skilled in PostgreSQL, database schema optimization, Redis caching, and Docker containerization.

Technical Skills:
- Languages: Python, JavaScript, TypeScript, SQL
- Frameworks: FastAPI, Flask, React
- Databases: PostgreSQL, MySQL, Redis
- Tools & Cloud: Docker, Git, Linux, GitHub Actions, AWS (S3, EC2)

Experience:
Backend Developer | NexaTech Solutions (2022 - Present)
- Designed and maintained 15+ REST API endpoints using FastAPI and PostgreSQL, serving 50k+ daily requests.
- Containerized development and staging environments with Docker and Docker Compose.
- Implemented Redis caching layers to reduce database query latency by 35%.

Education:
Bachelor of Science in Computer Science
Virtual University (Graduated 2022)`;

const SAMPLE_JOB = `Senior Python Backend Developer
Location: Remote | Full-Time

About the Role:
We are looking for a skilled Backend Developer to architect resilient web services and data pipelines. You will collaborate with cross-functional teams to build high-throughput APIs.

Required Qualifications:
- 3+ years of hands-on experience with Python backend development.
- Strong proficiency with FastAPI or Flask, RESTful API architecture, and database design (PostgreSQL).
- Experience with Docker containerization.
- Hands-on experience with Kubernetes orchestration and cloud deployments.
- Solid understanding of Git and CI/CD pipelines.

Preferred Qualifications:
- Familiarity with TypeScript and React.
- Degree in Computer Science or equivalent practical experience.`;

interface AnalyzePageProps {
  onCandidateProfileChange: (profile: CandidateProfile | null) => void;
  onViewJobs: () => void;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({
  onCandidateProfileChange,
  onViewJobs,
}) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<AnalysisError | null>(null);
  const [isRecheckOpen, setIsRecheckOpen] = useState(false);
  const [isDemoPromptOpen, setIsDemoPromptOpen] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!resumeText.trim() || !jobDescription.trim()) {
      setError({
        type: 'analysis_failed',
        message: 'Please provide both resume text and job description to run an analysis.',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await analyzeResume({
        resume_text: resumeText,
        job_description: jobDescription,
      });
      setAnalysisResult(data);
      onCandidateProfileChange(data.candidate_profile ?? null);
    } catch (err: any) {
      // Inputs are PRESERVED!
      if (err.type) {
        setError(err);
      } else {
        setError({
          type: 'analysis_failed',
          message: "We couldn't complete this analysis. Your information is still available. Try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeAnother = () => {
    // Clean input state
    setResumeText('');
    setJobDescription('');
    setAnalysisResult(null);
    setError(null);
    onCandidateProfileChange(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadSampleData = () => {
    setResumeText(SAMPLE_RESUME);
    setJobDescription(SAMPLE_JOB);
    setError(null);
    setIsDemoPromptOpen(false);
  };

  const isStrongMatch = analysisResult?.strong_match?.is_strong_match || (analysisResult?.match_score ?? 0) >= 80;

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Analyze Alignment & Requirements
        </h1>
        <p className="text-sm text-slate-600">
          Compare candidate resume evidence directly against job description requirements, identify skill gaps, and discover verified career opportunities.
        </p>
      </div>

      {/* How it works pipeline explanation */}
      <HowItWorks />

      {/* Input Form Section */}
      <section aria-labelledby="input-form-heading" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
          <h2 id="input-form-heading" className="text-base font-semibold text-slate-900">
            Candidate & Job Inputs
          </h2>
          <button
            type="button"
            onClick={() => setIsDemoPromptOpen((open) => !open)}
            disabled={isLoading}
            aria-expanded={isDemoPromptOpen}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Try a Demo
          </button>
        </div>

        {isDemoPromptOpen && (
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-teal-200 bg-teal-50/70 p-4">
            <p className="text-sm text-teal-950">
              Want to see how it works? Load an example resume and job description.
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={loadSampleData}
                className="rounded-lg bg-teal-700 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Load Demo
              </button>
              <button
                type="button"
                onClick={() => setIsDemoPromptOpen(false)}
                className="rounded-lg border border-teal-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Not now
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Resume Input */}
            <div className="space-y-1.5">
              <label htmlFor="resume-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Resume Content <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="resume-input"
                rows={10}
                required
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste candidate resume text here (skills, work experience, education)..."
                className="w-full text-xs font-mono p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white placeholder-slate-400"
              />
              <span className="text-[11px] text-slate-400 block">
                {resumeText.trim().length} characters entered
              </span>
            </div>

            {/* Job Description Input */}
            <div className="space-y-1.5">
              <label htmlFor="job-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Job Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="job-input"
                rows={10}
                required
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste target job requirements, skills, and qualifications here..."
                className="w-full text-xs font-mono p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white placeholder-slate-400"
              />
              <span className="text-[11px] text-slate-400 block">
                {jobDescription.trim().length} characters entered
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Evaluates demonstrated evidence. No personal data is stored.
            </span>
            <button
              type="submit"
              disabled={isLoading || !resumeText.trim() || !jobDescription.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Running Explainable Analysis...</span>
                </>
              ) : (
                <>
                  <span>Run Requirement Analysis</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Error state if request failed */}
      {error && (
        <ErrorBanner
          error={error}
          onRetry={() => handleSubmit()}
          isLoading={isLoading}
        />
      )}

      {/* Results Dashboard or Empty State */}
      {!analysisResult && !isLoading && !error && (
        <EmptyState />
      )}

      {analysisResult && (
        <div className="space-y-8 pt-2">
          {/* Dashboard Action Header */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Analysis & Review Dashboard
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evidence breakdown, personalized learning roadmap, and career discovery
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRecheckOpen(true)}
                className="text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 px-3.5 py-1.5 rounded-lg border border-teal-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center gap-1.5"
              >
                <span>↻</span>
                <span>Re-check My Resume</span>
              </button>
              <button
                type="button"
                onClick={onViewJobs}
                className="text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 px-3.5 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Related Jobs
              </button>
              <button
                type="button"
                onClick={handleAnalyzeAnother}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Analyze Another
              </button>
            </div>
          </div>

          {/* Section 1: ATS Resume Analysis (Match Score Card + Disclaimers) */}
          <MatchScoreCard
            score={analysisResult.match_score}
            confidence={analysisResult.confidence}
            summary={analysisResult.summary}
            matchLevel={analysisResult.match_level}
          />

          {/* Section 4: Strong Match Workflow (if strong match) */}
          {isStrongMatch && analysisResult.strong_match && (
            <StrongMatchBanner
              details={analysisResult.strong_match}
              onFindRelevantJobs={onViewJobs}
            />
          )}

          {/* Resume Evidence Informational Notice */}
          <ResumeNote />

          {/* Explainability Breakdown */}
          <ExplanationSection explanation={analysisResult.explanation} />

          {/* Section 2: Skill Gap Analysis (Required vs Preferred separated, with ✓ Match, △ Partial, ✗ Missing) */}
          <SkillMatchingSection
            requiredSkills={analysisResult.required_skills}
            preferredSkills={analysisResult.preferred_skills}
          />

          {/* Experience and Education Assessments */}
          <ExperienceEducationAssessment
            experience={analysisResult.experience_assessment}
            education={analysisResult.education_assessment}
          />

          {/* Demonstrated Strengths */}
          <StrengthsSection strengths={analysisResult.strengths} />

          {/* Section 3: Personalized Learning Plan */}
          <PersonalizedLearningPlan
            learningPlan={analysisResult.learning_plan || []}
            roadmap={analysisResult.learning_roadmap}
          />

          {/* Re-Check Resume Banner Prompt */}
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-teal-950 flex items-center gap-1.5">
                <span>↻</span> Ready to Re-check Your Progress?
              </h3>
              <p className="text-xs text-teal-800">
                After practicing and updating your resume with new project evidence, re-check your score to see resolved requirements.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsRecheckOpen(true)}
              className="shrink-0 px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            >
              Re-check My Resume
            </button>
          </div>

          {/* What to do next static recommendations */}
          <WhatToDoNext onAnalyzeAnother={handleAnalyzeAnother} />

          {/* Re-check Modal Component */}
          <RecheckModal
            isOpen={isRecheckOpen}
            onClose={() => setIsRecheckOpen(false)}
            originalResumeText={resumeText}
            jobDescription={jobDescription}
            previousMatchScore={analysisResult.match_score}
            previousMissingSkills={analysisResult.skill_gaps.map((g) => g.skill)}
            onApplyNewAnalysis={(newAnalysis) => {
              setAnalysisResult(newAnalysis);
              onCandidateProfileChange(newAnalysis.candidate_profile ?? null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}
    </div>
  );
};
