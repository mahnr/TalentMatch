import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app
import job_service

client = TestClient(app)


def test_separated_skill_gap_analysis():
    payload = {
        "resume_text": "Python backend engineer with experience in PostgreSQL, FastAPI, and Git. BS in Computer Science.",
        "job_description": "We need a Senior Python Developer with FastAPI, PostgreSQL, Docker, and Kubernetes. React preferred."
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Check match level
    assert data["match_level"] in ["Low Match", "Moderate Match", "Strong Match"]

    # Check required vs preferred skills separation
    assert "required_skills" in data
    assert "preferred_skills" in data
    assert isinstance(data["required_skills"], list)
    assert isinstance(data["preferred_skills"], list)

    for skill in data["required_skills"]:
        assert skill["status"] in ["Match", "Partial Match", "Missing", "Matched", "Partial", "Gap"]
        assert skill["importance"] == "Required"
        assert "evidence" in skill
        assert "already_present" in skill

    # Check skill gaps have reasons why they matter
    for gap in data["skill_gaps"]:
        assert "skill" in gap
        assert len(gap["reason"]) > 0


def test_personalized_learning_plan():
    payload = {
        "resume_text": "Junior Python developer with basic scripting knowledge.",
        "job_description": "Python, Docker, REST APIs, PostgreSQL, React."
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Verify learning plan items
    learning_plan = data.get("learning_plan", [])
    assert len(learning_plan) > 0

    first_item = learning_plan[0]
    assert "skill" in first_item
    assert "what_to_learn" in first_item
    assert isinstance(first_item["subtopics"], list)
    assert len(first_item["subtopics"]) > 0
    assert "practice_task" in first_item
    assert "project_idea" in first_item
    assert "estimated_time" in first_item
    assert "resume_demonstration" in first_item

    # Verify 4-week roadmap
    roadmap = data.get("learning_roadmap", {})
    assert "weeks" in roadmap
    assert len(roadmap["weeks"]) == 4
    assert roadmap["weeks"][0]["week"] == "Week 1"
    assert roadmap["weeks"][3]["week"] == "Week 4"


def test_recheck_resume_endpoint():
    recheck_payload = {
        "original_resume_text": "Python developer with basic knowledge.",
        "updated_resume_text": "Experienced Python Backend Developer with FastAPI, Docker containerization, and PostgreSQL database optimization.",
        "job_description": "Seeking Python Developer with FastAPI, Docker, and PostgreSQL.",
        "previous_match_score": 45,
        "previous_missing_skills": ["Docker", "FastAPI"]
    }
    response = client.post("/api/recheck", json=recheck_payload)
    assert response.status_code == 200
    data = response.json()

    assert data["previous_match_score"] == 45
    assert data["new_match_score"] >= data["previous_match_score"]
    assert data["score_delta"] >= 0
    assert isinstance(data["resolved_requirements"], list)
    # Both Docker and FastAPI were added and should be detected as resolved
    assert any("docker" in r.lower() or "fastapi" in r.lower() for r in data["resolved_requirements"])


def test_job_discovery_endpoint():
    payload = {
        "query": "Python",
        "skills": ["Python", "FastAPI", "Docker", "PostgreSQL"],
        "location": "Remote",
        "work_type": "all"
    }
    response = client.post("/api/jobs", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "jobs" in data
    assert isinstance(data["jobs"], list)
    if data["jobs"]:
        job = data["jobs"][0]
        assert "company_name" in job
        assert "job_title" in job
        assert "location" in job
        assert "application_link" in job
        assert job["application_link"].startswith("http")
        assert "why_matched" in job


def test_job_search_includes_roles_matching_candidate_skills(monkeypatch):
    async def fake_live_jobs():
        return [{
            "id": "python-platform-role",
            "company": "Example Tech",
            "title": "Platform Engineer",
            "location": "Remote",
            "remote": True,
            "tags": ["Python", "PostgreSQL"],
            "url": "https://example.com/jobs/platform-engineer",
        }]

    monkeypatch.setattr(job_service, "fetch_live_arbeitnow_jobs", fake_live_jobs)

    response = client.post(
        "/api/jobs",
        json={
            "query": "Senior Backend Developer",
            "skills": ["Python", "PostgreSQL"],
            "location": "Remote",
            "work_type": "all",
        },
    )

    assert response.status_code == 200
    assert [job["job_title"] for job in response.json()["jobs"]] == ["Platform Engineer"]


def test_company_discovery_endpoint():
    response = client.get("/api/companies?location=Sialkot")
    assert response.status_code == 200
    data = response.json()

    assert data["location"] == "Sialkot"
    assert "nearby_companies" in data
    assert "companies_with_openings" in data
    assert "notice" in data
    assert "NOT mean it currently has an opening" in data["notice"]

    for comp in data["nearby_companies"]:
        assert "name" in comp
        assert "location" in comp
        assert "industry" in comp
        assert "website" in comp
        assert "careers_page" in comp
