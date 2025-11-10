import { GlassCard } from "@/components/GlassCard";
import { TrendingUp, AlertCircle, BarChart3 } from "lucide-react";

interface MetricCardsProps {
  totalToday: number;
  highImpact: number;
  categoryBreakdown: Record<string, number>;
}

export const MetricCards = ({ totalToday, highImpact, categoryBreakdown }: MetricCardsProps) => {
  const topCategory = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)[0];

  // Determine activity level and color
  const getActivityIndicator = (count: number) => {
    if (count >= 10) return { emoji: "🟢", label: "High activity", color: "text-success" };
    if (count >= 5) return { emoji: "🟡", label: "Moderate activity", color: "text-warning" };
    return { emoji: "🔵", label: "Low activity", color: "text-info" };
  };

  const activityIndicator = topCategory ? getActivityIndicator(topCategory[1]) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Updates Today</p>
            <p className="text-3xl font-bold text-foreground">{totalToday}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">High Impact</p>
            <p className="text-3xl font-bold text-warning">{highImpact}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-warning" />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Top Category</p>
            <div className="flex items-center gap-2">
              {activityIndicator && (
                <span className="text-xl" title={activityIndicator.label}>
                  {activityIndicator.emoji}
                </span>
              )}
              <p className="text-xl font-semibold text-foreground truncate">
                {topCategory ? topCategory[0] : "N/A"}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {topCategory ? `${topCategory[1]} updates` : "No data"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-success" />
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
