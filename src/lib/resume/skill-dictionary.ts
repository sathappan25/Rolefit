export interface SkillEntry {
  name: string;
  category: string;
  aliases?: string[];
}

/** Canonical skills RoleFit recognizes — only these are matched against resume text. */
export const SKILL_DICTIONARY: SkillEntry[] = [
  { name: "Python", category: "Programming", aliases: ["python3"] },
  { name: "Java", category: "Programming" },
  { name: "JavaScript", category: "Programming", aliases: ["js", "node.js", "nodejs"] },
  { name: "TypeScript", category: "Programming", aliases: ["ts"] },
  { name: "C++", category: "Programming" },
  { name: "Go", category: "Programming", aliases: ["golang"] },
  { name: "SQL", category: "Data" },
  { name: "Pandas", category: "Data" },
  { name: "NumPy", category: "Data", aliases: ["numpy"] },
  { name: "Spark", category: "Data", aliases: ["pyspark", "apache spark"] },
  { name: "Machine Learning", category: "Machine Learning", aliases: ["ml"] },
  { name: "Deep Learning", category: "Machine Learning", aliases: ["dl"] },
  { name: "Scikit-learn", category: "Machine Learning", aliases: ["sklearn", "scikit learn"] },
  { name: "TensorFlow", category: "Machine Learning", aliases: ["tensorflow"] },
  { name: "PyTorch", category: "Machine Learning", aliases: ["pytorch"] },
  { name: "NLP", category: "Machine Learning", aliases: ["natural language processing"] },
  { name: "Statistics", category: "Data" },
  { name: "Git", category: "Tools" },
  { name: "Docker", category: "Tools" },
  { name: "Kubernetes", category: "Tools", aliases: ["k8s"] },
  { name: "AWS", category: "Cloud", aliases: ["amazon web services"] },
  { name: "Azure", category: "Cloud" },
  { name: "GCP", category: "Cloud", aliases: ["google cloud"] },
  { name: "MLOps", category: "Cloud" },
  { name: "React", category: "Programming" },
  { name: "Next.js", category: "Programming", aliases: ["nextjs"] },
  { name: "Tableau", category: "Data" },
  { name: "Power BI", category: "Data", aliases: ["powerbi"] },
  { name: "Excel", category: "Data" },
  { name: "System Design", category: "Programming" },
  { name: "Data Structures", category: "Programming" },
  { name: "LLMs", category: "Machine Learning", aliases: ["large language models", "gpt", "llm"] },
];
