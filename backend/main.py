import logging
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from schemas import (
    AnalyzeRequest,
    AnalyzeResponse,
    HealthResponse,
    RecheckRequest,
    RecheckResponse,
    JobSearchRequest,
    JobSearchResponse,
    CompanySearchResponse
)
from gemini_service import analyze_with_gemini
from job_service import search_jobs
from company_service import discover_companies

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("talent_match_backend")

app = FastAPI(
    title="TalentMatch AI API",
    description="Explainable Resume & ATS Review Engine with Skill Gap Analysis, Learning Plans, Re-Check, and Job/Company Discovery",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint to verify backend service availability."""
    return HealthResponse(status="ok")


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_endpoint(request: AnalyzeRequest):
    """
    Analyzes resume alignment against job description requirements.
    Provides explainable match score, separated required/preferred skill gaps,
    learning roadmap, and strong match detection.
    """
    if not request.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")
    if not request.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    logger.info(
        f"Processing analysis request: Resume length={len(request.resume_text)} chars, "
        f"Job Description length={len(request.job_description)} chars."
    )

    try:
        response = await analyze_with_gemini(request.resume_text, request.job_description)
        return response
    except Exception as e:
        logger.error(f"Unexpected error during analysis: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="We couldn't complete this analysis. Your information is still available. Try again."
        )


@app.post("/api/recheck", response_model=RecheckResponse)
async def recheck_resume_endpoint(request: RecheckRequest):
    """
    Re-checks an updated resume against the target job description.
    Computes score delta and explicitly identifies which previously missing requirements are now resolved.
    """
    if not request.updated_resume_text.strip():
        raise HTTPException(status_code=400, detail="Updated resume text cannot be empty.")
    if not request.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    logger.info("Executing resume re-check comparison...")

    try:
        new_analysis = await analyze_with_gemini(request.updated_resume_text, request.job_description)

        # Identify newly resolved requirements
        newly_matched_skills = [
            s.name.lower()
            for s in (new_analysis.required_skills + new_analysis.preferred_skills)
            if s.already_present
        ]

        resolved: list[str] = []
        for prev_missing in request.previous_missing_skills:
            if any(prev_missing.lower() in m or m in prev_missing.lower() for m in newly_matched_skills):
                resolved.append(prev_missing)

        remaining_gaps = [g.skill for g in new_analysis.skill_gaps]
        score_delta = new_analysis.match_score - request.previous_match_score

        return RecheckResponse(
            previous_match_score=request.previous_match_score,
            new_match_score=new_analysis.match_score,
            score_delta=score_delta,
            resolved_requirements=resolved,
            remaining_gaps=remaining_gaps,
            analysis=new_analysis
        )
    except Exception as e:
        logger.error(f"Error during resume re-check: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Unable to complete resume re-check. Please verify your updated resume text."
        )


@app.post("/api/jobs", response_model=JobSearchResponse)
async def job_discovery_endpoint(request: JobSearchRequest):
    """
    Discovers live, current job opportunities based on candidate's skills, title, and preferences.
    Uses real public APIs without invented companies or links.
    """
    try:
        return await search_jobs(request)
    except Exception as e:
        logger.error(f"Error during job search: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Unable to retrieve live job listings at this time.")


@app.get("/api/companies", response_model=CompanySearchResponse)
async def company_discovery_endpoint(location: str = Query("Remote", description="City or region name")):
    """
    Discovers tech companies in or around the entered location.
    Strictly separates 'nearby companies' from 'companies currently hiring'.
    """
    try:
        return await discover_companies(location)
    except Exception as e:
        logger.error(f"Error during company discovery for {location}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Unable to retrieve company directory at this time.")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
