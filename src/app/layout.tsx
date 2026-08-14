import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store/app-store";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "RoleFit — Know your fit. Know your role. Ace your interview.",
  description:
    "RoleFit is an AI-powered career platform. Upload your resume to discover your best-fit roles, uncover skill gaps, and build a personalized interview preparation plan.",
  keywords: ["career", "resume analysis", "interview prep", "job roles", "skill gap", "AI"],
};

const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('rolefit:theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
