import type {
  CareerAnalysis,
  BestRole,
  RecommendedRole,
  SkillGap,
  InterviewTopic,
  InterviewQuestion,
  ResumeImprovement,
  RoadmapStep,
  SkillLevel,
  GapSeverity,
  Priority,
} from "@/lib/ai/types";
import type { ParsedResume } from "./parse-resume";
import { ROLE_CATALOG, type RoleDefinition } from "./role-catalog";

function skillNames(parsed: ParsedResume): Set<string> {
  return new Set(parsed.skills.map((s) => s.name));
}

function levelOf(parsed: ParsedResume, skill: string): SkillLevel {
  return parsed.skills.find((s) => s.name === skill)?.level ?? "None";
}

function gapSeverity(yours: SkillLevel, required: SkillLevel): GapSeverity {
  const rank: Record<SkillLevel, number> = { None: 0, Beginner: 1, Intermediate: 2, Strong: 3 };
  const diff = rank[required] - rank[yours];
  if (diff <= 0) return "low";
  if (diff === 1) return "medium";
  return "high";
}

function matchRole(role: RoleDefinition, found: Set<string>): {
  score: number;
  matching: string[];
  missing: string[];
} {
  const allRequired = role.requiredSkills;
  const allNice = role.niceToHave;
  const matchingReq = allRequired.filter((s) => found.has(s));
  const matchingNice = allNice.filter((s) => found.has(s));
  const missing = [...allRequired, ...allNice].filter((s) => !found.has(s));

  const reqScore = allRequired.length ? (matchingReq.length / allRequired.length) * 70 : 0;
  const niceScore = allNice.length ? (matchingNice.length / allNice.length) * 30 : 0;
  const score = Math.round(Math.min(95, reqScore + niceScore));

  return {
    score,
    matching: [...matchingReq, ...matchingNice],
    missing: missing.slice(0, 5),
  };
}

function buildRoleResult(role: RoleDefinition, parsed: ParsedResume): RecommendedRole {
  const found = skillNames(parsed);
  const { score, matching, missing } = matchRole(role, found);
  const requirements = [...role.requiredSkills, ...role.niceToHave.slice(0, 2)].map((skill) => {
    const yours = levelOf(parsed, skill);
    const required: SkillLevel = role.requiredSkills.includes(skill) ? "Strong" : "Intermediate";
    return {
      skill,
      yourLevel: found.has(skill) ? yours : "None",
      requiredLevel: required,
      gap: gapSeverity(found.has(skill) ? yours : "None", required),
    };
  });

  return {
    id: role.id,
    title: role.title,
    matchScore: score,
    summary: buildRoleSummary(role.title, score, matching, missing),
    matchingSkills: matching.slice(0, 6),
    missingSkills: missing.slice(0, 4),
    requirements,
  };
}

function buildRoleSummary(title: string, score: number, matching: string[], missing: string[]) {
  if (score >= 75) {
    return `Strong alignment for ${title}. Your resume shows ${matching.slice(0, 3).join(", ") || "relevant fundamentals"}.`;
  }
  if (score >= 55) {
    return `Moderate fit for ${title}. Strengthen ${missing.slice(0, 2).join(" and ") || "key skills"} to improve your match.`;
  }
  return `Early fit for ${title}. Focus on building ${missing.slice(0, 3).join(", ") || "core requirements"} found in your target role.`;
}

function computeScores(parsed: ParsedResume, bestScore: number) {
  const skillScore = Math.min(100, 40 + parsed.skills.length * 6);
  const expScore = Math.min(100, 30 + parsed.experience.length * 15);
  const projScore = Math.min(100, 35 + parsed.projects.length * 12);
  const eduScore = Math.min(100, 40 + parsed.education.length * 20);
  const atsScore = Math.min(
    100,
    50 +
      (parsed.email ? 10 : 0) +
      (parsed.skills.length > 5 ? 15 : 0) +
      (parsed.experience.length > 0 ? 15 : 0),
  );
  const resumeScore = Math.round((skillScore + expScore + projScore + eduScore + atsScore) / 5);
  const careerReadiness = Math.round((resumeScore + bestScore) / 2);

  return {
    resumeScore,
    careerReadiness,
    scoreBreakdown: {
      skills: skillScore,
      experience: expScore,
      projects: projScore,
      education: eduScore,
      ats: atsScore,
    },
    readiness: {
      resumeScore,
      roleFit: bestScore,
      interviewReadiness: Math.max(40, Math.round(bestScore * 0.75)),
      skillStrength: skillScore,
    },
  };
}

