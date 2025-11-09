import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, AlertCircle, BarChart3 } from "lucide-react";

interface MetricCardsProps {
  totalToday: number;
  highImpact: number;
  categoryBreakdown: Record<string, number>;
}

export const MetricCards = ({ totalToday, highImpact, categoryBreakdown }: MetricCardsProps) => {
  const topCategory = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="border-border bg-gradient-to-br from-card to-card/80 hover:shadow-[var(--shadow-glow)] transition-all">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Updates Today</p>
              <p className="text-3xl font-bold text-foreground">{totalToday}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-gradient-to-br from-card to-card/80 hover:shadow-[var(--shadow-glow)] transition-all">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">High Impact</p>
              <p className="text-3xl font-bold text-warning">{highImpact}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-warning" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-gradient-to-br from-card to-card/80 hover:shadow-[var(--shadow-glow)] transition-all">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Top Category</p>
              <p className="text-xl font-bold text-foreground truncate">
                {topCategory ? topCategory[0] : "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">
                {topCategory ? `${topCategory[1]} updates` : "No data"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
