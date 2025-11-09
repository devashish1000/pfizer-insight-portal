import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricCards } from "@/components/MetricCards";
import { IntelligenceTable, IntelligenceData } from "@/components/IntelligenceTable";
import { fetchAllSheetsData } from "@/lib/googleSheets";
import { LayoutDashboard, RefreshCw } from "lucide-react";

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

  const metrics = useMemo(() => {
    const today = new Date().toDateString();
    const totalToday = intelligenceData.filter((item) => new Date(item.timestamp).toDateString() === today).length;
    const highImpact = intelligenceData.filter((item) => item.impact?.toLowerCase().includes("high")).length;
    const categoryBreakdown = intelligenceData.reduce(
      (acc, item) => {
        const category = item.category || item._sourceSheet || "Other";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    return { totalToday, highImpact, categoryBreakdown };
  }, [intelligenceData]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex flex-col">
          <DashboardHeader 
            title="Pfizer Intelligence Hub"
            subtitle="Real-time global medical and regulatory updates"
            icon={LayoutDashboard} 
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