function buildSkillGaps(parsed: ParsedResume, bestRole: RecommendedRole): SkillGap[] {
  const gaps: SkillGap[] = [];

  for (const req of bestRole.requirements) {
    if (req.gap === "low") {
      gaps.push({
        skill: req.skill,
        category: "strong",
        currentLevel: req.yourLevel,
        targetLevel: req.requiredLevel,
        progress: 85,
      });
    } else if (req.gap === "medium") {
      gaps.push({
        skill: req.skill,
        category: "improve",
        currentLevel: req.yourLevel,
        targetLevel: req.requiredLevel,
        progress: 55,
      });
    } else {
      gaps.push({
        skill: req.skill,
        category: "critical",
        currentLevel: req.yourLevel,
        targetLevel: req.requiredLevel,
        progress: req.yourLevel === "None" ? 10 : 30,
      });
    }
  }

  for (const skill of parsed.skills.filter((s) => s.level === "Strong").slice(0, 3)) {
    if (!gaps.some((g) => g.skill === skill.name)) {
      gaps.push({
        skill: skill.name,
        category: "strong",
        currentLevel: skill.level,
        targetLevel: "Strong",
        progress: 90,
      });
    }
  }

  return gaps.slice(0, 12);
}

function buildInterviewFocus(parsed: ParsedResume, bestRole: RecommendedRole): InterviewTopic[] {
  const topics: InterviewTopic[] = [];
  const topSkills = parsed.skills.slice(0, 6);

  for (const skill of topSkills) {
    topics.push({
      topic: skill.name,
      priority: skill.level === "Strong" ? "high" : "medium",
      currentLevel: skill.level,
      requiredLevel: "Strong",
      recommendation: `Review ${skill.name} fundamentals and be ready to explain how you've used it.`,
    });
  }

  if (parsed.projects.length > 0) {
    topics.push({
      topic: "Your Projects",
      priority: "high",
      currentLevel: "Intermediate",
      requiredLevel: "Strong",
      recommendation: "Prepare a clear narrative for each project: problem, approach, outcome.",
    });
  }

  for (const missing of bestRole.missingSkills.slice(0, 3)) {
    topics.push({
      topic: missing,
      priority: "low",
      currentLevel: "None",
      requiredLevel: "Intermediate",
      recommendation: `Learn the basics of ${missing} to strengthen your ${bestRole.title} profile.`,
    });
  }

  return topics;
}

function buildInterviewQuestions(parsed: ParsedResume, bestRole: RecommendedRole): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];
  let id = 1;

  for (const skill of parsed.skills.slice(0, 5)) {
    questions.push({
      id: `t${id++}`,
      question: `Explain your experience with ${skill.name} and where you've applied it.`,
      category: "technical",
      difficulty: "Medium",
      topic: skill.name,
    });
  }

  for (const exp of parsed.experience.slice(0, 3)) {
    if (exp.company !== "Not Found") {
      questions.push({
        id: `r${id++}`,
        question: `Tell me about your role at ${exp.company}.`,
        category: "resume",
        difficulty: "Easy",
        topic: "Experience",
        relatedTo: exp.company,
      });
    }
  }

  for (const project of parsed.projects.slice(0, 3)) {
    questions.push({
      id: `p${id++}`,
      question: `Walk me through ${project.name} — what problem did it solve?`,
      category: "projects",
      difficulty: "Medium",
      topic: "Projects",
      relatedTo: project.name,
    });
  }

  questions.push(
    {
      id: `h${id++}`,
      question: "Tell me about yourself.",
      category: "hr",
      difficulty: "Easy",
      topic: "Behavioral",
    },
    {
      id: `h${id++}`,
      question: "Describe a challenging technical problem you solved.",
      category: "hr",
      difficulty: "Medium",
      topic: "Behavioral",
    },
  );

  questions.push({
    id: `rs${id++}`,
    question: `Why do you want to be a ${bestRole.title}?`,
    category: "role-specific",
    difficulty: "Easy",
    topic: bestRole.title,
  });

  return questions;
}

