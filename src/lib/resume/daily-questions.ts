import type { CareerAnalysis, InterviewQuestion, QuestionCategory } from "@/lib/ai/types";

export const DAILY_QUESTION_COUNT = 8;

/** Local calendar date as YYYY-MM-DD. */
export function todayDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dateSeed(dateKey: string): number {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const out = [...items];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function seededPick<T>(items: T[], count: number, seed: number): T[] {
  if (items.length <= count) return items;
  return seededShuffle(items, seed).slice(0, count);
}

type QuestionTemplate = Omit<InterviewQuestion, "id">;

const HR_POOL: QuestionTemplate[] = [
  { question: "Tell me about yourself.", category: "hr", difficulty: "Easy", topic: "Behavioral" },
  { question: "Describe a challenging technical problem you solved.", category: "hr", difficulty: "Medium", topic: "Behavioral" },
  { question: "Tell me about a time you had to learn something new quickly.", category: "hr", difficulty: "Medium", topic: "Behavioral" },
  { question: "Describe a situation where you disagreed with a teammate. How did you handle it?", category: "hr", difficulty: "Medium", topic: "Behavioral" },
  { question: "What is your biggest professional achievement so far?", category: "hr", difficulty: "Easy", topic: "Behavioral" },
  { question: "How do you prioritize tasks when everything seems urgent?", category: "hr", difficulty: "Medium", topic: "Behavioral" },
  { question: "Tell me about a project that didn't go as planned. What did you learn?", category: "hr", difficulty: "Hard", topic: "Behavioral" },
  { question: "Where do you see yourself in 3 years?", category: "hr", difficulty: "Easy", topic: "Behavioral" },
  { question: "How do you handle feedback or criticism?", category: "hr", difficulty: "Medium", topic: "Behavioral" },
  { question: "Describe a time you took initiative without being asked.", category: "hr", difficulty: "Medium", topic: "Behavioral" },
];

const ROLE_QUESTION_POOL: Record<string, QuestionTemplate[]> = {
  "ml-engineer": [
    { question: "How would you design an end-to-end ML pipeline from data collection to deployment?", category: "role-specific", difficulty: "Hard", topic: "ML Engineering" },
    { question: "Explain the difference between batch and online inference. When would you use each?", category: "role-specific", difficulty: "Medium", topic: "ML Engineering" },
    { question: "How do you monitor model performance in production?", category: "role-specific", difficulty: "Medium", topic: "MLOps" },
    { question: "Walk me through how you'd handle class imbalance in a training dataset.", category: "role-specific", difficulty: "Medium", topic: "Machine Learning" },
    { question: "What strategies do you use to prevent overfitting?", category: "role-specific", difficulty: "Medium", topic: "Machine Learning" },
    { question: "How would you version and reproduce ML experiments?", category: "role-specific", difficulty: "Hard", topic: "MLOps" },
  ],
  "data-scientist": [
    { question: "How do you decide which evaluation metric to use for a given problem?", category: "role-specific", difficulty: "Medium", topic: "Statistics" },
    { question: "Explain how you'd approach an A/B test analysis from start to finish.", category: "role-specific", difficulty: "Hard", topic: "Statistics" },
    { question: "When would you choose a simple model over a complex one?", category: "role-specific", difficulty: "Medium", topic: "Machine Learning" },
    { question: "How do you communicate technical findings to non-technical stakeholders?", category: "role-specific", difficulty: "Easy", topic: "Communication" },
    { question: "Describe your approach to exploratory data analysis.", category: "role-specific", difficulty: "Medium", topic: "Data Analysis" },
    { question: "How do you handle missing or noisy data in a dataset?", category: "role-specific", difficulty: "Medium", topic: "Data Cleaning" },
  ],
  "ai-engineer": [
    { question: "How would you fine-tune a pre-trained model for a specific use case?", category: "role-specific", difficulty: "Hard", topic: "Deep Learning" },
    { question: "Explain the trade-offs between different neural network architectures.", category: "role-specific", difficulty: "Hard", topic: "Deep Learning" },
    { question: "How do you evaluate the quality of an LLM's output?", category: "role-specific", difficulty: "Medium", topic: "LLMs" },
    { question: "What is RAG and when would you use it?", category: "role-specific", difficulty: "Medium", topic: "LLMs" },
    { question: "How would you optimize inference latency for a deployed model?", category: "role-specific", difficulty: "Hard", topic: "AI Engineering" },
    { question: "Describe how you'd build a prompt pipeline for a production AI feature.", category: "role-specific", difficulty: "Medium", topic: "LLMs" },
  ],
  "data-analyst": [
    { question: "How do you approach writing a SQL query for a complex business question?", category: "role-specific", difficulty: "Medium", topic: "SQL" },
    { question: "Walk me through how you'd build a dashboard to track KPIs.", category: "role-specific", difficulty: "Medium", topic: "Visualization" },
    { question: "How do you validate the accuracy of your analysis before presenting it?", category: "role-specific", difficulty: "Medium", topic: "Data Analysis" },
    { question: "Explain a time you found an insight that changed a business decision.", category: "role-specific", difficulty: "Medium", topic: "Business Impact" },
    { question: "What is the difference between a dimension and a measure in analytics?", category: "role-specific", difficulty: "Easy", topic: "Analytics" },
    { question: "How would you detect anomalies in time-series data?", category: "role-specific", difficulty: "Hard", topic: "Statistics" },
  ],
  "software-engineer": [
    { question: "Explain the trade-offs between monolithic and microservices architecture.", category: "role-specific", difficulty: "Hard", topic: "System Design" },
    { question: "How do you approach debugging a production issue?", category: "role-specific", difficulty: "Medium", topic: "Engineering" },
    { question: "What is your approach to writing maintainable, testable code?", category: "role-specific", difficulty: "Medium", topic: "Best Practices" },
    { question: "Describe how you'd design a rate-limiting system.", category: "role-specific", difficulty: "Hard", topic: "System Design" },
    { question: "How do you decide between SQL and NoSQL for a new feature?", category: "role-specific", difficulty: "Medium", topic: "Databases" },
    { question: "Walk me through your code review process.", category: "role-specific", difficulty: "Easy", topic: "Collaboration" },
  ],
  "fullstack-engineer": [
    { question: "How do you manage state across a full-stack application?", category: "role-specific", difficulty: "Medium", topic: "Architecture" },
    { question: "Explain how you'd optimize a slow-loading web page.", category: "role-specific", difficulty: "Medium", topic: "Performance" },
    { question: "How do you handle authentication and authorization in a web app?", category: "role-specific", difficulty: "Hard", topic: "Security" },
    { question: "Describe your approach to API design between frontend and backend.", category: "role-specific", difficulty: "Medium", topic: "API Design" },
    { question: "How would you implement real-time features in a web application?", category: "role-specific", difficulty: "Hard", topic: "Architecture" },
    { question: "What strategies do you use for responsive, accessible UI development?", category: "role-specific", difficulty: "Medium", topic: "Frontend" },
  ],
};

const TECHNICAL_TEMPLATES: ((skill: string) => QuestionTemplate)[] = [
  (skill) => ({
    question: `Explain your experience with ${skill} and where you've applied it.`,
    category: "technical",
    difficulty: "Medium",
    topic: skill,
  }),
  (skill) => ({
    question: `What are the key concepts someone should know about ${skill}?`,
    category: "technical",
    difficulty: "Easy",
    topic: skill,
  }),
  (skill) => ({
    question: `Compare ${skill} with an alternative technology. When would you choose each?`,
    category: "technical",
    difficulty: "Hard",
    topic: skill,
  }),
  (skill) => ({
    question: `Describe a real problem you solved using ${skill}.`,
    category: "technical",
    difficulty: "Medium",
    topic: skill,
  }),
  (skill) => ({
    question: `What are common pitfalls when working with ${skill}?`,
    category: "technical",
    difficulty: "Medium",
    topic: skill,
  }),
];

const RESUME_TEMPLATES: ((company: string) => QuestionTemplate)[] = [
  (company) => ({
    question: `Tell me about your role at ${company}.`,
    category: "resume",
    difficulty: "Easy",
    topic: "Experience",
    relatedTo: company,
  }),
  (company) => ({
    question: `What was your biggest contribution at ${company}?`,
    category: "resume",
    difficulty: "Medium",
    topic: "Experience",
    relatedTo: company,
  }),
  (company) => ({
    question: `What technologies did you use at ${company}, and why?`,
    category: "resume",
    difficulty: "Medium",
    topic: "Experience",
    relatedTo: company,
  }),
];

const PROJECT_TEMPLATES: ((name: string) => QuestionTemplate)[] = [
  (name) => ({
    question: `Walk me through ${name} — what problem did it solve?`,
    category: "projects",
    difficulty: "Medium",
    topic: "Projects",
    relatedTo: name,
  }),
  (name) => ({
    question: `What was the hardest technical challenge in ${name}?`,
    category: "projects",
    difficulty: "Hard",
    topic: "Projects",
    relatedTo: name,
  }),
  (name) => ({
    question: `If you rebuilt ${name} today, what would you do differently?`,
    category: "projects",
    difficulty: "Medium",
    topic: "Projects",
    relatedTo: name,
  }),
  (name) => ({
    question: `What metrics or results did ${name} achieve?`,
    category: "projects",
    difficulty: "Easy",
    topic: "Projects",
    relatedTo: name,
  }),
];

function buildSkillQuestions(analysis: CareerAnalysis, seed: number): QuestionTemplate[] {
  const skills = [
    ...analysis.skills.map((s) => s.name),
    ...analysis.bestRole.matchingSkills,
    ...analysis.skillGaps.map((g) => g.skill).filter((s) => s !== "Not Found"),
  ].filter((s, i, arr) => arr.indexOf(s) === i);

  if (skills.length === 0) return [];

  const templates = seededPick(TECHNICAL_TEMPLATES, 3, seed);
  const pickedSkills = seededPick(skills, templates.length, seed + 7);

  return templates.map((fn, i) => fn(pickedSkills[i] ?? skills[0]));
}

function buildResumeQuestions(analysis: CareerAnalysis, seed: number): QuestionTemplate[] {
  const companies = analysis.experience
    .map((e) => e.company)
    .filter((c) => c && c !== "Not Found");

  if (companies.length === 0) return [];

  const template = seededPick(RESUME_TEMPLATES, 1, seed + 3)[0];
  const company = seededPick(companies, 1, seed + 11)[0];
  return [template(company)];
}

function buildProjectQuestions(analysis: CareerAnalysis, seed: number): QuestionTemplate[] {
  const projects = analysis.projects.map((p) => p.name).filter((n) => n && n !== "Not Found");
  if (projects.length === 0) return [];

  const template = seededPick(PROJECT_TEMPLATES, 1, seed + 5)[0];
  const project = seededPick(projects, 1, seed + 13)[0];
  return [template(project)];
}

function buildRoleQuestions(analysis: CareerAnalysis, seed: number): QuestionTemplate[] {
  const pool = ROLE_QUESTION_POOL[analysis.bestRole.id] ?? [
    {
      question: `Why do you want to be a ${analysis.bestRole.title}?`,
      category: "role-specific" as QuestionCategory,
      difficulty: "Easy" as const,
      topic: analysis.bestRole.title,
    },
    {
      question: `What skills make you a strong candidate for ${analysis.bestRole.title}?`,
      category: "role-specific" as QuestionCategory,
      difficulty: "Medium" as const,
      topic: analysis.bestRole.title,
    },
  ];

  const gapQuestion: QuestionTemplate | null =
    analysis.bestRole.missingSkills.length > 0
      ? {
          question: `How would you prepare for a ${analysis.bestRole.title} interview given your gap in ${seededPick(analysis.bestRole.missingSkills, 1, seed + 17)[0]}?`,
          category: "role-specific",
          difficulty: "Medium",
          topic: analysis.bestRole.title,
        }
      : null;

  const picked = seededPick(pool, 2, seed + 19);
  return gapQuestion ? [...picked, gapQuestion] : picked;
}

/**
 * Generate today's interview questions tailored to the user's best-fit role.
 * Questions are deterministic per calendar day but change every day.
 */
export function generateDailyQuestions(
  analysis: CareerAnalysis,
  dateKey = todayDateKey(),
): InterviewQuestion[] {
  const seed = dateSeed(dateKey);

  const pools: QuestionTemplate[] = [
    ...buildSkillQuestions(analysis, seed),
    ...buildResumeQuestions(analysis, seed),
    ...buildProjectQuestions(analysis, seed),
    ...seededPick(HR_POOL, 2, seed + 23),
    ...buildRoleQuestions(analysis, seed),
  ];

  const unique = pools.filter(
    (q, i, arr) => arr.findIndex((x) => x.question === q.question) === i,
  );

  const daily = seededPick(unique, DAILY_QUESTION_COUNT, seed + 29);

  return daily.map((q, i) => ({
    ...q,
    id: `daily-${dateKey}-${i + 1}`,
  }));
}

export interface DailyQuestionSet {
  date: string;
  roleTitle: string;
  roleId: string;
  questions: InterviewQuestion[];
}

export function buildDailyQuestionSet(
  analysis: CareerAnalysis,
  dateKey = todayDateKey(),
): DailyQuestionSet {
  return {
    date: dateKey,
    roleTitle: analysis.bestRole.title,
    roleId: analysis.bestRole.id,
    questions: generateDailyQuestions(analysis, dateKey),
  };
}
