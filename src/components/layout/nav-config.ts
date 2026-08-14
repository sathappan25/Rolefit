import {
  LayoutDashboard,
  FileText,
  Target,
  TrendingUp,
  MessageSquareText,
  FolderGit2,
  Map,
  Sparkles,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const mainNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Resume Analyzer", href: "/dashboard/resume-analyzer", icon: FileText },
  { label: "My Roles", href: "/dashboard/roles", icon: Target },
  { label: "Skill Gaps", href: "/dashboard/skill-gaps", icon: TrendingUp },
  { label: "Interview Prep", href: "/dashboard/interview-prep", icon: MessageSquareText },
  { label: "My Projects", href: "/dashboard/projects", icon: FolderGit2 },
  { label: "Career Roadmap", href: "/dashboard/roadmap", icon: Map },
  { label: "Improve Resume", href: "/dashboard/resume-improvement", icon: Sparkles },
];

export const bottomNav: NavItem[] = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];
