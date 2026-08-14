import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo href="/" />
      <p className="mt-8 text-6xl font-bold tracking-tight text-primary">404</p>
      <h1 className="mt-3 text-2xl font-bold text-foreground">Page not found</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Back home
        </Link>
        <Link href="/dashboard" className={cn(buttonVariants())}>
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
