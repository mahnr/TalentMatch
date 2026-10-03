import os
import json
import logging
import re
from typing import Dict, Any, List
from schemas import (
    AnalyzeResponse,
    SkillMatch,
    SkillGap,
    UpskillingItem,
    AssessmentDetail,
    LearningPlanItem,
    OverallLearningRoadmap,
    RoadmapWeek,
    StrongMatchDetails,
)

logger = logging.getLogger(__name__)

# Curated knowledge base for realistic, practical learning plans per skill
SKILL_LEARNING_GUIDES = {
    "react": {
        "what_to_learn": "Core React component model, JSX syntax, state/props, and modern Hooks.",
        "subtopics": ["JSX & Element Rendering", "Component Props & State", "useState & useEffect Hooks", "Handling Forms & Events", "Component Composition", "Consuming REST APIs with fetch/axios"],
        "practice_task": "Create an interactive counter and task list component with filterable state.",
        "project_idea": "Build a responsive candidate dashboard that fetches real-time data from an API and filters by status.",
        "estimated_time": "2-3 weeks (15-20 hours)",
        "resume_demonstration": "Developed modular UI components in React (v18) utilizing functional hooks and responsive Tailwind styling."
    },
    "rest apis": {
        "what_to_learn": "Client-server communication, HTTP verbs, status codes, JSON serialization, and stateless authentication.",
        "subtopics": ["HTTP Methods (GET, POST, PUT, DELETE)", "HTTP Status Codes (200, 201, 400, 401, 404, 500)", "JSON Payload Structuring", "Query Parameters vs Path Variables", "Stateless Token Authentication (Bearer/JWT)", "Error Handling & Response Schemas"],
        "practice_task": "Build a simple weather/API client script that requests JSON data and prints formatted forecasts.",
        "project_idea": "Build a small REST API backend service with endpoints for creating, reading, and updating task records.",
        "estimated_time": "1-2 weeks (8-12 hours)",
        "resume_demonstration": "Architected resilient RESTful API endpoints adhering to standard HTTP conventions and JSON specifications."
    },
    "docker": {
        "what_to_learn": "Containerization principles, Dockerfile syntax, container isolation, port mapping, and Docker Compose.",
        "subtopics": ["Images vs Containers", "Writing optimized Dockerfiles", "WORKDIR, COPY, RUN, and CMD commands", "Port mapping & environment variables", "Docker volumes for data persistence", "Multi-container orchestration with Docker Compose"],
        "practice_task": "Write a multi-stage Dockerfile for a Python/Node application and run it locally in an isolated container.",
        "project_idea": "Create a `docker-compose.yml` tying together a web application, a PostgreSQL database, and a Redis caching container.",
        "estimated_time": "1-2 weeks (10-14 hours)",
        "resume_demonstration": "Containerized development and production services using Docker and Docker Compose, standardizing deployment across environments."
    },
    "kubernetes": {
        "what_to_learn": "Container orchestration, Pods, Deployments, Services, ConfigMaps, and Ingress routing.",
        "subtopics": ["Cluster Architecture & Nodes", "Pods & ReplicaSets", "Deployment manifests & Rolling Updates", "ClusterIP and NodePort Services", "ConfigMaps & Secrets", "Basic Ingress controllers"],
        "practice_task": "Deploy an Nginx web server or containerized API to a local Minikube or Kind cluster.",
        "project_idea": "Deploy a multi-tier microservice to Minikube with a Service and ConfigMap, verifying automated pod self-healing.",
        "estimated_time": "3-4 weeks (20-25 hours)",
        "resume_demonstration": "Configured Kubernetes Deployment and Service YAML manifests for container orchestration on local clusters."
    },
    "sql": {
        "what_to_learn": "Relational data modeling, schema definition, DDL/DML queries, JOINs, indexing, and aggregation.",
        "subtopics": ["Table creation & Foreign Keys", "SELECT, WHERE, ORDER BY, LIMIT", "INNER, LEFT, and RIGHT JOINs", "GROUP BY & Aggregate Functions (COUNT, SUM, AVG)", "Indexes & Query Plans", "ACID transactions"],
        "practice_task": "Write complex SQL queries joining 3 related tables with aggregations and grouping on sample data.",
        "project_idea": "Design an e-commerce or talent database schema with relational constraints, indexing, and stored queries.",
        "estimated_time": "2 weeks (12-16 hours)",
        "resume_demonstration": "Modeled normalized relational databases in PostgreSQL and authored optimized SQL queries with indexing."
    },
    "fastapi": {
        "what_to_learn": "Modern async Python web framework, Pydantic type validation, dependency injection, and automatic OpenAPI docs.",
        "subtopics": ["Path & Query Parameters", "Pydantic Request & Response Models", "Async route handlers", "Dependency Injection (`Depends`)", "Exception Handling & Status Codes", "Background Tasks & Middleware"],
        "practice_task": "Build a CRUD API for a bookstore or task tracker with automatic Swagger documentation.",
        "project_idea": "Build a secure RESTful authentication service with JWT token verification and input schema validation.",
        "estimated_time": "1-2 weeks (10-14 hours)",
        "resume_demonstration": "Engineered high-throughput asynchronous REST APIs using FastAPI, Pydantic data validation, and OpenAPI documentation."
    },
    "git": {
        "what_to_learn": "Distributed version control, branch management, merge conflict resolution, and collaborative pull request workflows.",
        "subtopics": ["init, clone, add, commit, push, pull", "Branching workflows (feature branches)", "Resolving merge conflicts", "Interactive rebasing & stash", "Pull requests & code review etiquette", "GitHub Actions CI basics"],
        "practice_task": "Create a repository with multiple branches, intentionally generate a merge conflict, and resolve it cleanly.",
        "project_idea": "Publish a well-structured open-source repository with branch protection rules, README, and automated linting CI.",
        "estimated_time": "1 week (6-8 hours)",
        "resume_demonstration": "Managed collaborative codebase workflows via Git feature branching, pull requests, and automated GitHub Actions."
    },
    "testing": {
        "what_to_learn": "Automated testing principles, unit testing, test fixtures, mocking, and API integration testing.",
        "subtopics": ["Unit tests vs Integration tests", "Writing test assertions with Pytest/Jest", "Test fixtures and setup/teardown", "Mocking external dependencies and API calls", "Code coverage analysis", "Automated test runs in CI"],
        "practice_task": "Write a suite of 10+ unit tests covering edge cases for a utility calculation and data transformation module.",
        "project_idea": "Add comprehensive unit and API endpoint test coverage to an existing backend project using Pytest TestClient.",
        "estimated_time": "1-2 weeks (8-12 hours)",
        "resume_demonstration": "Authored unit and integration test suites using Pytest, improving regression resilience and code coverage."
    },
    "cloud": {
        "what_to_learn": "Cloud computing essentials, object storage (S3), compute instances (EC2), and serverless execution.",
        "subtopics": ["Compute, Storage, and Networking fundamentals", "AWS S3 / GCP Storage buckets & permissions", "Deploying services on virtual machines (EC2)", "IAM roles and least-privilege security", "Serverless basics (Lambda / Cloud Functions)", "Monitoring & logs (CloudWatch)"],
        "practice_task": "Deploy a static website or small API container to an AWS EC2 instance or S3 bucket.",
        "project_idea": "Build an automated file upload pipeline that saves images to cloud object storage and logs metadata.",
        "estimated_time": "2-3 weeks (15-20 hours)",
        "resume_demonstration": "Deployed scalable cloud services on AWS utilizing S3 object storage, EC2 virtual instances, and IAM security controls."
    },
    "typescript": {
        "what_to_learn": "Static type checking for JavaScript, interfaces, type aliases, generics, and compiler configuration.",
        "subtopics": ["Primitive and Union types", "Interfaces vs Type Aliases", "Function typing and return signatures", "Generics fundamentals", "Configuring `tsconfig.json`", "Typing React components and hooks"],
        "practice_task": "Refactor a plain JavaScript helper file to strictly typed TypeScript with zero `any` types.",
        "project_idea": "Build a strongly-typed web dashboard or CLI tool with custom data interfaces and validation.",
        "estimated_time": "1-2 weeks (10-14 hours)",
        "resume_demonstration": "Architected type-safe applications in TypeScript, reducing runtime errors through strict interface definitions."
    }
}


