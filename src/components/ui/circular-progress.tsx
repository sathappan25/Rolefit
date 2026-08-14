"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "./animated-counter";

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
  showValue?: boolean;
}

export function CircularProgress({
  value,
  size = 160,
  strokeWidth = 12,
  className,
  label,
  showValue = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = React.useState(circumference);

  React.useEffect(() => {
    const target = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
    const t = setTimeout(() => setOffset(target), 150);
    return () => clearTimeout(t);
  }, [value, circumference]);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="stroke-primary transition-[stroke-dashoffset] duration-1000 ease-out"
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatedCounter
            value={value}
            suffix="%"
            className="text-3xl font-bold tracking-tight text-foreground"
          />
          {label && <span className="mt-1 text-xs font-medium text-muted-foreground">{label}</span>}
        </div>
      )}
    </div>
  );
}
