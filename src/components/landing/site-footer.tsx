import { Logo } from "@/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <Logo href="/" />
          <p className="text-sm text-muted-foreground">
            Know your fit. Know your role. Ace your interview.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} RoleFit. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
