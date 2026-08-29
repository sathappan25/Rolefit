import { describe, it, expect } from "vitest";
import { parseResumeText } from "./parse-resume";
import { buildAnalysisFromResume } from "./build-analysis";
import {
  generateDailyQuestions,
  todayDateKey,
  DAILY_QUESTION_COUNT,
} from "./daily-questions";

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

describe("daily-questions", () => {
  const analysis = buildAnalysisFromResume(parseResumeText(SAMPLE_RESUME));

  it("generates a fixed count of questions per day", () => {
    const questions = generateDailyQuestions(analysis, "2026-08-29");
    expect(questions.length).toBe(DAILY_QUESTION_COUNT);
    expect(questions.every((q) => q.id.startsWith("daily-2026-08-29-"))).toBe(true);
  });

  it("produces different questions on different dates", () => {
    const day1 = generateDailyQuestions(analysis, "2026-08-29");
    const day2 = generateDailyQuestions(analysis, "2026-08-30");
    const texts1 = day1.map((q) => q.question).sort();
    const texts2 = day2.map((q) => q.question).sort();
    expect(texts1).not.toEqual(texts2);
  });

  it("is deterministic for the same date", () => {
    const a = generateDailyQuestions(analysis, "2026-08-29");
    const b = generateDailyQuestions(analysis, "2026-08-29");
    expect(a).toEqual(b);
  });

  it("includes role-specific questions for best-fit role", () => {
    const questions = generateDailyQuestions(analysis, "2026-08-29");
    const roleSpecific = questions.filter((q) => q.category === "role-specific");
    expect(roleSpecific.length).toBeGreaterThan(0);
    expect(roleSpecific.some((q) => q.topic.length > 0)).toBe(true);
  });

  it("returns today's date key in local format", () => {
    const key = todayDateKey(new Date(2026, 7, 29));
    expect(key).toBe("2026-08-29");
  });
});
