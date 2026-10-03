import React from 'react';

interface NavbarProps {
  currentPage: 'home' | 'analyze' | 'jobs';
  hasCandidateProfile: boolean;
  onNavigate: (page: 'home' | 'analyze' | 'jobs') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, hasCandidateProfile, onNavigate }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg p-1 text-left"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-teal-900 text-white shadow-sm shadow-teal-900/20">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.75h7l4 4v12.5H7a2 2 0 0 1-2-2v-12.5a2 2 0 0 1 2-2Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 3.75v4h4m-9.5 5 1.5 1.5 3.5-3.5" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-slate-900 text-base tracking-tight">TalentMatch</span>
          </div>
        </button>

        {/* Navigation Action */}
        {currentPage !== 'home' && (
        <nav aria-label="Main Navigation" className="flex items-center gap-3">
          {currentPage === 'jobs' ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate('analyze')}
                className="text-xs font-semibold text-teal-800 hover:text-teal-900 px-3 py-1.5 rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Back to Analysis
              </button>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Home
              </button>
            </>
          ) : currentPage === 'analyze' ? (
            <>
              {hasCandidateProfile && (
                <button
                  type="button"
                  onClick={() => onNavigate('jobs')}
                  className="text-xs font-semibold text-teal-800 hover:text-teal-900 px-3 py-1.5 rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  Related Jobs
                </button>
              )}
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('analyze')}
              className="text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 px-3.5 py-1.5 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Start Analysis
            </button>
          )}
        </nav>
        )}
      </div>
    </header>
  );
};
