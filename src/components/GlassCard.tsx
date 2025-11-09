import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard = ({ children, className, hover = true }: GlassCardProps) => {
  return (
    <div
      className={cn(
        "glassmorphism rounded-xl p-4",
        hover && "transition-all duration-300 hover:border-cyan-glow/30",
        className
      )}
    >
      {children}
    </div>
  );
};
