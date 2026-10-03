import pytest
from fastapi.testclient import TestClient
import sys
import os

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app
from schemas import AnalyzeResponse, AssessmentDetail, SkillMatch, SkillGap, UpskillingItem

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_analyze_empty_request():
    response = client.post("/api/analyze", json={"resume_text": "", "job_description": ""})
    assert response.status_code in [400, 422]


def test_analyze_valid_request():
    payload = {
        "resume_text": "Experienced Python Backend Developer with 4 years building REST APIs, FastAPI, Docker, and PostgreSQL databases. Bachelor of Science in Computer Science.",
        "job_description": "Seeking Python Backend Engineer. Required skills: Python, FastAPI, Docker, Kubernetes, PostgreSQL. 3+ years experience. BS degree in Computer Science."
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    # Verify core fields
    assert "match_score" in data
    assert isinstance(data["match_score"], int)
    assert 0 <= data["match_score"] <= 100
    
    assert data["confidence"] in ["High", "Medium", "Low"]
    assert "summary" in data
    assert "explanation" in data
    
    # Required skills evidence
    assert isinstance(data["required_skills"], list)
    assert len(data["required_skills"]) > 0
    first_skill = data["required_skills"][0]
    assert "name" in first_skill
    assert "status" in first_skill
    assert "importance" in first_skill
    assert "evidence" in first_skill
    
    # Experience and Education
    assert data["experience_assessment"]["status"] in ["demonstrated", "partial", "insufficient", "unknown"]
    assert len(data["experience_assessment"]["evidence"]) > 0
    assert data["education_assessment"]["status"] in ["demonstrated", "partial", "insufficient", "unknown"]
    assert len(data["education_assessment"]["evidence"]) > 0
    
    # Skill gaps and upskilling
    assert isinstance(data["skill_gaps"], list)
    assert isinstance(data["upskilling_plan"], list)


def test_unknown_states_schema():
    """Verify that Unknown status for experience/education is valid in schema."""
    resp = AnalyzeResponse(
        match_score=50,
        confidence="Low",
        summary="Minimal resume provided",
        required_skills=[],
        experience_assessment=AssessmentDetail(
            status="unknown",
            evidence="No clear experience history provided in resume text."
        ),
        education_assessment=AssessmentDetail(
            status="unknown",
            evidence="No education details found."
        ),
        strengths=[],
        skill_gaps=[],
        upskilling_plan=[],
        explanation="Testing edge case with empty sections."
    )
    assert resp.experience_assessment.status == "unknown"
    assert resp.education_assessment.status == "unknown"
    assert len(resp.strengths) == 0
    assert len(resp.skill_gaps) == 0