def build_learning_item_for_skill(skill_name: str, importance: str = "Required", order: int = 1) -> LearningPlanItem:
    """Creates a rich, practical learning plan item for a missing skill."""
    skill_lower = skill_name.lower()
    
    # Check for direct or partial match in curated knowledge base
    matched_key = None
    for k in SKILL_LEARNING_GUIDES:
        if k in skill_lower or skill_lower in k:
            matched_key = k
            break
            
    if matched_key:
        guide = SKILL_LEARNING_GUIDES[matched_key]
        return LearningPlanItem(
            skill=skill_name,
            importance=importance,
            what_to_learn=guide["what_to_learn"],
            subtopics=guide["subtopics"],
            recommended_order=order,
            practice_task=guide["practice_task"],
            project_idea=guide["project_idea"],
            estimated_time=guide["estimated_time"],
            resume_demonstration=guide["resume_demonstration"]
        )
    
    # Generic realistic fallback for other domain skills
    return LearningPlanItem(
        skill=skill_name,
        importance=importance,
        what_to_learn=f"Core concepts, syntax, architectural patterns, and standard tooling for {skill_name}.",
        subtopics=[
            f"{skill_name} Fundamentals & Setup",
            "Core Syntax, Data Structures, or Configuration",
            "Handling Common Edge Cases and Errors",
            "Best Practices and Idiomatic Usage",
            "Integration with Existing Technologies"
        ],
        recommended_order=order,
        practice_task=f"Complete hands-on beginner exercises applying {skill_name} to solve small targeted problems.",
        project_idea=f"Build a focused proof-of-concept project demonstrating practical {skill_name} implementation.",
        estimated_time="1-2 weeks (10-15 hours)",
        resume_demonstration=f"Implemented {skill_name} in a practical project, demonstrating working proficiency and clean code structure."
    )


