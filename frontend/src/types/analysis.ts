export type SkillStatus = 
  | 'Match' 
  | 'Partial Match' 
  | 'Missing' 
  | 'Matched' 
  | 'Partial' 
  | 'Gap' 
  | 'matched' 
  | 'partial' 
  | 'gap';

export interface SkillMatch {
  name: string;
  status: SkillStatus;
  importance: string; // "Required" | "Preferred"
  evidence: string;
  already_present?: boolean;
}

export interface SkillGap {
  skill: string;
  reason: string;
  importance?: string;
  priority?: string;
  next_step?: string;
}

export interface LearningPlanItem {
  skill: string;
  importance: string;
  what_to_learn: string;
  subtopics: string[];
  recommended_order: number;
  practice_task: string;
  project_idea: string;
  estimated_time: string;
  resume_demonstration: string;
}

export interface RoadmapWeek {
  week: string;
  focus: string;
  details: string;
}

export interface OverallLearningRoadmap {
  weeks: RoadmapWeek[];
  summary: string;
}

export interface StrongMatchDetails {
  is_strong_match: boolean;
  headline: string;
  matching_skills: string[];
  matching_qualifications: string[];
  relevant_projects_or_experience: string[];
  minor_gaps: string[];
}

export interface UpskillingItem {
  order: number;
  skill: string;
  priority: string;
  why: string;
  suggested_action: string;
}

export interface AssessmentDetail {
  status: 'demonstrated' | 'partial' | 'insufficient' | 'unknown' | string;
  evidence: string;
}

export interface CandidateProfile {
  target_job_title?: string;
  skills?: string[];
  experience_level?: string;
  education?: string;
  location?: string;
  work_type?: string;
}

export interface AnalyzeResponse {
  match_score: number;
  match_level?: 'Low Match' | 'Moderate Match' | 'Strong Match' | string;
  confidence: 'High' | 'Medium' | 'Low' | string;
  summary: string;
  required_skills: SkillMatch[];
  preferred_skills?: SkillMatch[];
  experience_assessment: AssessmentDetail;
  education_assessment: AssessmentDetail;
  strengths: string[];
  skill_gaps: SkillGap[];
  learning_plan?: LearningPlanItem[];
  learning_roadmap?: OverallLearningRoadmap;
  strong_match?: StrongMatchDetails | null;
  upskilling_plan: UpskillingItem[];
  explanation: string;
  candidate_profile?: CandidateProfile;
}

export interface AnalyzeRequest {
  resume_text: string;
  job_description: string;
}

export interface RecheckRequest {
  original_resume_text?: string;
  updated_resume_text: string;
  job_description: string;
  previous_match_score: number;
  previous_missing_skills: string[];
}

export interface RecheckResponse {
  previous_match_score: number;
  new_match_score: number;
  score_delta: number;
  resolved_requirements: string[];
  remaining_gaps: string[];
  analysis: AnalyzeResponse;
}

export interface JobOpportunity {
  id: string;
  company_name: string;
  job_title: string;
  location: string;
  work_type: 'Remote' | 'Hybrid' | 'On-site' | string;
  required_skills: string[];
  why_matched: string;
  missing_or_preferred_skills: string[];
  posting_date?: string | null;
  application_link: string;
}

export interface JobSearchRequest {
  query?: string;
  skills?: string[];
  location?: string;
  work_type?: string;
  experience_level?: string;
}

export interface JobSearchResponse {
  jobs: JobOpportunity[];
  total_count: number;
  data_source: string;
}

export interface CompanyInfo {
  name: string;
  location: string;
  industry: string;
  website: string;
  careers_page: string;
  has_active_openings: boolean;
  available_jobs: JobOpportunity[];
}

export interface CompanySearchResponse {
  location: string;
  nearby_companies: CompanyInfo[];
  companies_with_openings: CompanyInfo[];
  notice: string;
}

export type AnalysisErrorType = 'network_unavailable' | 'analysis_failed' | null;

export interface AnalysisError {
  type: AnalysisErrorType;
  message: string;
}
