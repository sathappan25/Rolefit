import { describe, it, expect } from "vitest";
import {
  extractCandidateName,
  extractEmail,
  extractSkillsFromText,
  parseResumeText,
} from "./parse-resume";
import { buildAnalysisFromResume } from "./build-analysis";

const SAMPLE_RESUME = `
Priya Sharma
priya.sharma@email.com

EDUCATION
B.Tech Computer Science, National Institute of Technology, 2025

EXPERIENCE
Machine Learning Intern at DataNova Analytics
May 2024 – Aug 2024

SKILLS
Python, Machine Learning, SQL, Pandas, Scikit-learn, TensorFlow, Git

PROJECTS
• Weather Forecasting — Built a regression model using Python, Pandas, and Scikit-learn
• Sentiment Analysis — NLP project using TensorFlow
`;

describe("parse-resume", () => {
  it("extracts candidate name from first line", () => {
    expect(extractCandidateName(SAMPLE_RESUME)).toBe("Priya Sharma");
  });

  it("extracts email", () => {
    expect(extractEmail(SAMPLE_RESUME)).toBe("priya.sharma@email.com");
  });

  it("finds skills only present in resume text", () => {
    const skills = extractSkillsFromText(SAMPLE_RESUME);
    const names = skills.map((s) => s.name);
    expect(names).toContain("Python");
    expect(names).toContain("Machine Learning");
    expect(names).not.toContain("Kubernetes");
  });

  it("builds analysis without inventing placeholder name", () => {
    const parsed = parseResumeText(SAMPLE_RESUME);
    const analysis = buildAnalysisFromResume(parsed);
    expect(analysis.candidateName).toBe("Priya Sharma");
    expect(analysis.skills.length).toBeGreaterThan(0);
    expect(analysis.recommendedRoles.length).toBeGreaterThan(0);
    expect(analysis.bestRole.matchScore).toBeGreaterThan(0);
  });

  it("returns Not Found when name is absent", () => {
    const text = "SKILLS\nPython, Java\nEXPERIENCE\nDeveloper at Acme Corp\n2023 – 2024";
    const parsed = parseResumeText(text);
    expect(parsed.candidateName).toBe("Not Found");
  });
});
