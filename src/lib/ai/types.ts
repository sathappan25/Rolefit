/**
 * Structured data contract for RoleFit's AI analysis.
 *
 * These types define the shape the UI consumes. Any AI/backend provider can be
 * plugged in behind `AiAnalysisService` as long as it returns this structure.
 */

/** Where a piece of information came from. Never fabricate — mark honestly. */
export type EvidenceSource = "found" | "inferred" | "not-found";

export type SkillLevel = "None" | "Beginner" | "Intermediate" | "Strong";

export type Priority = "high" | "medium" | "low";

export type GapSeverity = "low" | "medium" | "high";

export interface Skill {
  name: string;
  category: string;
  level: SkillLevel;
  source: EvidenceSource;
}

export interface Education {
  degree: string;
  university: string;
  graduationYear: string;
  source: EvidenceSource;
}

export interface Experience {
  company: string;
  position: string;
  duration: string;
  source: EvidenceSource;
}

export interface SkillRequirement {
  skill: string;
  yourLevel: SkillLevel;
  requiredLevel: SkillLevel;
  gap: GapSeverity;
}

export interface RecommendedRole {
  id: string;
  title: string;
  matchScore: number;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  requirements: SkillRequirement[];
}

export interface BestRole {
  id: string;
  title: string;
  matchScore: number;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
}

export interface SkillGap {
  skill: string;
  category: "critical" | "improve" | "strong";
  currentLevel: SkillLevel;
  targetLevel: SkillLevel;
  progress: number;
}

export interface InterviewTopic {
  topic: string;
  priority: Priority;
  currentLevel: SkillLevel;
  requiredLevel: SkillLevel;
  recommendation: string;
}

export interface Project {
  id: string;
  name: string;
  relevance: number;
  technologies: string[];
  whatToKnow: string[];
  likelyQuestions: string[];
  conceptsToRevise: string[];
  strength: number;
  source: EvidenceSource;
}

export type QuestionCategory =
  | "technical"
  | "resume"
  | "projects"
  | "hr"
  | "role-specific";

export interface InterviewQuestion {
  id: string;
  question: string;
  category: QuestionCategory;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  relatedTo?: string;
}

export interface ResumeImprovement {
  id: string;
  impact: Priority;
  title: string;
  before?: string;
  after?: string;
  description?: string;
}

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  status: "done" | "in-progress" | "upcoming";
  estimate: string;
}

export interface ScoreBreakdown {
  skills: number;
  experience: number;
  projects: number;
  education: number;
  ats: number;
}

export interface ReadinessBreakdown {
  resumeScore: number;
  roleFit: number;
  interviewReadiness: number;
  skillStrength: number;
}

export interface CareerAnalysis {
  candidateName: string;
  resumeScore: number;
  careerReadiness: number;
  scoreBreakdown: ScoreBreakdown;
  readiness: ReadinessBreakdown;
  bestRole: BestRole;
  recommendedRoles: RecommendedRole[];
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  skillGaps: SkillGap[];
  interviewFocus: InterviewTopic[];
  projects: Project[];
  interviewQuestions: InterviewQuestion[];
  resumeImprovements: ResumeImprovement[];
  careerRoadmap: RoadmapStep[];
}

export interface AnalysisStage {
  id: string;
  label: string;
}
