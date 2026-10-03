import {
  AnalyzeRequest,
  AnalyzeResponse,
  AnalysisError,
  RecheckRequest,
  RecheckResponse,
  JobSearchRequest,
  JobSearchResponse,
  CompanySearchResponse,
} from '../types/analysis';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function analyzeResume(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(request),
    });
  } catch {
    const err: AnalysisError = {
      type: 'network_unavailable',
      message: 'The analysis service is unavailable. Make sure the backend is running and try again.',
    };
    throw err;
  }

  if (!response.ok) {
    let errorDetail = "We couldn't complete this analysis. Your information is still available. Try again.";
    try {
      const errorJson = await response.json();
      if (errorJson.detail && typeof errorJson.detail === 'string') {
        errorDetail = errorJson.detail;
      }
    } catch {
      // Fallback
    }

    const err: AnalysisError = {
      type: 'analysis_failed',
      message: errorDetail,
    };
    throw err;
  }

  return response.json();
}

export async function recheckResume(request: RecheckRequest): Promise<RecheckResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/recheck`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(request),
    });
  } catch {
    const err: AnalysisError = {
      type: 'network_unavailable',
      message: 'Unable to connect to the re-check service. Please ensure the backend is running.',
    };
    throw err;
  }

  if (!response.ok) {
    let errorDetail = 'Failed to re-check resume. Please check your inputs and try again.';
    try {
      const errorJson = await response.json();
      if (errorJson.detail) errorDetail = errorJson.detail;
    } catch {
      // Fallback
    }
    const err: AnalysisError = {
      type: 'analysis_failed',
      message: errorDetail,
    };
    throw err;
  }

  return response.json();
}

export async function searchJobs(request: JobSearchRequest): Promise<JobSearchResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch job opportunities');
    }
    return response.json();
  } catch (err: any) {
    throw new Error(err.message || 'Error connecting to live job discovery service');
  }
}

export async function discoverCompanies(location: string): Promise<CompanySearchResponse> {
  try {
    const encoded = encodeURIComponent(location || 'Remote');
    const response = await fetch(`${API_BASE_URL}/api/companies?location=${encoded}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch company directory');
    }
    return response.json();
  } catch (err: any) {
    throw new Error(err.message || 'Error connecting to company discovery service');
  }
}
