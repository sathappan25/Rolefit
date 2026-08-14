"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CareerAnalysis } from "@/lib/ai/types";
import { getAiService } from "@/lib/ai/service";
import {
  clearResumeFile,
  loadResumeFile,
  saveResumeFile,
  type SavedResumeMeta,
} from "@/lib/storage/resume-storage";

export interface User {
  name: string;
  email: string;
}

interface AppState {
  user: User;
  analysis: CareerAnalysis | null;
  resumeMeta: SavedResumeMeta | null;
  resumeFile: File | null;
  hydrated: boolean;
  analyzeResume: (file: File) => Promise<CareerAnalysis>;
  clearAnalysis: () => void;
  preparedQuestions: string[];
  togglePrepared: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

const ANALYSIS_KEY = "rolefit:analysis";
const PREPARED_KEY = "rolefit:prepared";
const RESUME_META_KEY = "rolefit:resume-meta";
const USER_KEY = "rolefit:user";

function displayNameFromAnalysis(analysis: CareerAnalysis | null): string {
  return analysis?.candidateName?.trim() || "Candidate";
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({ name: "Candidate", email: "" });
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null);
  const [resumeMeta, setResumeMeta] = useState<SavedResumeMeta | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [preparedQuestions, setPreparedQuestions] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const a = localStorage.getItem(ANALYSIS_KEY);
        const p = localStorage.getItem(PREPARED_KEY);
        const m = localStorage.getItem(RESUME_META_KEY);
        const u = localStorage.getItem(USER_KEY);

        let savedAnalysis: CareerAnalysis | null = null;
        if (a) {
          savedAnalysis = JSON.parse(a) as CareerAnalysis;
          if (!cancelled) setAnalysis(savedAnalysis);
        }

        if (p && !cancelled) setPreparedQuestions(JSON.parse(p));

        if (m) {
          const meta = JSON.parse(m) as SavedResumeMeta;
          if (!cancelled) setResumeMeta(meta);
        }

        const saved = await loadResumeFile();
        if (!cancelled && saved) {
          setResumeMeta(saved.meta);
          setResumeFile(saved.file);
          try {
            localStorage.setItem(RESUME_META_KEY, JSON.stringify(saved.meta));
          } catch {
            // ignore
          }
        }

        const nameFromResume = displayNameFromAnalysis(savedAnalysis);
        let nextUser: User = { name: nameFromResume, email: "" };
        if (u) {
          try {
            const parsed = JSON.parse(u) as User;
            nextUser = {
              name: savedAnalysis?.candidateName?.trim() || parsed.name || "Candidate",
              email: parsed.email || "",
            };
          } catch {
            // ignore
          }
        }
        if (!cancelled) {
          setUser(nextUser);
          localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
        }
      } catch {
        // ignore corrupt storage
      } finally {
        if (!cancelled) setHydrated(true);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const analyzeResume = useCallback(async (file: File) => {
    const result = await getAiService().analyzeResume(file);
    const nextUser: User = {
      name: displayNameFromAnalysis(result),
      email: "",
    };

    setAnalysis(result);
    setUser(nextUser);

    try {
      const meta = await saveResumeFile(file);
      setResumeMeta(meta);
      setResumeFile(file);
      localStorage.setItem(RESUME_META_KEY, JSON.stringify(meta));
    } catch {
      // file persistence failed; analysis can still proceed
      const fallbackMeta: SavedResumeMeta = {
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        uploadedAt: new Date().toISOString(),
      };
      setResumeMeta(fallbackMeta);
      setResumeFile(file);
      try {
        localStorage.setItem(RESUME_META_KEY, JSON.stringify(fallbackMeta));
      } catch {
        // ignore
      }
    }

    try {
      localStorage.setItem(ANALYSIS_KEY, JSON.stringify(result));
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } catch {
      // storage may be full; analysis still available in memory
    }

    return result;
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setResumeMeta(null);
    setResumeFile(null);
    setUser({ name: "Candidate", email: "" });
    localStorage.removeItem(ANALYSIS_KEY);
    localStorage.removeItem(RESUME_META_KEY);
    localStorage.removeItem(USER_KEY);
    void clearResumeFile();
  }, []);

  const togglePrepared = useCallback((id: string) => {
    setPreparedQuestions((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(PREPARED_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo<AppState>(
    () => ({
      user,
      analysis,
      resumeMeta,
      resumeFile,
      hydrated,
      analyzeResume,
      clearAnalysis,
      preparedQuestions,
      togglePrepared,
    }),
    [
      user,
      analysis,
      resumeMeta,
      resumeFile,
      hydrated,
      analyzeResume,
      clearAnalysis,
      preparedQuestions,
      togglePrepared,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
