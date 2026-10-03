from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="The candidate's resume text")
    job_description: str = Field(..., min_length=10, description="The job description text")


class SkillMatch(BaseModel):
    name: str
    status: str = Field(..., description="Match, Partial Match, or Missing")
    importance: str = Field(default="Required", description="Required or Preferred")
    evidence: str = Field(..., description="Demonstrated evidence or reason for gap")
    already_present: bool = Field(default=False, description="Whether skill is already present in resume")


class SkillGap(BaseModel):
    skill: str
    reason: str = Field(..., description="Why it matters for the target job")
    importance: str = Field(default="Required", description="Required or Preferred")
    priority: Optional[str] = Field(default="High", description="High, Medium, or Low")
    next_step: Optional[str] = Field(default=None, description="Suggested action aligned with upskilling")


class LearningPlanItem(BaseModel):
    skill: str
    importance: str = Field(default="Required", description="Required or Preferred")
    what_to_learn: str = Field(..., description="Core concept overview")
    subtopics: List[str] = Field(default_factory=list, description="Important subtopics to study")
    recommended_order: int = Field(default=1, description="Recommended learning sequence")
    practice_task: str = Field(..., description="Beginner-friendly practice task")
    project_idea: str = Field(..., description="Small, practical portfolio project idea")
    estimated_time: str = Field(..., description="Estimated study time, e.g. 1-2 weeks (8-12 hours)")
    resume_demonstration: str = Field(..., description="How to demonstrate this skill on resume")


class RoadmapWeek(BaseModel):
    week: str = Field(..., description="e.g. Week 1")
    focus: str = Field(..., description="Primary milestone")
    details: str = Field(..., description="Concrete objectives for the week")


class OverallLearningRoadmap(BaseModel):
    weeks: List[RoadmapWeek] = Field(default_factory=list)
    summary: str = Field(default="", description="High-level roadmap overview")


class StrongMatchDetails(BaseModel):
    is_strong_match: bool = Field(default=False)
    headline: str = Field(default="You're a strong match for this role.")
    matching_skills: List[str] = Field(default_factory=list)
    matching_qualifications: List[str] = Field(default_factory=list)
    relevant_projects_or_experience: List[str] = Field(default_factory=list)
    minor_gaps: List[str] = Field(default_factory=list)


class UpskillingItem(BaseModel):
    order: int = Field(default=1, description="Sequence order (e.g. 1, 2, 3)")
    skill: str
    priority: str = Field(default="High", description="High, Medium, or Low")
    why: str = Field(..., description="Why this skill should be prioritized")
    suggested_action: str = Field(..., description="Concrete actionable next step")


class AssessmentDetail(BaseModel):
    status: str = Field(default="unknown", description="demonstrated, partial, insufficient, or unknown")
    evidence: str = Field(..., description="Evidence found in resume or reason for unknown")


class AnalyzeResponse(BaseModel):
    match_score: int = Field(..., ge=0, le=100, description="Requirement Match Score percentage (0-100)")
    match_level: str = Field(default="Moderate Match", description="Low Match, Moderate Match, or Strong Match")
    confidence: str = Field(default="Medium", description="High, Medium, or Low")
    summary: str = Field(..., description="Concise professional summary")
    required_skills: List[SkillMatch] = Field(default_factory=list)
    preferred_skills: List[SkillMatch] = Field(default_factory=list)
    experience_assessment: AssessmentDetail
    education_assessment: AssessmentDetail
    strengths: List[str] = Field(default_factory=list)
    skill_gaps: List[SkillGap] = Field(default_factory=list)
    learning_plan: List[LearningPlanItem] = Field(default_factory=list)
    learning_roadmap: OverallLearningRoadmap = Field(default_factory=OverallLearningRoadmap)
    strong_match: Optional[StrongMatchDetails] = None
    upskilling_plan: List[UpskillingItem] = Field(default_factory=list)
    explanation: str = Field(..., description="Explainable analysis breakdown")
    candidate_profile: Dict[str, Any] = Field(default_factory=dict)


class RecheckRequest(BaseModel):
    original_resume_text: str = Field(default="")
    updated_resume_text: str = Field(..., min_length=10)
    job_description: str = Field(..., min_length=10)
    previous_match_score: int = Field(default=0)
    previous_missing_skills: List[str] = Field(default_factory=list)


class RecheckResponse(BaseModel):
    previous_match_score: int
    new_match_score: int
    score_delta: int
    resolved_requirements: List[str] = Field(default_factory=list)
    remaining_gaps: List[str] = Field(default_factory=list)
    analysis: AnalyzeResponse


class JobOpportunity(BaseModel):
    id: str
    company_name: str
    job_title: str
    location: str
    work_type: str = Field(default="Remote", description="Remote, Hybrid, or On-site")
    required_skills: List[str] = Field(default_factory=list)
    why_matched: str = Field(..., description="Evidence-based match reason")
    missing_or_preferred_skills: List[str] = Field(default_factory=list)
    posting_date: Optional[str] = None
    application_link: str


class JobSearchRequest(BaseModel):
    query: Optional[str] = None
    skills: Optional[List[str]] = Field(default_factory=list)
    location: Optional[str] = "Remote"
    work_type: Optional[str] = "all"  # all, remote, hybrid, onsite
    experience_level: Optional[str] = None


class JobSearchResponse(BaseModel):
    jobs: List[JobOpportunity] = Field(default_factory=list)
    total_count: int = 0
    data_source: str = "Live Real-Time Job Feed (Verified Public API)"


class CompanyInfo(BaseModel):
    name: str
    location: str
    industry: str
    website: str
    careers_page: str
    has_active_openings: bool = False
    available_jobs: List[JobOpportunity] = Field(default_factory=list)


class CompanySearchResponse(BaseModel):
    location: str
    nearby_companies: List[CompanyInfo] = Field(default_factory=list)
    companies_with_openings: List[CompanyInfo] = Field(default_factory=list)
    notice: str = "A company being nearby does NOT mean it currently has an opening."


class HealthResponse(BaseModel):
    status: str = "ok"
