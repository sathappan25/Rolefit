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

export interface User {
  name: string;
  email: string;
}

interface AppState {
  user: User;
  analysis: CareerAnalysis | null;
  hydrated: boolean;
  analyzeResume: (file: File) => Promise<CareerAnalysis>;
  clearAnalysis: () => void;
  preparedQuestions: string[];
  togglePrepared: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

const ANALYSIS_KEY = "rolefit:analysis";
const PREPARED_KEY = "rolefit:prepared";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({ name: "Candidate", email: "" });
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null);
  const [preparedQuestions, setPreparedQuestions] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const a = localStorage.getItem(ANALYSIS_KEY);
      const p = localStorage.getItem(PREPARED_KEY);
      if (a) {
        const savedAnalysis = JSON.parse(a) as CareerAnalysis;
        setAnalysis(savedAnalysis);
        setUser({ name: savedAnalysis.candidateName || "Candidate", email: "" });
      }
      if (p) setPreparedQuestions(JSON.parse(p));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  const analyzeResume = useCallback(async (file: File) => {
    const result = await getAiService().analyzeResume(file);
    setAnalysis(result);
    setUser({ name: result.candidateName || "Candidate", email: "" });
    try {
      localStorage.setItem(ANALYSIS_KEY, JSON.stringify(result));
    } catch {
      // storage may be full; analysis still available in memory
    }
    return result;
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    localStorage.removeItem(ANALYSIS_KEY);
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
      hydrated,
      analyzeResume,
      clearAnalysis,
      preparedQuestions,
      togglePrepared,
    }),
    [user, analysis, hydrated, analyzeResume, clearAnalysis, preparedQuestions, togglePrepared],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