def build_overall_roadmap(gaps: List[SkillGap]) -> OverallLearningRoadmap:
    """Builds a structured 4-week actionable roadmap."""
    if not gaps:
        return OverallLearningRoadmap(
            weeks=[],
            summary="All core requirements are demonstrated in your resume. No mandatory learning roadmap is required."
        )

    first_skill = gaps[0].skill
    second_skill = gaps[1].skill if len(gaps) > 1 else first_skill

    weeks = [
        RoadmapWeek(
            week="Week 1",
            focus="Learn Fundamentals & Core Syntax",
            details=f"Dedicate daily study blocks to understand {first_skill} core principles and complete starter tutorials."
        ),
        RoadmapWeek(
            week="Week 2",
            focus="Targeted Practice & Beginner Exercises",
            details=f"Build small standalone scripts and exercises. Begin foundational concepts for {second_skill} if applicable."
        ),
        RoadmapWeek(
            week="Week 3",
            focus="Build a Tangible Project",
            details=f"Synthesize learning by building a small portfolio project that combines {first_skill} with existing skills."
        ),
        RoadmapWeek(
            week="Week 4",
            focus="Update Resume & Re-Check",
            details="Document your project on GitHub, add clear evidence bullet points to your resume, and click 'Re-check My Resume'."
        )
    ]
    return OverallLearningRoadmap(
        weeks=weeks,
        summary=f"A focused 4-week timeline to systematically close {len(gaps)} missing requirement(s) through hands-on practice."
    )


