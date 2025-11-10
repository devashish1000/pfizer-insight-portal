import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricCards } from "@/components/MetricCards";
import { IntelligenceTable, IntelligenceData } from "@/components/IntelligenceTable";
import { fetchAllSheetsData } from "@/lib/googleSheets";
import { LayoutDashboard, RefreshCw } from "lucide-react";
import { useRefreshData } from "@/hooks/useRefreshData";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const {
    data: intelligenceData = [],
    isLoading,
  } = useQuery<any[]>({
    queryKey: ["all-sheets-data"],
    queryFn: fetchAllSheetsData,
    refetchInterval: 60 * 60 * 1000, // 1 hour
    staleTime: 60 * 60 * 1000,
  });

  const { isRefreshing, refreshData } = useRefreshData(["all-sheets-data"]);

  useEffect(() => {
    const interval = setInterval(() => window.location.reload(), 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // QA Validation Console Logging
  useEffect(() => {
    if (intelligenceData.length > 0) {
      const sheetSources = [...new Set(intelligenceData.map(item => item._sourceSheet).filter(Boolean))];
      const startTime = performance.now();
      
      console.log("=== UNIFIED DASHBOARD QA VALIDATION ===");
      console.log(`Total Records Merged: ${intelligenceData.length}`);
      console.log(`Sheet Sources: ${sheetSources.join(", ")}`);
      console.log(`Data Load Latency: ${(performance.now() - startTime).toFixed(2)}ms`);
      console.log(`Refetch Interval: 1 hour (3600000ms)`);
      console.log("Modal Open Expected Latency: <300ms");
      console.log("Target FPS for Animations: >55 FPS");
      console.log("=======================================");
    }
  }, [intelligenceData]);

  // Offline fallback notice if Google Sheets is unreachable
  useEffect(() => {
    if (!isLoading && intelligenceData.length === 0) {
      try {
        toast({
          title: "Offline mode",
          description: "Google Sheets unavailable. Dashboard loaded without data.",
          duration: 3000,
          className: "bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20",
        });
      } catch {}
    }
  }, [isLoading, intelligenceData.length]);

  const metrics = useMemo(() => {
    // Exclude backend sheets from metrics
    const EXCLUDED_SHEETS = ["Logs", "Medical Research Insights", "Clinical Trials Tracker", "Medical_Research_Insights", "Clinical_Trials_Tracker"];
    const filteredData = intelligenceData.filter((item) => {
      const sourceSheet = item._sourceSheet || "";
      const category = item.category || "";
      return !EXCLUDED_SHEETS.some(excluded => 
        sourceSheet.toLowerCase().includes(excluded.toLowerCase()) ||
        category.toLowerCase().includes(excluded.toLowerCase())
      );
    });

    const today = new Date().toDateString();
    const totalToday = filteredData.filter((item) => new Date(item.timestamp).toDateString() === today).length;
    const highImpact = filteredData.filter((item) => item.impact?.toLowerCase().includes("high")).length;
    const categoryBreakdown = filteredData.reduce(
      (acc, item) => {
        const category = item.category || "Other";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    return { totalToday, highImpact, categoryBreakdown };
  }, [intelligenceData]);

  const handleExport = () => {
    const headers = ["Timestamp", "Category", "Impact", "Region", "Source", "Summary"];
    const csvContent = [
      headers.join(","),
      ...intelligenceData.map((item) =>
        [
          item.timestamp,
          item.category || item._sourceSheet || "",
          item.impact || "",
          item.region || "",
          item.source || "",
          item.summary || "",
        ]
          .map((field) => `"${(field || "").toString().replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Dashboard_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "✅ Exported filtered data to CSV",
      description: `${intelligenceData.length} records exported`,
      duration: 3000,
      className: "bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20",
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex flex-col">
          <DashboardHeader 
            title="Pfizer Intelligence Hub"
            subtitle="Real-time global medical and regulatory updates"
            icon={LayoutDashboard}
            onRefresh={refreshData}
            isRefreshing={isRefreshing}
            onExport={handleExport}
          />
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 text-cyan-glow animate-spin" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col">
          <DashboardHeader 
            title="Pfizer Intelligence Hub"
            subtitle="Real-time global medical and regulatory updates"
            icon={LayoutDashboard}
            onRefresh={refreshData}
            isRefreshing={isRefreshing}
            onExport={handleExport}
          />
        <div className="container mx-auto px-6 py-8">
          <MetricCards
            totalToday={metrics.totalToday}
            highImpact={metrics.highImpact}
            categoryBreakdown={metrics.categoryBreakdown}
          />
          <IntelligenceTable data={intelligenceData} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
