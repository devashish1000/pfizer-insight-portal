import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { GlassCard } from "@/components/GlassCard";
import { Scale, TrendingUp, AlertCircle, Globe2, Download, X } from "lucide-react";
import { fetchRegulatoryData } from "@/lib/googleSheets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRefreshData } from "@/hooks/useRefreshData";
import { toast } from "@/hooks/use-toast";
import { DateRangeFilter } from "@/components/DateRangeFilter";

interface RegulatoryRecord {
  timestamp: string;
  agency: string;
  region: string;
  submission_id: string;
  submission_type: string;
  compound_name: string;
  generic_name: string;
  therapeutic_area: string;
  indication: string;
  status: string;
  priority_designation: string;
  submission_date: string;
  target_decision_date: string;
  approval_date: string;
  review_cycle: string;
  key_issues: string;
  risk_level: string;
  impact: string;
  source: string;
  summary: string;
  last_updated_by: string;
}

const Regulatory = () => {
  const [data, setData] = useState<RegulatoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgency, setSelectedAgency] = useState<string>("All Agencies");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Statuses");
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");
  const [selectedType, setSelectedType] = useState<string>("All Submission Types");
  const [selectedRecord, setSelectedRecord] = useState<RegulatoryRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // Default to last 30 days
    return date;
  });
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const loadData = async () => {
    setLoading(true);
    const records = await fetchRegulatoryData();
    // Sort by timestamp descending and take the most recent 20
    const sortedRecords = records
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);
    setData(sortedRecords);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // Refresh every hour
    const interval = setInterval(loadData, 3600000); // 1 hour
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      await loadData();
      const timestamp = new Date().toLocaleTimeString();
      console.log(`[${timestamp}] Regulatory data refreshed - ${data.length} records`);
      toast({
        title: "Data refreshed successfully",
        description: `Updated at ${timestamp}`,
        duration: 2000,
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh failed",
        description: "Please try again",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setTimeout(() => setIsManualRefreshing(false), 300);
    }
  };

  // Extract unique values for filters
  const agencies = useMemo(() => ["All Agencies", ...Array.from(new Set(data.map((d) => d.agency).filter(Boolean)))], [data]);
  const statuses = useMemo(() => ["All Statuses", ...Array.from(new Set(data.map((d) => d.status).filter(Boolean)))], [data]);
  const regions = useMemo(() => ["All Regions", ...Array.from(new Set(data.map((d) => d.region).filter(Boolean)))], [data]);
  const types = useMemo(
    () => ["All Submission Types", ...Array.from(new Set(data.map((d) => d.submission_type).filter(Boolean)))],
    [data],
  );

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter((record) => {
      // Agency filter
      if (!selectedAgency.startsWith("All") && record.agency !== selectedAgency) return false;
      
      // Status filter
      if (!selectedStatus.startsWith("All") && record.status !== selectedStatus) return false;
      
      // Region filter
      if (!selectedRegion.startsWith("All") && record.region !== selectedRegion) return false;
      
      // Type filter
      if (!selectedType.startsWith("All") && record.submission_type !== selectedType) return false;
      
      // Date range filter
      if (startDate || endDate) {
        const recordDate = new Date(record.timestamp);
        if (startDate && recordDate < startDate) return false;
        if (endDate) {
          const endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);
          if (recordDate > endOfDay) return false;
        }
      }
      
      return true;
    });
  }, [data, selectedAgency, selectedStatus, selectedRegion, selectedType, startDate, endDate]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const activeSubmissions = filteredData.filter(
      (d) => d.status?.toLowerCase().includes("active") || d.status?.toLowerCase().includes("under review"),
    ).length;

    const pendingReviews = filteredData.filter(
      (d) => d.status?.toLowerCase().includes("pending") || d.status?.toLowerCase().includes("in preparation"),
    ).length;

    const actionItems = filteredData.filter(
      (d) =>
        d.key_issues &&
        d.key_issues.trim() !== "" &&
        d.key_issues.trim() !== "—" &&
        d.key_issues.toLowerCase() !== "n/a" &&
        d.key_issues.toLowerCase() !== "none",
    ).length;

    const globalMarkets = new Set(filteredData.map((d) => d.region).filter(Boolean)).size;

    return { activeSubmissions, pendingReviews, actionItems, globalMarkets };
  }, [filteredData]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Timestamp",
      "Agency",
      "Region",
      "Submission ID",
      "Submission Type",
      "Compound Name",
      "Generic Name",
      "Therapeutic Area",
      "Indication",
      "Status",
      "Priority Designation",
      "Submission Date",
      "Target Decision Date",
      "Approval Date",
      "Review Cycle",
      "Key Issues",
      "Risk Level",
      "Impact",
      "Source",
      "Summary",
      "Last Updated By",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredData.map((record) =>
        [
          record.timestamp,
          record.agency,
          record.region,
          record.submission_id,
          record.submission_type,
          record.compound_name,
          record.generic_name,
          record.therapeutic_area,
          record.indication,
          record.status,
          record.priority_designation,
          record.submission_date,
          record.target_decision_date,
          record.approval_date,
          record.review_cycle,
          record.key_issues,
          record.risk_level,
          record.impact,
          record.source,
          record.summary,
          record.last_updated_by,
        ]
          .map((field) => `"${(field || "").toString().replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Regulatory_Intelligence_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "✅ Exported filtered data to CSV",
      description: `${filteredData.length} records exported`,
      duration: 3000,
      className: "bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20",
    });
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("approved")) return "bg-success/20 text-success border-success/30";
    if (s.includes("active") || s.includes("under review")) return "bg-cyan-glow/20 text-cyan-glow border-cyan-glow/30";
    if (s.includes("pending")) return "bg-warning/20 text-warning border-warning/30";
    if (s.includes("rejected") || s.includes("withdrawn"))
      return "bg-destructive/20 text-destructive border-destructive/30";
    return "bg-muted/20 text-muted-foreground border-muted/30";
  };

  const getRiskColor = (risk: string) => {
    const r = risk?.toLowerCase() || "";
    if (r.includes("high")) return "bg-destructive/20 text-destructive border-destructive/30";
    if (r.includes("medium")) return "bg-warning/20 text-warning border-warning/30";
    if (r.includes("low")) return "bg-success/20 text-success border-success/30";
    return "bg-muted/20 text-muted-foreground border-muted/30";
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Regulatory Intelligence Tracker"
        subtitle="Real-time submission tracking and regulatory pathway monitoring"
        icon={Scale}
        onRefresh={handleManualRefresh}
        isRefreshing={isManualRefreshing}
        onExport={exportToCSV}
      />

      <div className="container mx-auto px-6 pt-4 pb-2 md:pt-6">
        {/* Filters */}
        <div className="mb-6 p-0 bg-transparent">
          <div className="flex flex-wrap gap-3 items-center w-full">
            <select
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
              className="h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow px-3 text-sm focus:outline-none focus:border-cyan-glow/40 hover:bg-cyan-glow/20 transition-colors"
            >
              {agencies.map((agency) => (
                <option key={agency} value={agency}>
                  {agency}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow px-3 text-sm focus:outline-none focus:border-cyan-glow/40 hover:bg-cyan-glow/20 transition-colors"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow px-3 text-sm focus:outline-none focus:border-cyan-glow/40 hover:bg-cyan-glow/20 transition-colors"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow px-3 text-sm focus:outline-none focus:border-cyan-glow/40 hover:bg-cyan-glow/20 transition-colors"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
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
        </div>
        
        {/* Separator line */}
        <div className="border-t border-cyan-glow/10 mt-4 mb-6" />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-light-gray text-sm mb-1">Active Submissions</p>
                <p className="text-3xl font-bold text-cyan-glow">{metrics.activeSubmissions}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-glow/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-cyan-glow" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-light-gray text-sm mb-1">Pending Reviews</p>
                <p className="text-3xl font-bold text-warning">{metrics.pendingReviews}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Scale className="w-6 h-6 text-warning" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-light-gray text-sm mb-1">Action Items</p>
                <p className="text-3xl font-bold text-destructive">{metrics.actionItems}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-light-gray text-sm mb-1">Global Markets</p>
                <p className="text-3xl font-bold text-success">{metrics.globalMarkets}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Globe2 className="w-6 h-6 text-success" />
              </div>
            </div>
          </GlassCard>
        </div>


        {/* Data Table */}
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-text-light-gray">Loading regulatory data...</div>
            ) : filteredData.length === 0 ? (
              <div className="p-8 text-center text-text-light-gray">
                No records found matching the selected filters.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-cyan-glow/10 hover:bg-transparent">
                    <TableHead className="text-cyan-glow font-semibold">Submission ID</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Compound</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Agency</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Region</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Status</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Risk Level</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Key Issues</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Target Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((record, index) => (
                    <TableRow
                      key={index}
                      className="border-cyan-glow/10 hover:bg-cyan-glow/5 transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        setSelectedRecord(record);
                        setIsModalOpen(true);
                      }}
                    >
                      <TableCell className="font-medium text-text-off-white">{record.submission_id}</TableCell>
                      <TableCell>
                        <div className="text-text-off-white font-medium">{record.compound_name}</div>
                        <div className="text-text-light-gray text-xs">{record.generic_name}</div>
                      </TableCell>
                      <TableCell className="text-text-off-white">{record.agency}</TableCell>
                      <TableCell className="text-text-off-white">{record.region}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskColor(record.risk_level)}>{record.risk_level}</Badge>
                      </TableCell>
                      <TableCell className="text-text-light-gray text-sm max-w-xs truncate">
                        {record.key_issues || "—"}
                      </TableCell>
                      <TableCell className="text-text-off-white">{record.target_decision_date || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <div className="px-6 py-4 border-t border-cyan-glow/10">
            <p className="text-sm text-text-light-gray">
              Showing {filteredData.length} of {data.length} records
            </p>
          </div>
        </GlassCard>

        {/* Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="glassmorphism border-cyan-glow/20 max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-cyan-glow flex items-center justify-between">
                Submission Details
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-text-light-gray hover:text-cyan-glow transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </DialogTitle>
            </DialogHeader>
            
            {selectedRecord && (
              <div className="space-y-6 mt-4">
                {/* Submission Overview */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-text-off-white border-b border-cyan-glow/20 pb-2">
                    Submission Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Submission ID</p>
                      <p className="text-sm text-text-off-white font-medium">{selectedRecord.submission_id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Submission Type</p>
                      <p className="text-sm text-text-off-white">{selectedRecord.submission_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Agency</p>
                      <p className="text-sm text-text-off-white">{selectedRecord.agency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Region</p>
                      <p className="text-sm text-text-off-white">{selectedRecord.region}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Status</p>
                      <Badge className={getStatusColor(selectedRecord.status)}>{selectedRecord.status}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Risk Level</p>
                      <Badge className={getRiskColor(selectedRecord.risk_level)}>{selectedRecord.risk_level}</Badge>
                    </div>
                  </div>
                </div>

                {/* Compound Information */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-text-off-white border-b border-cyan-glow/20 pb-2">
                    Compound Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Compound Name</p>
                      <p className="text-sm text-text-off-white font-medium">{selectedRecord.compound_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Generic Name</p>
                      <p className="text-sm text-text-off-white">{selectedRecord.generic_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Therapeutic Area</p>
                      <p className="text-sm text-text-off-white">{selectedRecord.therapeutic_area}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Indication</p>
                      <p className="text-sm text-text-off-white">{selectedRecord.indication}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Priority Designation</p>
                      <p className="text-sm text-text-off-white">{selectedRecord.priority_designation || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-text-off-white border-b border-cyan-glow/20 pb-2">
                    Timeline
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Submission Date</p>
                      <p className="text-sm text-text-off-white">{selectedRecord.submission_date || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Target Decision Date</p>
                      <p className="text-sm text-text-off-white">{selectedRecord.target_decision_date || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Approval Date</p>
                      <p className="text-sm text-text-off-white">{selectedRecord.approval_date || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Review Cycle</p>
                      <p className="text-sm text-text-off-white">{selectedRecord.review_cycle || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Key Issues & Impact */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-text-off-white border-b border-cyan-glow/20 pb-2">
                    Key Issues & Impact
                  </h3>
                  <div>
                    <p className="text-xs text-text-light-gray mb-1">Key Issues</p>
                    <p className="text-sm text-text-off-white">{selectedRecord.key_issues || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-light-gray mb-1">Impact</p>
                    <p className="text-sm text-text-off-white">{selectedRecord.impact || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-light-gray mb-1">Summary</p>
                    <p className="text-sm text-text-off-white">{selectedRecord.summary || "—"}</p>
                  </div>
                </div>

                {/* Source & Updates */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-text-off-white border-b border-cyan-glow/20 pb-2">
                    Source & Updates
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Source</p>
                      {selectedRecord.source ? (
                        <a 
                          href={selectedRecord.source} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-cyan-glow hover:underline"
                        >
                          View Source →
                        </a>
                      ) : (
                        <p className="text-sm text-text-off-white">—</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Last Updated By</p>
                      <p className="text-sm text-text-off-white">{selectedRecord.last_updated_by || "—"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-text-light-gray mb-1">Timestamp</p>
                      <p className="text-sm text-text-off-white">{selectedRecord.timestamp || "—"}</p>
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

export default Regulatory;