def extract_candidate_profile(resume_text: str, job_description: str) -> Dict[str, Any]:
    """Extracts job title, detected skills, experience, and education for live job discovery."""
    res_lower = resume_text.lower()
    job_lower = job_description.lower()

    # Determine target job title from job description
    target_title = "Software Engineer"
    lines = [line.strip() for line in job_description.split("\n") if line.strip()]
    if lines:
        first_line = lines[0]
        if len(first_line) < 60 and not any(w in first_line.lower() for w in ["about", "responsibilities", "we are", "seeking"]):
            target_title = first_line
        elif "backend" in job_lower:
            target_title = "Python Backend Developer"
        elif "frontend" in job_lower or "react" in job_lower:
            target_title = "Frontend Developer"
        elif "full stack" in job_lower or "fullstack" in job_lower:
            target_title = "Full Stack Engineer"

    # Detect skills in resume
    skill_keywords = [
        "Python", "FastAPI", "Flask", "Django", "JavaScript", "TypeScript", "React",
        "Node.js", "Docker", "Kubernetes", "PostgreSQL", "MySQL", "SQL", "Redis",
        "AWS", "GCP", "Git", "REST APIs", "Linux", "CI/CD"
    ]
    detected_skills = [s for s in skill_keywords if s.lower() in res_lower]
    if not detected_skills:
        detected_skills = ["Python", "REST APIs", "Git"]

    # Detect experience level
    exp_level = "Entry to Mid-Level"
    if any(k in res_lower for k in ["5+", "6+", "7+", "senior", "lead", "architect"]):
        exp_level = "Senior Level"
    elif any(k in res_lower for k in ["3+", "4+", "3 years", "4 years"]):
        exp_level = "Mid-Level (3-4 years)"
    elif any(k in res_lower for k in ["1 year", "2 years", "junior", "intern"]):
        exp_level = "Junior / Entry-Level"

    # Education
    edu = "Computer Science or Related Field"
    if "bachelor" in res_lower or "bs" in res_lower:
        edu = "Bachelor's in Computer Science"
    elif "master" in res_lower or "ms" in res_lower:
        edu = "Master's in Computer Science"

    return {
        "target_job_title": target_title,
        "skills": detected_skills,
        "experience_level": exp_level,
        "education": edu,
        "location": "Remote",
        "work_type": "Remote"
    }


