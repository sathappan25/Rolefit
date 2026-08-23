export interface RoleDefinition {
  id: string;
  title: string;
  requiredSkills: string[];
  niceToHave: string[];
}

export const ROLE_CATALOG: RoleDefinition[] = [
  {
    id: "ml-engineer",
    title: "Machine Learning Engineer",
    requiredSkills: ["Python", "Machine Learning", "SQL", "Git"],
    niceToHave: ["TensorFlow", "PyTorch", "Docker", "AWS", "MLOps", "Scikit-learn"],
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    requiredSkills: ["Python", "SQL", "Statistics", "Machine Learning"],
    niceToHave: ["Pandas", "Spark", "Deep Learning", "Scikit-learn"],
  },
  {
    id: "ai-engineer",
    title: "AI Engineer",
    requiredSkills: ["Python", "Machine Learning", "Deep Learning"],
    niceToHave: ["TensorFlow", "PyTorch", "Docker", "LLMs", "NLP"],
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    requiredSkills: ["SQL", "Excel", "Python"],
    niceToHave: ["Pandas", "Tableau", "Power BI", "Statistics"],
  },
  {
    id: "software-engineer",
    title: "Software Engineer",
    requiredSkills: ["Java", "Python", "Git", "Data Structures"],
    niceToHave: ["JavaScript", "TypeScript", "System Design", "Docker", "React"],
  },
  {
    id: "fullstack-engineer",
    title: "Full Stack Engineer",
    requiredSkills: ["JavaScript", "React", "Git", "SQL"],
    niceToHave: ["TypeScript", "Next.js", "Node.js", "Docker", "AWS"],
  },
];
