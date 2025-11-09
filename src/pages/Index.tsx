import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { FilterBar } from "@/components/FilterBar";
import { MetricCards } from "@/components/MetricCards";
import { IntelligenceTable, IntelligenceData } from "@/components/IntelligenceTable";
import { fetchSheetData } from "@/lib/googleSheets";
import { LayoutDashboard, RefreshCw } from "lucide-react";

const Index = () => {
  const filters = [
    { label: "Category" },
    { label: "Impact" },
    { label: "Region" },
    { label: "Source" },
  ];

  const {
    data: intelligenceData = [],
    isLoading,
  } = useQuery<IntelligenceData[]>({
    queryKey: ["intelligence-data"],
    queryFn: fetchSheetData,
    refetchInterval: 2 * 60 * 60 * 1000,
    staleTime: 2 * 60 * 60 * 1000,
  });

  useEffect(() => {
    const interval = setInterval(() => window.location.reload(), 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const metrics = useMemo(() => {
    const today = new Date().toDateString();
    const totalToday = intelligenceData.filter((item) => new Date(item.timestamp).toDateString() === today).length;
    const highImpact = intelligenceData.filter((item) => item.impact.toLowerCase().includes("high")).length;
    const categoryBreakdown = intelligenceData.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
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
          <DashboardHeader icon={LayoutDashboard} />
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
        <DashboardHeader icon={LayoutDashboard} />
        <FilterBar filters={filters} />
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
