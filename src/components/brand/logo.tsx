import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  className?: string;
  showWordmark?: boolean;
}

export function Logo({ href = "/", className, showWordmark = true }: LogoProps) {
  const mark = (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M4 15.5 9.5 10l3.5 3.5L20 6.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="6.5" r="1.8" fill="currentColor" />
        </svg>
      </span>
      {showWordmark && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          Role<span className="text-primary">Fit</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label="RoleFit home">
        {mark}
      </Link>
    );
  }
  return mark;
}
