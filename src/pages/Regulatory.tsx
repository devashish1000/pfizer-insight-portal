import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { GlassCard } from "@/components/GlassCard";
import { Scale, TrendingUp, AlertCircle, Globe2, Download } from "lucide-react";
import { fetchRegulatoryData } from "@/lib/googleSheets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  const [selectedAgency, setSelectedAgency] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");

  useEffect(() => {
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
    loadData();

    // Refresh every 10 minutes
    // Change this in useEffect()
    const interval = setInterval(loadData, 3600000); // 1 hour
    return () => clearInterval(interval);
  }, []);

  // Extract unique values for filters
  const agencies = useMemo(() => ["All", ...Array.from(new Set(data.map((d) => d.agency).filter(Boolean)))], [data]);
  const statuses = useMemo(() => ["All", ...Array.from(new Set(data.map((d) => d.status).filter(Boolean)))], [data]);
  const regions = useMemo(() => ["All", ...Array.from(new Set(data.map((d) => d.region).filter(Boolean)))], [data]);
  const types = useMemo(
    () => ["All", ...Array.from(new Set(data.map((d) => d.submission_type).filter(Boolean)))],
    [data],
  );

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter((record) => {
      if (selectedAgency !== "All" && record.agency !== selectedAgency) return false;
      if (selectedStatus !== "All" && record.status !== selectedStatus) return false;
      if (selectedRegion !== "All" && record.region !== selectedRegion) return false;
      if (selectedType !== "All" && record.submission_type !== selectedType) return false;
      return true;
    });
  }, [data, selectedAgency, selectedStatus, selectedRegion, selectedType]);

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
        (d.key_issues.toLowerCase().includes("regulatory query") ||
          d.key_issues.toLowerCase().includes("info requested") ||
          d.key_issues.trim() !== ""),
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
          .map((field) => `"${field || ""}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `regulatory_intelligence_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
      />

      <div className="p-6 space-y-6">
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

        {/* Filters */}
        <GlassCard className="mb-6 p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
              className="h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow px-3 text-sm focus:outline-none focus:border-cyan-glow/40"
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
              className="h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow px-3 text-sm focus:outline-none focus:border-cyan-glow/40"
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
              className="h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow px-3 text-sm focus:outline-none focus:border-cyan-glow/40"
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
              className="h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow px-3 text-sm focus:outline-none focus:border-cyan-glow/40"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <Button
              onClick={exportToCSV}
              className="ml-auto h-9 bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20 hover:bg-cyan-glow/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </GlassCard>

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
                      className="border-cyan-glow/10 hover:bg-cyan-glow/5 transition-all duration-300"
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
      </div>
    </DashboardLayout>
  );
};

export default Regulatory;
