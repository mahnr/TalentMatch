import React from 'react';

interface LandingPageProps {
  onStartAnalysis: () => void;
}

const ResumeIllustration: React.FC = () => (
  <svg
    viewBox="0 0 560 440"
    role="img"
    aria-labelledby="resume-illustration-title"
    className="h-auto w-full"
  >
    <title id="resume-illustration-title">Resume skills connected to a visual job match report</title>
    <defs>
      <linearGradient id="heroGlow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ccfbf1" />
        <stop offset="100%" stopColor="#e0e7ff" />
      </linearGradient>
      <linearGradient id="scoreFill" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#0f766e" />
        <stop offset="100%" stopColor="#2dd4bf" />
      </linearGradient>
      <filter id="cardShadow" x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#0f172a" floodOpacity=".12" />
      </filter>
    </defs>

    <circle cx="280" cy="218" r="190" fill="url(#heroGlow)" />
    <circle cx="449" cy="81" r="28" fill="#fff" opacity=".75" />
    <circle cx="95" cy="330" r="20" fill="#fff" opacity=".65" />
    <path d="M75 173c35-45 75-68 121-69M375 357c49-14 83-40 105-78" fill="none" stroke="#5eead4" strokeWidth="2" strokeDasharray="4 9" />

    <g className="landing-float">
      <g filter="url(#cardShadow)" transform="rotate(-7 177 215)">
      <rect x="86" y="111" width="186" height="250" rx="18" fill="#fff" />
      <rect x="108" y="134" width="52" height="52" rx="16" fill="#ccfbf1" />
      <path d="M124 174c2-14 9-21 19-21s17 7 19 21" fill="#0f766e" opacity=".8" />
      <circle cx="143" cy="151" r="9" fill="#0f766e" />
      <rect x="173" y="142" width="72" height="8" rx="4" fill="#0f172a" />
      <rect x="173" y="158" width="55" height="6" rx="3" fill="#94a3b8" />
      <rect x="108" y="204" width="84" height="7" rx="3.5" fill="#0f766e" />
      <rect x="108" y="221" width="142" height="5" rx="2.5" fill="#e2e8f0" />
      <rect x="108" y="233" width="126" height="5" rx="2.5" fill="#e2e8f0" />
      <rect x="108" y="257" width="52" height="7" rx="3.5" fill="#0f766e" />
      <rect x="108" y="274" width="133" height="5" rx="2.5" fill="#e2e8f0" />
      <rect x="108" y="286" width="110" height="5" rx="2.5" fill="#e2e8f0" />
      <rect x="108" y="310" width="48" height="22" rx="11" fill="#ccfbf1" />
      <rect x="163" y="310" width="54" height="22" rx="11" fill="#ede9fe" />
      <rect x="224" y="310" width="31" height="22" rx="11" fill="#fef3c7" />
      </g>
    </g>

    <g className="landing-float landing-float-delay" filter="url(#cardShadow)">
      <rect x="278" y="112" width="205" height="231" rx="22" fill="#fff" />
      <text x="301" y="143" fontSize="11" fontWeight="700" letterSpacing="1.2" fill="#64748b">ROLE ALIGNMENT</text>
      <circle cx="380" cy="220" r="55" fill="none" stroke="#e2e8f0" strokeWidth="12" />
      <circle cx="380" cy="220" r="55" fill="none" stroke="url(#scoreFill)" strokeWidth="12" strokeLinecap="round" strokeDasharray="264 346" transform="rotate(-90 380 220)" />
      <text x="380" y="219" textAnchor="middle" fontSize="31" fontWeight="800" fill="#0f172a">76</text>
      <text x="380" y="239" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">MATCH SCORE</text>
      <rect x="303" y="293" width="155" height="27" rx="13.5" fill="#f0fdfa" />
      <circle cx="320" cy="306.5" r="5" fill="#14b8a6" />
      <text x="333" y="310" fontSize="10" fontWeight="700" fill="#115e59">Strong skill overlap</text>
    </g>

    <g className="landing-float landing-float-slow" filter="url(#cardShadow)">
      <rect x="64" y="75" width="134" height="48" rx="15" fill="#fff" />
      <circle cx="88" cy="99" r="12" fill="#dcfce7" />
      <path d="m82 99 4 4 8-9" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="108" y="96" fontSize="9" fontWeight="700" fill="#0f172a">Resume parsed</text>
      <text x="108" y="109" fontSize="8" fill="#64748b">Skills found: 12</text>
    </g>

    <g filter="url(#cardShadow)">
      <rect x="373" y="348" width="132" height="48" rx="15" fill="#0f766e" />
      <path d="M393 372h16m-7-7 7 7-7 7" fill="none" stroke="#99f6e4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="418" y="369" fontSize="8" fontWeight="700" letterSpacing=".8" fill="#ccfbf1">NEXT UP</text>
      <text x="418" y="383" fontSize="10" fontWeight="700" fill="#fff">Your growth plan</text>
    </g>

    <circle className="landing-twinkle" cx="302" cy="75" r="5" fill="#8b5cf6" />
    <circle className="landing-twinkle landing-twinkle-delay" cx="492" cy="220" r="7" fill="#fbbf24" />
    <path className="landing-twinkle" d="m92 244 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#14b8a6" />
  </svg>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis }) => {
  return (
    <div className="mx-auto max-w-6xl space-y-20 py-8 sm:py-12">
      <section className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
        <div className="space-y-6">
          <h1 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Make your next move
            <span className="relative whitespace-nowrap text-teal-700">
              {' '}make sense.
              <svg aria-hidden="true" className="absolute -bottom-2 left-1 h-3 w-[94%] text-teal-300" viewBox="0 0 220 12" fill="none">
                <path d="M3 8C52 2 164 1 217 7" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Turn your resume into a clear career map. See where you fit, what to build next, and which opportunities are worth your time.
          </p>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onStartAnalysis}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-900/15 transition-all hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Find my fit
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </button>
            <span className="text-xs font-medium text-slate-500">Free to try · No account needed</span>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-1.5"><span className="text-teal-600">✓</span> Evidence-backed insights</span>
            <span className="inline-flex items-center gap-1.5"><span className="text-teal-600">✓</span> Practical next steps</span>
            <span className="inline-flex items-center gap-1.5"><span className="text-teal-600">✓</span> Relevant live roles</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute inset-8 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="relative">
            <ResumeIllustration />
          </div>
          <div className="absolute bottom-5 right-1 hidden rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-xl shadow-slate-900/10 backdrop-blur sm:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Your career, clarified</p>
            <p className="mt-1 text-sm font-bold text-slate-800">From resume to next step <span className="text-teal-600">↗</span></p>
          </div>
        </div>
      </section>

      <section aria-labelledby="features-heading" className="space-y-7">
        <div className="mx-auto max-w-2xl space-y-2 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">A smarter way forward</p>
          <h2 id="features-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Clarity at every career turn
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            More than a score: understand your evidence and decide what to do with it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-900/5">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-100">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.75h7l4 4v12.5H7a2 2 0 0 1-2-2v-12.5a2 2 0 0 1 2-2Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 3.75v4h4M8.5 13h7M8.5 16.5h5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 9.5 1.2 1.2 2.3-2.4" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900">Proof, not guesswork</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              See which resume details support each requirement—and what evidence is still missing.
            </p>
          </article>

          <article className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-900/5">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 transition-colors group-hover:bg-violet-100">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3M3 12h3m12 0h3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12m0-12.72-2.12 2.12m-8.48 8.48-2.12 2.12" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.5 14.5 1.6-4 3.4-1-1.6 4-3.4 1Z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900">A doable next move</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Turn skill gaps into a focused learning plan with practical projects you can show.
            </p>
          </article>

          <article className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-900/5">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 transition-colors group-hover:bg-amber-100">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3.75" y="7" width="16.5" height="12.5" rx="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 7V5.5a1.75 1.75 0 0 1 1.75-1.75h3.5A1.75 1.75 0 0 1 15.5 5.5V7M3.75 12h16.5m-10 0v2h3.5v-2" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900">Roles with a reason</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Explore current opportunities connected to your skills, not just a generic job list.
            </p>
          </article>
        </div>
      </section>

      <section aria-label="How TalentMatch works" className="overflow-hidden rounded-2xl bg-slate-900 px-6 py-8 text-white sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xs">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">Simple by design</p>
            <h2 className="mt-2 text-xl font-bold tracking-tight">Your next step, made visible.</h2>
          </div>
          <ol className="grid flex-1 grid-cols-2 gap-3 text-xs sm:grid-cols-4 md:max-w-3xl">
            {[
              ['01', 'Add your resume'],
              ['02', 'Choose a role'],
              ['03', 'See your fit'],
              ['04', 'Move forward'],
            ].map(([number, label]) => (
              <li key={number} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-400/15 text-[10px] font-bold text-teal-200">{number}</span>
                <span className="font-semibold text-slate-100">{label}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
};
