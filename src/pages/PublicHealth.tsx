import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { FilterBar } from "@/components/FilterBar";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Globe2, TrendingUp, AlertTriangle, Activity } from "lucide-react";

const PublicHealth = () => {
  // Dummy state for refresh - in production this would fetch actual data
  const handleRefresh = () => {
    console.log(`[${new Date().toLocaleTimeString()}] Public Health data refreshed`);
  };

  const filters = [
    { label: "Region" },
    { label: "Severity" },
    { label: "Timeframe" },
    { label: "Confidence" },
  ];

  const forecasts = [
    {
      id: "PH-2024-034",
      title: "Respiratory Virus Activity - Northern Hemisphere",
      region: "North America, Europe",
      severity: "Moderate",
      trend: "Increasing",
      confidence: "High",
      timeframe: "Next 4-6 weeks",
      summary: "Seasonal respiratory virus activity showing upward trajectory. Hospital admissions expected to peak in 3-4 weeks.",
      keyIndicators: ["Hospitalization Rate: +15%", "ICU Capacity: 78%", "Vaccine Coverage: 62%"],
    },
    {
      id: "PH-2024-035",
      title: "Vector-Borne Disease Risk Assessment - Tropical Regions",
      region: "Southeast Asia, Latin America",
      severity: "High",
      trend: "Stable",
      confidence: "Medium",
      timeframe: "Next 8-12 weeks",
      summary: "Climate patterns suggest sustained transmission risk. Enhanced surveillance and prevention measures recommended.",
      keyIndicators: ["Case Rate: Elevated", "Vector Density: High", "Climate Risk: Moderate"],
    },
    {
      id: "PH-2024-036",
      title: "Antimicrobial Resistance Pattern Changes",
      region: "Global",
      severity: "Moderate",
      trend: "Increasing",
      confidence: "High",
      timeframe: "Ongoing monitoring",
      summary: "Emerging resistance patterns detected in key pathogens. Stewardship programs showing positive impact.",
      keyIndicators: ["Resistance Rate: +8%", "New Patterns: 3", "Stewardship Compliance: 84%"],
    },
  ];

  const metrics = [
    { label: "Active Forecasts", value: "24", icon: TrendingUp, color: "text-cyan-glow" },
    { label: "High Priority Alerts", value: "6", icon: AlertTriangle, color: "text-warning" },
    { label: "Monitored Regions", value: "127", icon: Globe2, color: "text-cyan-glow" },
    { label: "Data Sources", value: "340", icon: Activity, color: "text-success" },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/30";
      case "moderate":
        return "bg-warning/10 text-warning border-warning/30";
      case "low":
        return "bg-success/10 text-success border-success/30";
      default:
        return "bg-muted/30 text-muted-foreground border-border/30";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend.toLowerCase()) {
      case "increasing":
        return "text-destructive";
      case "decreasing":
        return "text-success";
      case "stable":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col">
        <DashboardHeader 
          title="Public Health & Forecasts" 
          subtitle="Epidemiological monitoring and predictive health intelligence"
          icon={Globe2}
          onRefresh={handleRefresh}
        />
        
        <FilterBar filters={filters} />
        
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric) => (
              <GlassCard key={metric.label}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-light-gray mb-1">{metric.label}</p>
                    <p className="text-3xl font-bold text-text-off-white">{metric.value}</p>
                  </div>
                  <metric.icon className={`w-10 h-10 ${metric.color}`} />
                </div>
              </GlassCard>
            ))}
          </div>

          <GlassCard>
            <h2 className="text-xl font-semibold text-text-off-white mb-6">Active Public Health Forecasts</h2>
            <div className="space-y-4">
              {forecasts.map((forecast) => (
                <div
                  key={forecast.id}
                  className="p-5 rounded-lg bg-cyan-glow/5 border border-cyan-glow/10 hover:border-cyan-glow/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-foreground">{forecast.title}</h3>
                        <Badge variant="outline" className={getSeverityColor(forecast.severity)}>
                          {forecast.severity} Severity
                        </Badge>
                        <Badge variant="outline" className="border-border/30">
                          {forecast.confidence} Confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        <span className="font-medium">Region:</span> {forecast.region} • <span className="font-medium">Timeframe:</span> {forecast.timeframe}
                      </p>
                      <p className="text-sm text-foreground/80 mb-4">{forecast.summary}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Key Indicators</p>
                      <div className="space-y-1">
                        {forecast.keyIndicators.map((indicator, idx) => (
                          <p key={idx} className="text-sm text-foreground">• {indicator}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Trend Analysis</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`w-5 h-5 ${getTrendColor(forecast.trend)}`} />
                        <span className={`text-sm font-medium ${getTrendColor(forecast.trend)}`}>
                          {forecast.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PublicHealth;
