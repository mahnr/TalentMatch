import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { JobsPage } from './pages/JobsPage';
import { CandidateProfile } from './types/analysis';

export const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);

  // Sync page state with window.location.pathname or hash for simple reliable routing
  const [currentPage, setCurrentPage] = useState<'home' | 'analyze' | 'jobs'>(() => {
    const path = window.location.pathname;
    if (path.includes('/jobs')) return 'jobs';
    if (path.includes('/analyze')) return 'analyze';
    return 'home';
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setIsBooting(false), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('/jobs')) {
        setCurrentPage('jobs');
      } else if (path.includes('/analyze')) {
        setCurrentPage('analyze');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: 'home' | 'analyze' | 'jobs') => {
    setCurrentPage(page);
    const targetUrl = page === 'analyze' ? '/analyze' : page === 'jobs' ? '/jobs' : '/';
    window.history.pushState({}, '', targetUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isBooting) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0fdfa,_#f8fafc_40%,_#eef2ff_100%)] flex items-center justify-center px-4">
        <div className="relative flex flex-col items-center">
          <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-[30%] border border-teal-200 bg-white/80 shadow-[0_20px_60px_rgba(13,148,136,0.18)] backdrop-blur-md">
            <div className="absolute inset-2 rounded-[28%] bg-gradient-to-br from-teal-500 via-emerald-400 to-cyan-400 opacity-15" />
            <div className="relative flex items-center justify-center text-3xl font-black tracking-tight text-teal-700">
              T
              <span className="text-slate-800">M</span>
            </div>
            <div className="absolute -bottom-2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-teal-500 shadow-[0_0_18px_rgba(20,184,166,0.8)] animate-pulse" />
          </div>

          <div className="mb-2 text-center">
            <div className="text-lg font-extrabold tracking-[0.24em] text-slate-800">TALENTMATCH</div>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0ms]" />
            <span className="h-2 w-2 rounded-full bg-teal-500 animate-bounce [animation-delay:150ms]" />
            <span className="h-2 w-2 rounded-full bg-teal-500 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar
        currentPage={currentPage}
        hasCandidateProfile={candidateProfile !== null}
        onNavigate={navigateTo}
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {currentPage === 'home' && (
          <LandingPage onStartAnalysis={() => navigateTo('analyze')} />
        )}
        <div className={currentPage === 'analyze' ? '' : 'hidden'}>
          <AnalyzePage
            onCandidateProfileChange={setCandidateProfile}
            onViewJobs={() => navigateTo('jobs')}
          />
        </div>
        {currentPage === 'jobs' && (
          <JobsPage candidateProfile={candidateProfile} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-1">
          <p className="font-medium text-slate-700">
            TalentMatch AI — Evidence-Based Candidate Qualification Alignment
          </p>
          <p className="text-slate-400">
            Evaluates demonstrated resume evidence against job requirements. Not a hiring prediction.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
