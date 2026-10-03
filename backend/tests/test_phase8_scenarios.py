import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app
from schemas import (
    AnalyzeResponse,
    SkillMatch,
    SkillGap,
    UpskillingItem,
    AssessmentDetail,
)

client = TestClient(app)


def test_full_result_rendering_contract():
    """Verify that a response containing matched, partial, gap, strengths, gaps, upskilling renders correctly."""
    sample = AnalyzeResponse(
        match_score=82,
        confidence="High",
        summary="Candidate matches core backend requirements with demonstrated Python experience.",
        required_skills=[
            SkillMatch(
                name="Python",
                status="Matched",
                importance="Required",
                evidence="Python is listed in candidate skills and used in Flask API project."
            ),
            SkillMatch(
                name="Docker",
                status="Partial",
                importance="Required",
                evidence="Docker is mentioned in tools but lacking production deployment evidence."
            ),
            SkillMatch(
                name="Django",
                status="Gap",
                importance="Required",
                evidence="Not found in provided resume."
            )
        ],
        experience_assessment=AssessmentDetail(
            status="demonstrated",
            evidence="Candidate demonstrates 3 years of backend development experience."
        ),
        education_assessment=AssessmentDetail(
            status="demonstrated",
            evidence="B.S. in Computer Science is documented."
        ),
        strengths=[
            "Strong documented proficiency in Python and FastAPI.",
            "Demonstrated database design skills in PostgreSQL."
        ],
        skill_gaps=[
            SkillGap(
                skill="Django",
                reason="Django is listed as a required technology but was not demonstrated in the provided resume.",
                importance="Required",
                priority="High",
                next_step="Build a small Django REST API project."
            )
        ],
        upskilling_plan=[
            UpskillingItem(
                order=1,
                skill="Django",
                priority="High",
                why="Required framework for the target role.",
                suggested_action="Build a small Django REST API project with authentication."
            )
        ],
        explanation="The Requirement Match Score of 82% reflects strong alignment across 4 out of 5 required skills with documented evidence."
    )
    
    assert sample.match_score == 82
    assert sample.confidence == "High"
    assert len(sample.required_skills) == 3
    assert sample.required_skills[0].status == "Matched"
    assert sample.required_skills[1].status == "Partial"
    assert sample.required_skills[2].status == "Gap"
    assert len(sample.skill_gaps) == 1
    assert sample.skill_gaps[0].next_step == "Build a small Django REST API project."


def test_empty_arrays_edge_case():
    """Verify edge case where required_skills, strengths, skill_gaps, and upskilling_plan are empty."""
    sample = AnalyzeResponse(
        match_score=40,
        confidence="Low",
        summary="Sparse resume text provided.",
        required_skills=[],
        experience_assessment=AssessmentDetail(
            status="unknown",
            evidence="No clear professional timeline provided."
        ),
        education_assessment=AssessmentDetail(
            status="unknown",
            evidence="No academic credentials listed."
        ),
        strengths=[],
        skill_gaps=[],
        upskilling_plan=[],
        explanation="Minimal documentation was provided to evaluate requirements."
    )
    assert len(sample.required_skills) == 0
    assert len(sample.strengths) == 0
    assert len(sample.skill_gaps) == 0
    assert len(sample.upskilling_plan) == 0
    assert sample.experience_assessment.status == "unknown"
    assert sample.education_assessment.status == "unknown"


def test_unknown_states_handling():
    """Verify unknown status for experience and education with backend evidence."""
    sample = AnalyzeResponse(
        match_score=65,
        confidence="Medium",
        summary="Skills present but experience and education omitted.",
        required_skills=[
            SkillMatch(
                name="Python",
                status="Matched",
                importance="Required",
                evidence="Candidate projects demonstrate Python code."
            )
        ],
        experience_assessment=AssessmentDetail(
            status="unknown",
            evidence="Specific years of formal professional experience could not be reliably determined from the provided resume text."
        ),
        education_assessment=AssessmentDetail(
            status="unknown",
            evidence="No explicit degree or educational institution credentials were identified in the provided resume text."
        ),
        strengths=["Self-directed project experience in Python."],
        skill_gaps=[],
        upskilling_plan=[],
        explanation="Score is based exclusively on verifiable technical skills."
    )
    assert sample.experience_assessment.status == "unknown"
    assert "could not be reliably determined" in sample.experience_assessment.evidence
    assert sample.education_assessment.status == "unknown"
    assert "No explicit degree" in sample.education_assessment.evidence


def test_long_text_edge_cases():
    """Verify system handles long skill names, long evidence, long explanation, and long suggested actions."""
    long_skill = "Cloud Infrastructure & High Availability Distributed Microservices Architecture"
    long_evidence = "Candidate successfully designed, implemented, benchmarked, and maintained multi-region distributed streaming architectures using Kafka, Redis clusters, and event-driven patterns across 10+ distinct services with 99.99% uptime over 4 years of continuous production deployment."
    long_explanation = "A" * 800
    long_action = "Execute a step-by-step phased migration of monolithic background workers to asynchronous task queues using Celery, Redis, and Prometheus monitoring with detailed Grafana dashboards documenting throughput improvements."

    sample = AnalyzeResponse(
        match_score=90,
        confidence="High",
        summary="High competency in distributed systems.",
        required_skills=[
            SkillMatch(
                name=long_skill,
                status="Matched",
                importance="Required",
                evidence=long_evidence
            )
        ],
        experience_assessment=AssessmentDetail(
            status="demonstrated",
            evidence=long_evidence
        ),
        education_assessment=AssessmentDetail(
            status="demonstrated",
            evidence="M.S. in Computer Science with focus on Distributed Systems."
        ),
        strengths=[long_evidence],
        skill_gaps=[
            SkillGap(
                skill=long_skill,
                reason=long_evidence,
                importance="Required",
                priority="High",
                next_step=long_action
            )
        ],
        upskilling_plan=[
            UpskillingItem(
                order=1,
                skill=long_skill,
                priority="High",
                why=long_evidence,
                suggested_action=long_action
            )
        ],
        explanation=long_explanation
    )
    assert len(sample.explanation) == 800
    assert sample.required_skills[0].name == long_skill