function buildImprovements(parsed: ParsedResume): ResumeImprovement[] {
  const items: ResumeImprovement[] = [];
  let id = 1;

  const hasMetrics = /\d+%|\d+x|\$\d+|\d+\+/.test(parsed.rawText);
  if (!hasMetrics) {
    items.push({
      id: `imp${id++}`,
      impact: "high",
      title: "Add measurable results to your projects and experience",
      before: "Built a machine learning model.",
      after: "Built a machine learning model achieving 91% accuracy on validation data.",
    });
  }

  if (!/github\.com/i.test(parsed.rawText)) {
    items.push({
      id: `imp${id++}`,
      impact: "medium",
      title: "Add GitHub links",
      description: "Link projects to public repositories so recruiters can verify your work.",
    });
  }

  if (parsed.skills.length < 5) {
    items.push({
      id: `imp${id++}`,
      impact: "medium",
      title: "Expand your skills section",
      description: "List tools and technologies explicitly so ATS and recruiters can match your profile.",
    });
  }

  if (parsed.candidateName === "Not Found") {
    items.push({
      id: `imp${id++}`,
      impact: "high",
      title: "Add your full name at the top",
      description: "Place your name clearly on the first line of your resume.",
    });
  }

  items.push({
    id: `imp${id++}`,
    impact: "low",
    title: "Mirror keywords from your target role",
    description: "Use the exact terminology from job descriptions you are applying to.",
  });

  return items;
}

function buildRoadmap(bestRole: RecommendedRole, gaps: SkillGap[]): RoadmapStep[] {
  const critical = gaps.filter((g) => g.category === "critical").slice(0, 2);
  const improve = gaps.filter((g) => g.category === "improve").slice(0, 2);
  const steps: RoadmapStep[] = [];
  let step = 1;

  for (const g of critical) {
    steps.push({
      step: step++,
      title: `Learn ${g.skill}`,
      description: `Move from ${g.currentLevel} to ${g.targetLevel} for your target role.`,
      status: step === 2 ? "in-progress" : "upcoming",
      estimate: "2-3 weeks",
    });
  }

  for (const g of improve) {
    steps.push({
      step: step++,
      title: `Improve ${g.skill}`,
      description: `Strengthen ${g.skill} to meet ${bestRole.title} expectations.`,
      status: "upcoming",
      estimate: "2 weeks",
    });
  }

  steps.push(
    {
      step: step++,
      title: "Practice technical interviews",
      description: "Complete mock questions across your top skills and projects.",
      status: "upcoming",
      estimate: "3-4 weeks",
    },
    {
      step: step++,
      title: `Apply for ${bestRole.title} roles`,
      description: "Target positions that match your strengthened profile.",
      status: "upcoming",
      estimate: "Ongoing",
    },
  );

  if (steps.length > 0) steps[0].status = "done";

  return steps.slice(0, 6);
}

/** Build a full CareerAnalysis grounded only in parsed resume content. */
export function buildAnalysisFromResume(parsed: ParsedResume): CareerAnalysis {
  const roles = ROLE_CATALOG.map((r) => buildRoleResult(r, parsed)).sort(
    (a, b) => b.matchScore - a.matchScore,
  );

  const best = roles[0];
  const bestRole: BestRole = {
    id: best.id,
    title: best.title,
    matchScore: best.matchScore,
    summary: best.summary,
    matchingSkills: best.matchingSkills,
    missingSkills: best.missingSkills,
  };

  const scores = computeScores(parsed, best.matchScore);
  const skillGaps = buildSkillGaps(parsed, best);

  return {
    candidateName: parsed.candidateName,
    ...scores,
    bestRole,
    recommendedRoles: roles.slice(0, 5),
    education: parsed.education.length ? parsed.education : [],
    experience: parsed.experience.length ? parsed.experience : [],
    skills: parsed.skills,
    skillGaps,
    interviewFocus: buildInterviewFocus(parsed, best),
    projects: parsed.projects,
    interviewQuestions: buildInterviewQuestions(parsed, best),
    resumeImprovements: buildImprovements(parsed),
    careerRoadmap: buildRoadmap(best, skillGaps),
  };
}
