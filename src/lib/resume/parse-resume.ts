import type {
  Education,
  Experience,
  Project,
  Skill,
  SkillLevel,
  EvidenceSource,
} from "@/lib/ai/types";
import { SKILL_DICTIONARY } from "./skill-dictionary";

export interface ParsedResume {
  candidateName: string;
  email: string | null;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  rawText: string;
}

const NAME_SKIP = /^(resume|curriculum|vitae|cv|profile|summary|objective|contact)/i;
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const YEAR_RE = /\b(19|20)\d{2}\b/;
const DATE_RANGE_RE =
  /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\b\d{4}\s*[-–—]\s*\d{4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*(?:Present|Current)/i;

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsSkill(text: string, term: string): boolean {
  const pattern = new RegExp(`\\b${escapeRegex(term)}\\b`, "i");
  return pattern.test(text);
}

function countMentions(text: string, terms: string[]): number {
  let count = 0;
  for (const term of terms) {
    const pattern = new RegExp(`\\b${escapeRegex(term)}\\b`, "gi");
    const matches = text.match(pattern);
    count += matches?.length ?? 0;
  }
  return count;
}

function inferLevel(text: string, terms: string[]): SkillLevel {
  const mentions = countMentions(text, terms);
  const lower = text.toLowerCase();
  const strongHints = ["expert", "advanced", "proficient", "strong", "years of experience"];
  const hasStrong = terms.some((t) =>
    strongHints.some((h) => lower.includes(`${h} ${t.toLowerCase()}`) || lower.includes(`${t.toLowerCase()} ${h}`)),
  );
  if (hasStrong || mentions >= 4) return "Strong";
  if (mentions >= 2) return "Intermediate";
  return "Beginner";
}

export function extractEmail(text: string): string | null {
  return text.match(EMAIL_RE)?.[0] ?? null;
}

export function extractCandidateName(text: string): string | null {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 12);

  for (const line of lines) {
    if (line.includes("@") || line.length > 60) continue;
    if (NAME_SKIP.test(line)) continue;
    if (/\d{3}/.test(line)) continue;

    const words = line.split(/\s+/).filter(Boolean);
    if (words.length >= 2 && words.length <= 4) {
      const looksLikeName = words.every(
        (w) => /^[A-Z][a-z'.-]+$/.test(w) || /^[A-Z]{2,}$/.test(w),
      );
      if (looksLikeName) {
        return words.join(" ");
      }
    }
  }

  const nameLabel = text.match(/(?:^|\n)\s*(?:Name|Full Name)\s*[:\-]\s*([A-Za-z .'-]{3,60})/i);
  if (nameLabel?.[1]) return nameLabel[1].trim();

  return null;
}

export function extractSkillsFromText(text: string): Skill[] {
  const found: Skill[] = [];
  const projectSection = getSection(text, ["projects", "personal projects", "academic projects"]);
  const skillsSection = getSection(text, ["skills", "technical skills", "core competencies"]);

  for (const entry of SKILL_DICTIONARY) {
    const terms = [entry.name, ...(entry.aliases ?? [])];
    const inResume = terms.some((t) => containsSkill(text, t));
    if (!inResume) continue;

    const inSkillsSection = skillsSection
      ? terms.some((t) => containsSkill(skillsSection, t))
      : false;
    const inProjectsOnly =
      !inSkillsSection &&
      projectSection &&
      terms.some((t) => containsSkill(projectSection, t));

    found.push({
      name: entry.name,
      category: entry.category,
      level: inferLevel(text, terms),
      source: inProjectsOnly ? "inferred" : "found",
    });
  }

  return found;
}

function getSection(text: string, headers: string[]): string | null {
  const lower = text.toLowerCase();
  for (const header of headers) {
    const idx = lower.indexOf(header);
    if (idx === -1) continue;
    const rest = text.slice(idx);
    const nextHeader = rest.slice(header.length).search(/\n\s*[A-Z][A-Za-z &]{2,30}\s*\n/);
    return nextHeader > 0 ? rest.slice(0, header.length + nextHeader) : rest.slice(0, 800);
  }
  return null;
}

export function extractEducation(text: string): Education[] {
  const section = getSection(text, ["education", "academic background"]) ?? text;
  const results: Education[] = [];

  const degreePatterns = [
    /\b(B\.?\s*Tech\.?|Bachelor(?:'s)?(?: of Science| of Technology| Degree)?(?: in [A-Za-z &]+)?)\b[^.\n]{0,120}/gi,
    /\b(M\.?\s*Tech\.?|Master(?:'s)?(?: of Science| Degree)?(?: in [A-Za-z &]+)?)\b[^.\n]{0,120}/gi,
    /\b(B\.?\s*Sc\.?|B\.?\s*S\.?)\b[^.\n]{0,120}/gi,
    /\b(M\.?\s*Sc\.?|M\.?\s*S\.?)\b[^.\n]{0,120}/gi,
    /\bMBA\b[^.\n]{0,120}/gi,
  ];

  for (const pattern of degreePatterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(section)) !== null) {
      const chunk = match[0];
      const year = chunk.match(YEAR_RE)?.[0] ?? "Not Found";
      const uniMatch = chunk.match(
        /\b(?:University|Institute|College|IIT|NIT|BITS)[A-Za-z0-9 ,.'-]*/i,
      );
      results.push({
        degree: match[1]?.trim() ?? chunk.trim().slice(0, 80),
        university: uniMatch?.[0]?.trim() ?? "Not Found",
        graduationYear: year,
        source: "found",
      });
    }
  }

  return dedupeByKey(results, (e) => `${e.degree}-${e.university}`).slice(0, 3);
}

export function extractExperience(text: string): Experience[] {
  const section = getSection(text, ["experience", "work experience", "employment", "internship"]) ?? text;
  const lines = section.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const results: Experience[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const dateMatch = line.match(DATE_RANGE_RE);
    if (!dateMatch) continue;

    const duration = dateMatch[0];
    const context = [lines[i - 1], line, lines[i + 1]].filter(Boolean).join(" | ");

    const titleMatch = context.match(
      /\b(?:Intern|Engineer|Developer|Analyst|Scientist|Assistant|Manager|Consultant|Lead)[A-Za-z ]*/i,
    );
    const companyMatch = context.match(
      /\b(?:at|@)\s+([A-Z][A-Za-z0-9 &.,'-]{2,50})|\b([A-Z][A-Za-z0-9 &.,'-]{2,40})\s*(?:\||–|-)/,
    );

    results.push({
      position: titleMatch?.[0]?.trim() ?? "Not Found",
      company: companyMatch?.[1]?.trim() ?? companyMatch?.[2]?.trim() ?? "Not Found",
      duration,
      source: "found",
    });
  }

  return dedupeByKey(results, (e) => `${e.company}-${e.duration}`).slice(0, 5);
}

export function extractProjects(text: string): Project[] {
  const section = getSection(text, ["projects", "personal projects", "academic projects"]);
  if (!section) return [];

  const blocks = section
    .split(/\n(?=[•\-\*]|\d+\.)/)
    .map((b) => b.trim())
    .filter((b) => b.length > 20);

  return blocks.slice(0, 5).map((block, i) => {
    const firstLine = block.split(/\n/)[0]?.replace(/^[•\-\*\d.]+\s*/, "").trim() ?? `Project ${i + 1}`;
    const name = firstLine.slice(0, 80);
    const technologies = SKILL_DICTIONARY.filter((s) =>
      [s.name, ...(s.aliases ?? [])].some((t) => containsSkill(block, t)),
    ).map((s) => s.name);

    return {
      id: `project-${i + 1}`,
      name,
      relevance: Math.min(95, 60 + technologies.length * 8),
      technologies,
      whatToKnow: [
        "Be ready to explain the problem you solved and your approach.",
        "Know which tools you used and why you chose them.",
        "Prepare metrics or outcomes if they appear in your resume.",
      ],
      likelyQuestions: [
        `What was the main goal of ${name}?`,
        `Which technologies did you use in ${name} and why?`,
        `What was the hardest part of ${name}?`,
        `How would you improve ${name} if you rebuilt it today?`,
      ],
      conceptsToRevise: technologies.slice(0, 4),
      strength: Math.min(90, 50 + technologies.length * 10),
      source: "found" as EvidenceSource,
    };
  });
}

function dedupeByKey<T>(items: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function parseResumeText(text: string): ParsedResume {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  const name = extractCandidateName(normalized);

  return {
    candidateName: name ?? "Not Found",
    email: extractEmail(normalized),
    skills: extractSkillsFromText(normalized),
    education: extractEducation(normalized),
    experience: extractExperience(normalized),
    projects: extractProjects(normalized),
    rawText: normalized,
  };
}
