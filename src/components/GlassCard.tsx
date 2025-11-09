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
        "bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6",
        "shadow-[0_4px_12px_hsl(215_50%_3%/0.5)]",
        hover && "transition-all duration-300 hover:shadow-[0_0_20px_hsl(189_85%_55%/0.15)] hover:border-primary/30",
        className
      )}
    >
      {children}
    </div>
  );
};
