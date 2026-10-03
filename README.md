# TalentMatch

TalentMatch helps job seekers understand how their resume aligns with a job description. It highlights demonstrated skills, identifies gaps, suggests practical next steps, and helps discover related job opportunities.

## What it does

- **Resume-to-role analysis:** Compare resume evidence against a job description and get a match score, summary, and explanation.
- **Skill and qualification review:** See required and preferred skills, evidence found in the resume, experience and education assessments, strengths, and gaps.
- **Personalized learning plan:** Get suggested learning topics, practice tasks, project ideas, and a sequential roadmap for addressing gaps.
- **Progress re-check:** Analyze an updated resume against the same role and review score changes and resolved requirements.
- **Related job discovery:** Search public job feeds using the target role, resume skills, location, and work preference.
- **Company discovery:** Explore technology companies by location and view companies listed as currently hiring separately from the nearby directory.
- **Demo mode:** Load sample resume and job description content from the analysis form to try the workflow.

Analysis is intended to explain resume evidence—not predict whether an employer will hire a candidate.

## Tech stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Python, FastAPI, Pydantic
- **Optional AI provider:** Google Gemini API
- **Job feeds:** Arbeitnow and RemoteOK public APIs, with cached fallback listings when live feeds are unavailable

## Project layout

```text
.
├── backend/
│   ├── main.py               # FastAPI app and API routes
│   ├── schemas.py            # Request and response models
│   ├── gemini_service.py     # Gemini analysis and deterministic fallback
│   ├── job_service.py        # Job feed search and matching
│   ├── company_service.py    # Company directory discovery
│   ├── requirements.txt
│   └── tests/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/api.ts
    │   └── types/
    ├── package.json
    └── vite.config.ts
```

## Requirements

- Python 3.10 or newer
- Node.js 18 or newer, with npm
- Optional: a Google Gemini API key for Gemini-powered analysis. Without a key, the backend uses its deterministic analysis engine.

## Run locally

Open two terminals from the project root.

### 1. Start the backend

Create and activate a virtual environment, install the backend dependencies, and start the API:

**Windows PowerShell**

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**macOS / Linux**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API is available at `http://127.0.0.1:8000`. Interactive API documentation is at `http://127.0.0.1:8000/docs`.

To enable Gemini analysis, create `backend/.env` and add your key:

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

`GOOGLE_API_KEY` is also accepted. Keep keys private; do not commit `.env` files.

### 2. Start the frontend

In a second terminal, from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. During development, Vite proxies `/api` requests to the backend on `http://127.0.0.1:8000`.

For a different backend URL, set `VITE_API_URL` in a local frontend environment file, for example `frontend/.env.local`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Deploy

The repository includes deployment configuration for a Vercel frontend and Render API.

### 1. Deploy the API to Render

1. Sign in to [Render](https://render.com/) and create a new **Blueprint** from the GitHub repository `mahnr/TalentMatch`.
2. Render reads `render.yaml` and creates the `talentmatch-api` web service.
3. Wait for the service to finish deploying. Check `https://YOUR-RENDER-SERVICE.onrender.com/api/health`; it should return `{"status":"ok"}`.
4. If using Gemini, add `GEMINI_API_KEY` in the Render service's **Environment** settings. This is optional; without it, the deterministic matcher is used.

### 2. Deploy the frontend to Vercel

1. Import `mahnr/TalentMatch` into [Vercel](https://vercel.com/) as a new project.
2. Set the project **Root Directory** to `frontend`.
3. Add the environment variable `VITE_API_URL` with the Render service URL, for example `https://talentmatch-api.onrender.com` (no trailing slash).
4. Deploy. `frontend/vercel.json` configures the Vite build and client-side route fallback.

### 3. Allow the Vercel site in the API CORS settings

After Vercel gives you the deployed site URL, open the Render service's **Environment** settings and set `CORS_ORIGINS` to a comma-separated list containing the exact Vercel origin and local development origins:

```text
https://YOUR-PROJECT.vercel.app,http://localhost:5173,http://127.0.0.1:5173
```

Use only the origin (scheme and hostname), with no path or trailing slash. Save the setting and wait for Render to redeploy. Check the live Vercel site and its analysis, jobs, and company discovery pages.

## Using TalentMatch

1. Choose **Start Analysis**.
2. Paste in a resume and a job description, or choose **Try a Demo** and load the sample data.
3. Run the analysis to review the match score, evidence, strengths, skill gaps, and learning plan.
4. Open **Related Jobs** to search roles connected to the analyzed profile.
5. Update the resume and use **Re-check My Resume** to compare progress.

Job search and company discovery require the backend. Live feed availability depends on the public providers; the backend has cached fallback listings if live feeds cannot be reached.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Check that the backend is responding |
| `POST` | `/api/analyze` | Analyze resume content against a job description |
| `POST` | `/api/recheck` | Re-analyze an updated resume and report progress |
| `POST` | `/api/jobs` | Search for job opportunities |
| `GET` | `/api/companies?location=Lahore` | Discover companies by location |

## Tests and production build

Run backend tests from `backend/` with the virtual environment activated:

```bash
python -m pytest
```

Build the frontend from `frontend/`:

```bash
npm run build
```

## Privacy and responsible use

Resume and job-description text is sent to the backend for analysis and is not saved to an application database. If a Gemini API key is configured, the analysis request is sent to Google's Gemini API; review that provider's data-handling terms before using real personal information. Job and company discovery may contact external public APIs.

TalentMatch provides informational resume feedback, not hiring predictions, employment guarantees, or professional career advice. Always verify job details on the employer's application page.