def generate_fallback_analysis(resume_text: str, job_description: str) -> AnalyzeResponse:
    """
    Deterministic explainable analysis engine.
    Produces evidence-backed skill gap analysis, separated required/preferred skills,
    personalized learning plans, and strong-match workflows.
    """
    res_lower = resume_text.lower()
    job_lower = job_description.lower()

    # Core technical skills to evaluate
    known_skills = [
        ("Python", ["python", "py"], "Required"),
        ("FastAPI", ["fastapi"], "Required"),
        ("REST APIs", ["rest api", "rest apis", "restful", "rest"], "Required"),
        ("SQL / PostgreSQL", ["postgresql", "postgres", "sql", "mysql"], "Required"),
        ("Docker", ["docker", "container"], "Required"),
        ("Kubernetes", ["kubernetes", "k8s"], "Preferred"),
        ("React / TypeScript", ["react", "typescript", "ts"], "Preferred"),
        ("Git / CI/CD", ["git", "github", "ci/cd", "pipeline"], "Preferred"),
        ("Cloud / AWS", ["aws", "cloud", "s3", "ec2", "gcp"], "Preferred"),
        ("Testing / QA", ["pytest", "jest", "unit test", "testing"], "Preferred")
    ]

    required_skills: List[SkillMatch] = []
    preferred_skills: List[SkillMatch] = []
    skill_gaps: List[SkillGap] = []
    learning_plan: List[LearningPlanItem] = []
    upskilling_plan: List[UpskillingItem] = []
    strengths: List[str] = []

    matched_req_count = 0
    total_req_count = 0
    matched_pref_count = 0
    total_pref_count = 0

    for skill_name, aliases, importance in known_skills:
        # Check relevance to job description
        in_job = any(alias in job_lower for alias in aliases)
        in_resume = any(alias in res_lower for alias in aliases)

        # Include if in job description or among top baseline competencies
        if in_job or (importance == "Required" and total_req_count < 3):
            if importance == "Required":
                total_req_count += 1
            else:
                total_pref_count += 1

            if in_resume:
                if importance == "Required":
                    matched_req_count += 1
                else:
                    matched_pref_count += 1

                evidence = f"{skill_name} is evidenced in the candidate's resume and applied in project experience."
                skill_obj = SkillMatch(
                    name=skill_name,
                    status="Match",
                    importance=importance,
                    evidence=evidence,
                    already_present=True
                )
                strengths.append(f"Demonstrated proficiency in {skill_name} matching {importance.lower()} job requirements.")
            else:
                evidence = f"Not found in provided resume."
                skill_obj = SkillMatch(
                    name=skill_name,
                    status="Missing",
                    importance=importance,
                    evidence=evidence,
                    already_present=False
                )
                
                # Gap details explaining why it matters
                why_matters = f"{skill_name} is specified as a {importance.lower()} requirement in the job description to build and maintain production systems."
                gap = SkillGap(
                    skill=skill_name,
                    reason=why_matters,
                    importance=importance,
                    priority="High" if importance == "Required" else "Medium",
                    next_step=f"Complete a practical project demonstrating {skill_name}."
                )
                skill_gaps.append(gap)

                # Generate comprehensive learning plan item
                learning_item = build_learning_item_for_skill(
                    skill_name=skill_name,
                    importance=importance,
                    order=len(learning_plan) + 1
                )
                learning_plan.append(learning_item)

                # Keep legacy upskilling_plan for backwards compatibility
                upskilling_plan.append(UpskillingItem(
                    order=len(upskilling_plan) + 1,
                    skill=skill_name,
                    priority=gap.priority or "Medium",
                    why=gap.reason,
                    suggested_action=learning_item.practice_task
                ))

            if importance == "Required":
                required_skills.append(skill_obj)
            else:
                preferred_skills.append(skill_obj)

    # Ensure required_skills has items
    if not required_skills:
        required_skills.append(SkillMatch(
            name="Python",
            status="Match" if "python" in res_lower else "Missing",
            importance="Required",
            evidence="Evidenced in resume." if "python" in res_lower else "Not found in provided resume.",
            already_present="python" in res_lower
        ))
        total_req_count = 1
        if "python" in res_lower:
            matched_req_count = 1

    # Experience assessment
    exp_status = "unknown"
    exp_evidence = "Specific years of formal professional experience could not be reliably determined from the provided resume text."
    if any(k in res_lower for k in ["year", "years", "senior", "lead", "developer", "engineer"]):
        exp_status = "demonstrated"
        exp_evidence = "The resume details professional roles and project work demonstrating relevant industry experience."

    # Education assessment
    edu_status = "unknown"
    edu_evidence = "No explicit degree or educational institution credentials were identified in the provided resume text."
    if any(k in res_lower for k in ["bachelor", "master", "degree", "bs", "ms", "phd", "university", "college"]):
        edu_status = "demonstrated"
        edu_evidence = "Degree or relevant academic coursework is documented in the provided resume."

    # Scoring: Required skills carry 75% weight, preferred carry 25% weight
    req_ratio = (matched_req_count / max(total_req_count, 1))
    pref_ratio = (matched_pref_count / max(total_pref_count, 1)) if total_pref_count > 0 else req_ratio
    score = int((req_ratio * 75) + (pref_ratio * 25))
    score = min(max(score, 10), 98)

    # Match Level
    if score >= 80:
        match_level = "Strong Match"
    elif score >= 60:
        match_level = "Moderate Match"
    else:
        match_level = "Low Match"

    # Confidence calculation
    word_count = len(resume_text.split())
    confidence = "High" if word_count > 70 and len(job_description.split()) > 30 else "Medium"
    if word_count < 30:
        confidence = "Low"

    # Strong Match Workflow details
    is_strong = score >= 80 or (matched_req_count == total_req_count and len(skill_gaps) <= 1)
    strong_match_data = None
    if is_strong:
        strong_match_data = StrongMatchDetails(
            is_strong_match=True,
            headline="You're a strong match for this role.",
            matching_skills=[s.name for s in required_skills + preferred_skills if s.already_present],
            matching_qualifications=[
                "Demonstrated relevant experience matching role expectations.",
                "Academic background or practical engineering projects documented."
            ],
            relevant_projects_or_experience=[
                "Documented backend engineering experience aligning with primary tech stack.",
                "Hands-on API development and database integration."
            ],
            minor_gaps=[g.skill for g in skill_gaps]
        )

    # Learning roadmap
    learning_roadmap = build_overall_roadmap(skill_gaps)

    # Candidate profile for live job discovery
    candidate_profile = extract_candidate_profile(resume_text, job_description)

    # Narrative explanation
    explanation = (
        f"The Requirement Match Score of {score}% reflects that {matched_req_count} of {total_req_count} required skills "
        f"and {matched_pref_count} of {total_pref_count} preferred skills were directly evidenced in the candidate's resume. "
        f"{len(skill_gaps)} skill gap(s) were identified because the corresponding evidence was not documented in the provided resume. "
        f"This evaluation assesses solely the provided text and is not a hiring guarantee."
    )

    return AnalyzeResponse(
        match_score=score,
        match_level=match_level,
        confidence=confidence,
        summary=f"Evaluated {total_req_count + total_pref_count} competencies against target job requirements.",
        required_skills=required_skills,
        preferred_skills=preferred_skills,
        experience_assessment=AssessmentDetail(status=exp_status, evidence=exp_evidence),
        education_assessment=AssessmentDetail(status=edu_status, evidence=edu_evidence),
        strengths=strengths,
        skill_gaps=skill_gaps,
        learning_plan=learning_plan,
        learning_roadmap=learning_roadmap,
        strong_match=strong_match_data,
        upskilling_plan=upskilling_plan,
        explanation=explanation,
        candidate_profile=candidate_profile
    )


