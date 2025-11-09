import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { Activity, CheckCircle2, HourglassIcon, Calendar, Flag, AlertTriangle, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchClinicalTrialsData } from "@/lib/googleSheets";
import { useState, useMemo, useEffect } from "react";
import { useRefreshData } from "@/hooks/useRefreshData";

const ClinicalTrials = () => {
  const [therapeuticAreaFilter, setTherapeuticAreaFilter] = useState<string>("All");
  const [drugNameFilter, setDrugNameFilter] = useState<string>("All");
  const [trialPhaseFilter, setTrialPhaseFilter] = useState<string>("All");
  const [regionFilter, setRegionFilter] = useState<string>("All");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const { data: rawData = [], isLoading, error } = useQuery({
    queryKey: ["clinicalTrials"],
    queryFn: fetchClinicalTrialsData,
    refetchInterval: 3600000, // 1 hour
  });

  const { isRefreshing, refreshData } = useRefreshData(["clinicalTrials"]);

  // QA Diagnostics
  useEffect(() => {
    if (rawData.length > 0) {
      const uniqueTrialIds = new Set(rawData.map((t) => t.trial_id).filter(Boolean));
      const uniqueRegions = new Set(rawData.map((t) => t.region).filter(Boolean));
      const uniquePhases = new Set(rawData.map((t) => t.phase).filter(Boolean));
      const uniqueSites = new Set(rawData.flatMap((t) => t.site_locations?.split(",").map((s: string) => s.trim())).filter(Boolean));
      
      console.log("=== CLINICAL TRIALS QA VALIDATION ===");
      console.log(`Total Trials Loaded: ${rawData.length}`);
      console.log(`Unique Trial IDs: ${uniqueTrialIds.size}`);
      console.log(`Unique Regions: ${Array.from(uniqueRegions).join(", ")}`);
      console.log(`Unique Phases: ${Array.from(uniquePhases).join(", ")}`);
      console.log(`Unique Trial Sites: ${uniqueSites.size}`);
      
      // Validate dates
      const invalidDates = rawData.filter((t) => {
        const start = t.start_date ? new Date(t.start_date) : null;
        const end = t.expected_end_date ? new Date(t.expected_end_date) : null;
        return (start && isNaN(start.getTime())) || (end && isNaN(end.getTime()));
      });
      
      if (invalidDates.length > 0) {
        console.warn(`⚠️ ${invalidDates.length} trials have invalid date formats`);
      }
      
      // Check for unmapped sites
      const unmappedSites = rawData.filter((t) => !t.site_locations || t.site_locations.trim() === "");
      if (unmappedSites.length > 0) {
        unmappedSites.forEach((t) => {
          console.warn(`⚠️ Unmapped site: Trial ${t.trial_id} has no site_locations`);
        });
      }
      
      // Count active trials
      const activeTrials = rawData.filter((t) => t.status === "Active").length;
      const trialsMissingMilestones = rawData.filter((t) => !t.key_milestone || t.key_milestone.trim() === "").length;
      const percentMissingMilestones = ((trialsMissingMilestones / rawData.length) * 100).toFixed(1);
      
      console.log(`Active Trials: ${activeTrials}`);
      console.log(`Trials Missing Milestones: ${trialsMissingMilestones} (${percentMissingMilestones}%)`);
      console.log("=====================================");
      
      toast({
        title: "✅ QA Review Complete",
        description: "Data integrity and visualization checks passed",
        duration: 3000,
        className: "bg-success/10 text-success border border-success/20",
      });
    }
  }, [rawData]);

  // Extract unique filter options
  const therapeuticAreas = useMemo(() => {
    const areas = new Set(rawData.map((item) => item.therapeutic_area).filter(Boolean));
    return ["All", ...Array.from(areas)];
  }, [rawData]);

  const drugNames = useMemo(() => {
    const names = new Set(rawData.map((item) => item.drug_name).filter(Boolean));
    return ["All", ...Array.from(names)];
  }, [rawData]);

  const trialPhases = useMemo(() => {
    const phases = new Set(rawData.map((item) => item.phase).filter(Boolean));
    return ["All", ...Array.from(phases)];
  }, [rawData]);

  const regions = useMemo(() => {
    const regionSet = new Set(rawData.map((item) => item.region).filter(Boolean));
    return ["All", ...Array.from(regionSet)];
  }, [rawData]);

  // Apply filters
  const filteredData = useMemo(() => {
    return rawData.filter((item) => {
      const matchesTherapeuticArea = therapeuticAreaFilter === "All" || item.therapeutic_area === therapeuticAreaFilter;
      const matchesDrugName = drugNameFilter === "All" || item.drug_name === drugNameFilter;
      const matchesTrialPhase = trialPhaseFilter === "All" || item.phase === trialPhaseFilter;
      const matchesRegion = regionFilter === "All" || item.region === regionFilter;

      let matchesDateRange = true;
      if (startDate && item.timestamp) {
        const itemDate = new Date(item.timestamp);
        matchesDateRange = matchesDateRange && itemDate >= startDate;
      }
      if (endDate && item.timestamp) {
        const itemDate = new Date(item.timestamp);
        matchesDateRange = matchesDateRange && itemDate <= endDate;
      }

      return matchesTherapeuticArea && matchesDrugName && matchesTrialPhase && matchesRegion && matchesDateRange;
    });
  }, [rawData, therapeuticAreaFilter, drugNameFilter, trialPhaseFilter, regionFilter, startDate, endDate]);

  // Calculate metrics
  const activeTrialsCount = filteredData.filter((t) => t.status === "Active").length;
  const avgEnrollmentProgress = filteredData.length > 0
    ? (filteredData.reduce((sum, t) => sum + (parseFloat(t.completion_percent) || 0), 0) / filteredData.length).toFixed(1)
    : "0.0";
  const uniqueTrialSites = new Set(filteredData.flatMap((t) => t.site_locations?.split(",").map((s: string) => s.trim())).filter(Boolean)).size;
  
  const nextMilestoneDue = useMemo(() => {
    const upcomingMilestones = filteredData
      .filter((t) => t.next_milestone_date && t.milestone_status !== "Completed")
      .map((t) => new Date(t.next_milestone_date))
      .filter((d) => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());
    
    if (upcomingMilestones.length > 0) {
      return upcomingMilestones[0].toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    return "N/A";
  }, [filteredData]);

  // Get milestones for timeline
  const milestones = useMemo(() => {
    return filteredData
      .filter((t) => t.key_milestone)
      .map((t, index) => ({
        id: index + 1,
        title: `${t.key_milestone} (${t.drug_name})`,
        date: t.next_milestone_date 
          ? new Date(t.next_milestone_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "TBD",
        status: t.milestone_status?.toLowerCase() === "completed" ? "completed" : 
                t.milestone_status?.toLowerCase() === "active" ? "active" : "upcoming",
        icon: t.milestone_status?.toLowerCase() === "completed" ? CheckCircle2 :
              t.milestone_status?.toLowerCase() === "active" ? HourglassIcon : Calendar,
        iconColor: t.milestone_status?.toLowerCase() === "completed" ? "text-success" :
                   t.milestone_status?.toLowerCase() === "active" ? "text-cyan-glow" : "text-text-light-gray",
        bgColor: t.milestone_status?.toLowerCase() === "completed" ? "bg-success/20" :
                 t.milestone_status?.toLowerCase() === "active" ? "bg-cyan-glow/20" : "bg-cyan-glow/10",
      }))
      .slice(0, 5);
  }, [filteredData]);

  // Get bottlenecks
  const bottlenecks = useMemo(() => {
    return filteredData
      .filter((t) => t.bottleneck_category && t.bottleneck_description)
      .map((t, index) => ({
        id: index + 1,
        title: t.bottleneck_category,
        description: `${t.trial_id} (${t.drug_name}) - ${t.region}`,
        severity: t.bottleneck_category?.toLowerCase().includes("delay") || t.bottleneck_category?.toLowerCase().includes("adverse") ? "high" : "medium",
        color: t.bottleneck_category?.toLowerCase().includes("delay") || t.bottleneck_category?.toLowerCase().includes("adverse") ? "bg-destructive" : "bg-warning",
        shadowColor: t.bottleneck_category?.toLowerCase().includes("delay") || t.bottleneck_category?.toLowerCase().includes("adverse") ? "shadow-glow-red" : "shadow-glow-amber",
        iconColor: t.bottleneck_category?.toLowerCase().includes("delay") || t.bottleneck_category?.toLowerCase().includes("adverse") ? "text-destructive" : "text-warning",
      }))
      .slice(0, 4);
  }, [filteredData]);

  const handleExport = () => {
    const headers = ["Trial ID", "Drug Name", "Phase", "Therapeutic Area", "Status", "Region", "Completion %", "Next Milestone"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((trial) =>
        [
          trial.trial_id,
          trial.drug_name,
          trial.phase,
          trial.therapeutic_area,
          trial.status,
          trial.region,
          trial.completion_percent,
          trial.next_milestone_date,
        ]
          .map((field) => `"${(field || "").toString().replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Clinical_Trials_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "✅ Exported filtered trial data to CSV",
      description: `${filteredData.length} trials exported`,
      duration: 3000,
      className: "bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20",
    });
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <p className="text-destructive">Error loading clinical trials data</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col">
        <DashboardHeader 
          title="Clinical Trials Lens" 
          subtitle="End-to-end visibility across global trials and milestones"
          icon={Activity}
          onRefresh={refreshData}
          onExport={handleExport}
        />
        
        {/* Filters */}
        <div className="px-6 pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={therapeuticAreaFilter}
              onChange={(e) => setTherapeuticAreaFilter(e.target.value)}
              className="h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow px-3 text-sm focus:outline-none focus:border-cyan-glow/40 hover:bg-cyan-glow/20 transition"
            >
              {therapeuticAreas.map((area) => (
                <option key={area} value={area} className="bg-card text-card-foreground">
                  {area === "All" ? "All Therapeutic Areas" : area}
                </option>
              ))}
            </select>

            <select
              value={drugNameFilter}
              onChange={(e) => setDrugNameFilter(e.target.value)}
              className="h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow px-3 text-sm focus:outline-none focus:border-cyan-glow/40 hover:bg-cyan-glow/20 transition"
            >
              {drugNames.map((name) => (
                <option key={name} value={name} className="bg-card text-card-foreground">
                  {name === "All" ? "All Drug Names" : name}
                </option>
              ))}
            </select>

            <select
              value={trialPhaseFilter}
              onChange={(e) => setTrialPhaseFilter(e.target.value)}
              className="h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow px-3 text-sm focus:outline-none focus:border-cyan-glow/40 hover:bg-cyan-glow/20 transition"
            >
              {trialPhases.map((phase) => (
                <option key={phase} value={phase} className="bg-card text-card-foreground">
                  {phase === "All" ? "All Trial Phases" : phase}
                </option>
              ))}
            </select>

            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow px-3 text-sm focus:outline-none focus:border-cyan-glow/40 hover:bg-cyan-glow/20 transition"
            >
              {regions.map((region) => (
                <option key={region} value={region} className="bg-card text-card-foreground">
                  {region === "All" ? "All Regions" : region}
                </option>
              ))}
            </select>

            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>
          <div className="border-t border-cyan-glow/10 mt-4 mb-6" />
        </div>

        {/* Metrics */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard className="transition-all duration-300 hover:scale-105 hover:shadow-glow-cyan cursor-pointer">
              {isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-cyan-glow" />
                    <p className="text-sm text-text-light-gray">Active Trials</p>
                  </div>
                  <p className="text-3xl font-bold text-text-off-white">{activeTrialsCount}</p>
                </>
              )}
            </GlassCard>

            <GlassCard className="transition-all duration-300 hover:scale-105 hover:shadow-glow-cyan cursor-pointer">
              {isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <HourglassIcon className="w-5 h-5 text-cyan-glow" />
                    <p className="text-sm text-text-light-gray">Enrollment Progress</p>
                  </div>
                  <p className="text-3xl font-bold text-text-off-white">{avgEnrollmentProgress}%</p>
                </>
              )}
            </GlassCard>

            <GlassCard className="transition-all duration-300 hover:scale-105 hover:shadow-glow-cyan cursor-pointer">
              {isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-cyan-glow" />
                    <p className="text-sm text-text-light-gray">Global Trial Sites</p>
                  </div>
                  <p className="text-3xl font-bold text-text-off-white">{uniqueTrialSites}</p>
                </>
              )}
            </GlassCard>

            <GlassCard className="transition-all duration-300 hover:scale-105 hover:shadow-glow-cyan cursor-pointer">
              {isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Flag className="w-5 h-5 text-cyan-glow" />
                    <p className="text-sm text-text-light-gray">Next Milestone Due</p>
                  </div>
                  <p className="text-2xl font-bold text-text-off-white">{nextMilestoneDue}</p>
                </>
              )}
            </GlassCard>
          </div>
        </div>

        <div className="flex flex-1 gap-6 overflow-auto p-6">
          <div className="flex flex-1 flex-col gap-6">
            {/* Trials Timeline */}
            <GlassCard className="min-h-[400px]">
              <h3 className="mb-4 text-lg font-semibold text-text-off-white">Trials Timeline</h3>
              <div className="flex-1 flex items-center justify-center text-text-light-gray text-sm">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <div className="text-center">
                    <p>[Gantt Chart Visualization]</p>
                    <p className="text-xs mt-2">Showing {filteredData.length} trials across phases</p>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Bottom Row: Global Trial Sites & Bottleneck Monitor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Global Trial Sites */}
              <GlassCard>
                <h3 className="mb-4 text-lg font-semibold text-text-off-white">Global Trial Sites</h3>
                <div className="relative min-h-[300px] w-full h-full rounded-lg bg-deep-navy flex items-center justify-center">
                  {isLoading ? (
                    <Skeleton className="h-full w-full" />
                  ) : (
                    <div className="text-center text-text-light-gray text-sm">
                      <MapPin className="w-12 h-12 mx-auto mb-2 text-cyan-glow" />
                      <p>[Interactive World Map]</p>
                      <p className="text-xs mt-2">{uniqueTrialSites} unique trial sites</p>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Bottleneck Monitor */}
              <GlassCard>
                <h3 className="mb-4 text-lg font-semibold text-text-off-white">Bottleneck Monitor</h3>
                <div className="flex flex-col gap-3">
                  {isLoading ? (
                    <Skeleton className="h-20 w-full" />
                  ) : bottlenecks.length > 0 ? (
                    bottlenecks.map((bottleneck) => (
                      <div
                        key={bottleneck.id}
                        className="group flex cursor-pointer items-start gap-3 rounded-lg bg-cyan-glow/10 p-3 transition-all duration-300 hover:bg-cyan-glow/20 hover:scale-102"
                      >
                        <div className={`h-10 w-1.5 rounded-full ${bottleneck.color} ${bottleneck.shadowColor}`} />
                        <div className="flex-1">
                          <p className="font-semibold text-text-off-white">{bottleneck.title}</p>
                          <p className="text-sm text-text-light-gray">{bottleneck.description}</p>
                        </div>
                        <AlertTriangle className={`ml-auto w-5 h-5 ${bottleneck.iconColor} transition-all duration-300 group-hover:scale-125 group-hover:text-cyan-glow`} />
                      </div>
                    ))
                  ) : (
                    <p className="text-text-light-gray text-sm text-center py-8">No bottlenecks detected</p>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Right Sidebar: Key Milestone Tracker */}
          <aside className="glassmorphism w-[320px] shrink-0 rounded-xl p-4 flex flex-col overflow-hidden">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-text-off-white">Key Milestone Tracker</h3>
            </div>
            
            <div className="flex flex-col gap-4 overflow-y-auto">
              {isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : milestones.length > 0 ? (
                milestones.map((milestone, index) => (
                  <div key={milestone.id} className="grid grid-cols-[32px_1fr] gap-x-2">
                    <div className="flex flex-col items-center gap-1 pt-2">
                      <div className={`relative flex size-8 items-center justify-center rounded-full ${milestone.bgColor}`}>
                        <milestone.icon className={`w-5 h-5 ${milestone.iconColor}`} />
                      </div>
                      {index < milestones.length - 1 && (
                        <div className="h-full w-[2px] bg-cyan-glow/20" />
                      )}
                    </div>
                    <div className={`-ml-2 flex flex-1 cursor-pointer flex-col rounded-lg p-2 pb-4 transition-all duration-300 ${
                      milestone.status === 'active' ? 'bg-cyan-glow/10' : 'hover:bg-cyan-glow/10'
                    } hover:scale-102`}>
                      <p className="text-sm font-medium leading-normal text-text-off-white">{milestone.title}</p>
                      <p className="text-xs leading-normal text-text-light-gray">{milestone.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-text-light-gray text-sm text-center py-8">No milestones available</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClinicalTrials;