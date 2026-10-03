import React, { useState, useEffect } from 'react';
import { discoverCompanies } from '../services/api';
import { CompanyInfo } from '../types/analysis';

export const CompanyDiscoverySection: React.FC = () => {
  const [locationInput, setLocationInput] = useState('Lahore');
  const [activeTab, setActiveTab] = useState<'nearby' | 'hiring'>('nearby');
  const [nearbyCompanies, setNearbyCompanies] = useState<CompanyInfo[]>([]);
  const [hiringCompanies, setHiringCompanies] = useState<CompanyInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async (targetLoc: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await discoverCompanies(targetLoc);
      setNearbyCompanies(resp.nearby_companies);
      setHiringCompanies(resp.companies_with_openings);
    } catch (err: any) {
      setError(err.message || 'Unable to retrieve companies.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies(locationInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePresetClick = (city: string) => {
    setLocationInput(city);
    fetchCompanies(city);
  };

  return (
    <section id="companies-section" aria-labelledby="companies-heading" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h2 id="companies-heading" className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Companies Around You
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover established technology employers and software houses by geographic location
          </p>
        </div>
      </div>

      {/* Mandatory Clarification Banner */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-lg p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
        <span className="text-amber-600 font-bold shrink-0 mt-0.5">ℹ</span>
        <div>
          <span className="font-bold">Important Notice:</span>{' '}
          A company being nearby does <strong>NOT</strong> mean it currently has an opening. 
          Nearby companies are listed for general career discovery, while confirmed openings are listed separately under "Companies Currently Hiring".
        </div>
      </div>

      {/* Location Input & Preset Buttons */}
      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchCompanies(locationInput);
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
        >
          <div className="flex-1">
            <label htmlFor="company-location-input" className="sr-only">Enter Location</label>
            <input
              id="company-location-input"
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Enter city (e.g. Sialkot, Lahore, Islamabad, Remote, Pakistan)..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
          >
            {isLoading ? 'Searching...' : 'Explore Companies'}
          </button>
        </form>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Quick Locations:</span>
          {['Sialkot', 'Lahore', 'Islamabad', 'Remote', 'Pakistan'].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => handlePresetClick(city)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                locationInput.toLowerCase() === city.toLowerCase()
                  ? 'bg-teal-800 text-white border-teal-800'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Separation Tabs: Nearby Companies vs Currently Hiring */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('nearby')}
          className={`pb-2 text-xs font-bold transition-colors relative ${
            activeTab === 'nearby'
              ? 'text-teal-800 border-b-2 border-teal-800'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Nearby Tech Companies ({nearbyCompanies.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('hiring')}
          className={`pb-2 text-xs font-bold transition-colors relative ${
            activeTab === 'hiring'
              ? 'text-teal-800 border-b-2 border-teal-800'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Companies Currently Hiring ({hiringCompanies.length})
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => fetchCompanies(locationInput)}
            className="font-semibold underline ml-2 hover:text-rose-950"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="py-10 text-center space-y-2">
          <div className="w-7 h-7 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Querying company directory for {locationInput}...</p>
        </div>
      )}

      {/* Companies List */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(activeTab === 'nearby' ? nearbyCompanies : hiringCompanies).map((comp, idx) => (
            <div
              key={`${comp.name}-${idx}`}
              className="border border-slate-200 rounded-xl p-4 bg-white hover:border-slate-300 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{comp.name}</h3>
                  {comp.has_active_openings ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Actively Hiring
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      Nearby Directory
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 flex items-center gap-1">
                  📍 {comp.location}
                </p>

                <div className="bg-slate-50 rounded p-2 text-xs text-slate-700 border border-slate-100">
                  <span className="font-semibold text-slate-500 block text-[11px] uppercase tracking-wider mb-0.5">
                    Industry / Focus:
                  </span>
                  {comp.industry}
                </div>

                {comp.available_jobs && comp.available_jobs.length > 0 && (
                  <div className="text-xs space-y-1 pt-1">
                    <span className="font-semibold text-teal-800 block text-[11px]">
                      Confirmed Active Openings:
                    </span>
                    {comp.available_jobs.slice(0, 2).map((job) => (
                      <div key={job.id} className="text-[11px] text-slate-700 bg-teal-50/60 p-1.5 rounded border border-teal-100 flex items-center justify-between">
                        <span>{job.job_title}</span>
                        <a
                          href={job.application_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-700 font-bold hover:underline"
                        >
                          View →
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Links */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <a
                  href={comp.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-teal-800 font-medium flex items-center gap-1 hover:underline"
                >
                  <span>Official Website</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                <a
                  href={comp.careers_page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold border border-teal-200 transition-colors flex items-center gap-1"
                >
                  <span>Careers Page</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