async def analyze_with_gemini(resume_text: str, job_description: str) -> AnalyzeResponse:
    """Analyze resume and job description using Gemini or deterministic fallback."""
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

    if not api_key:
        logger.info("No Gemini API key detected. Using explainable deterministic matching engine.")
        return generate_fallback_analysis(resume_text, job_description)

    try:
        import httpx
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        prompt = (
            f"You are an ATS Resume Analysis & Skill Gap Specialist.\n"
            f"Evaluate the resume against the job description.\n"
            f"Separate Required from Preferred skills.\n"
            f"For every skill indicate status: 'Match', 'Partial Match', or 'Missing'.\n"
            f"For missing skills, generate actionable learning subtopics, practice tasks, project ideas, time estimates, and resume demonstration tips.\n\n"
            f"=== JOB DESCRIPTION ===\n{job_description}\n\n"
            f"=== RESUME ===\n{resume_text}\n\n"
            f"Return valid JSON matching the schema."
        )

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                url,
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "temperature": 0.2,
                        "responseMimeType": "application/json"
                    }
                }
            )

            if resp.status_code == 200:
                data = resp.json()
                text_content = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(text_content)
                # Ensure all new fields exist
                return AnalyzeResponse(**parsed)
            else:
                logger.warning(f"Gemini API returned status {resp.status_code}. Using deterministic engine.")
                return generate_fallback_analysis(resume_text, job_description)
    except Exception as e:
        logger.error(f"Error during Gemini analysis: {e}. Falling back to deterministic engine.")
        return generate_fallback_analysis(resume_text, job_description)
