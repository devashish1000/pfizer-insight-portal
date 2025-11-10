import { ReactNode } from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { GlassCard } from "./GlassCard";

interface MetricCardWithTrendProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    direction: "up" | "down" | "flat";
    value: number;
    tooltip: string;
  };
  isLoading?: boolean;
  skeleton?: ReactNode;
}

export const MetricCardWithTrend = ({
  icon: Icon,
  label,
  value,
  trend,
  isLoading,
  skeleton,
}: MetricCardWithTrendProps) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case "up":
        return <TrendingUp className="w-4 h-4" />;
      case "down":
        return <TrendingDown className="w-4 h-4" />;
      case "flat":
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return "";
    switch (trend.direction) {
      case "up":
        return "text-success";
      case "down":
        return "text-destructive";
      case "flat":
        return "text-text-light-gray";
    }
  };

  if (isLoading && skeleton) {
    return <GlassCard>{skeleton}</GlassCard>;
  }

  return (
    <GlassCard className="group transition-all duration-300 hover:scale-105 hover:shadow-glow-cyan cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-cyan-glow transition-transform group-hover:scale-110" />
          <p className="text-sm text-text-light-gray">{label}</p>
        </div>
        {trend && (
          <div
            data-tooltip-id={`trend-${label.replace(/\s+/g, "-")}`}
            data-tooltip-content={trend.tooltip}
            className={`flex items-center gap-1 ${getTrendColor()} font-bold text-xs transition-all duration-300 group-hover:scale-110`}
          >
            {getTrendIcon()}
            <span>{trend.value > 0 ? "+" : ""}{trend.value.toFixed(1)}%</span>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-text-off-white transition-colors group-hover:text-cyan-glow">
        {value}
      </p>
      
      {trend && (
        <Tooltip
          id={`trend-${label.replace(/\s+/g, "-")}`}
          place="top"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            color: "#e2e8f0",
            borderRadius: "6px",
            padding: "4px 8px",
            fontSize: "12px",
            border: "1px solid rgba(6, 182, 212, 0.3)",
            boxShadow: "0 4px 12px rgba(6, 182, 212, 0.2)",
            zIndex: 1000,
          }}
        />
      )}
    </GlassCard>
  );
};
