import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { FilterBar } from "@/components/FilterBar";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe2, TrendingUp, AlertTriangle, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PublicHealth = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedForecast, setSelectedForecast] = useState<typeof forecasts[0] | null>(null);
  
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

  const totalPages = Math.ceil(forecasts.length / itemsPerPage);
  const paginatedForecasts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return forecasts.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage]);

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

  const handleExport = () => {
    const headers = ["ID", "Title", "Region", "Severity", "Trend", "Confidence", "Timeframe", "Summary"];
    const csvContent = [
      headers.join(","),
      ...forecasts.map((forecast) =>
        [
          forecast.id,
          forecast.title,
          forecast.region,
          forecast.severity,
          forecast.trend,
          forecast.confidence,
          forecast.timeframe,
          forecast.summary,
        ]
          .map((field) => `"${(field || "").toString().replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Public_Health_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "✅ Exported filtered data to CSV",
      description: `${forecasts.length} forecasts exported`,
      duration: 3000,
      className: "bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20",
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col">
        <DashboardHeader 
          title="Public Health & Forecasts" 
          subtitle="Epidemiological monitoring and predictive health intelligence"
          icon={Globe2}
          onRefresh={handleRefresh}
          onExport={handleExport}
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

          <GlassCard className="overflow-hidden">
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-xl font-semibold text-text-off-white mb-6">Active Public Health Forecasts</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-cyan-glow/10 hover:bg-transparent">
                    <TableHead className="text-cyan-glow font-semibold">ID</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Title</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Region</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Severity</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Trend</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Confidence</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Timeframe</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedForecasts.map((forecast) => (
                    <TableRow 
                      key={forecast.id}
                      onClick={() => setSelectedForecast(forecast)}
                      className="border-cyan-glow/10 hover:bg-cyan-glow/5 transition-all duration-300 cursor-pointer"
                    >
                      <TableCell className="font-medium text-text-off-white">{forecast.id}</TableCell>
                      <TableCell className="text-text-off-white font-medium max-w-md">{forecast.title}</TableCell>
                      <TableCell className="text-text-off-white">{forecast.region}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getSeverityColor(forecast.severity)}>
                          {forecast.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${getTrendColor(forecast.trend)}`}>
                          {forecast.trend}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-border/30">
                          {forecast.confidence}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-text-off-white text-sm">{forecast.timeframe}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="px-6 py-4 border-t border-cyan-glow/10 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-text-light-gray">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, forecasts.length)} of {forecasts.length} forecasts
              </p>
              
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm font-semibold rounded-md border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ← Previous
                  </button>
                  <span className="text-sm font-semibold text-primary px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm font-semibold rounded-md border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Expandable Forecast Cards Below Table */}
          <GlassCard>
            <h2 className="text-xl font-semibold text-text-off-white mb-6">Forecast Details</h2>
            <div className="space-y-4">
              {paginatedForecasts.map((forecast) => (
                <div
                  key={forecast.id}
                  onClick={() => setSelectedForecast(forecast)}
                  className="p-5 rounded-lg bg-cyan-glow/5 border border-cyan-glow/10 hover:border-cyan-glow/30 transition-all duration-300 cursor-pointer"
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

        {/* Forecast Detail Modal */}
        <Dialog open={!!selectedForecast} onOpenChange={() => setSelectedForecast(null)}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-cyan-glow/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-foreground">
                {selectedForecast?.title}
              </DialogTitle>
            </DialogHeader>
            
            {selectedForecast && (
              <div className="space-y-6 mt-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getSeverityColor(selectedForecast.severity)}>
                    {selectedForecast.severity} Severity
                  </Badge>
                  <Badge variant="outline" className="border-border/30">
                    {selectedForecast.confidence} Confidence
                  </Badge>
                  <Badge variant="outline" className="border-border/30">
                    {selectedForecast.trend} Trend
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Forecast ID</p>
                    <p className="text-foreground">{selectedForecast.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Timeframe</p>
                    <p className="text-foreground">{selectedForecast.timeframe}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Region</p>
                    <p className="text-foreground">{selectedForecast.region}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Summary</p>
                  <p className="text-foreground leading-relaxed">{selectedForecast.summary}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Key Indicators</p>
                  <div className="space-y-2">
                    {selectedForecast.keyIndicators.map((indicator, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-glow mt-2" />
                        <p className="text-foreground">{indicator}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Trend Analysis</p>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-cyan-glow/5 border border-cyan-glow/10">
                    <TrendingUp className={`w-6 h-6 ${getTrendColor(selectedForecast.trend)}`} />
                    <div>
                      <p className={`text-lg font-semibold ${getTrendColor(selectedForecast.trend)}`}>
                        {selectedForecast.trend}
                      </p>
                      <p className="text-sm text-muted-foreground">Current trajectory</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default PublicHealth;
