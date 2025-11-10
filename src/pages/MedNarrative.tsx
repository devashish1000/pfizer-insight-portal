import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { GlassCard } from "@/components/GlassCard";
import { Stethoscope, TrendingUp, MessageSquare, Eye } from "lucide-react";
import { fetchMedicalResearchData } from "@/lib/googleSheets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { Skeleton } from "@/components/ui/skeleton";

interface MedicalResearchRecord {
  timestamp: string;
  title: string;
  sentiment: string;
  source: string;
  source_type: string;
  publication_date: string;
  therapeutic_area: string;
  impact_level: string;
  reach: string;
  mentions: string;
  engagement: string;
  region: string;
  summary: string;
  key_findings: string;
  study_design: string;
  sample_size: string;
  journal: string;
  authors: string;
  affiliation: string;
  impact_score: string;
  data_source: string;
  last_updated_by: string;
}

const MedNarrative = () => {
  const [data, setData] = useState<MedicalResearchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSentiment, setSelectedSentiment] = useState<string>("All Sentiments");
  const [selectedSourceType, setSelectedSourceType] = useState<string>("All Source Types");
  const [selectedImpact, setSelectedImpact] = useState<string>("All Impact Levels");
  const [selectedRecord, setSelectedRecord] = useState<MedicalResearchRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  
  const itemsPerPage = 10;

  const loadData = async () => {
    setLoading(true);
    const records = await fetchMedicalResearchData();
    const sortedRecords = records
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50);
    setData(sortedRecords);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3600000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      await loadData();
      const timestamp = new Date().toLocaleTimeString();
      console.log(`[${timestamp}] Medical Research data refreshed - ${data.length} records`);
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

  const sentiments = useMemo(
    () => ["All Sentiments", ...Array.from(new Set(data.map((d) => d.sentiment).filter(Boolean)))],
    [data]
  );
  const sourceTypes = useMemo(
    () => ["All Source Types", ...Array.from(new Set(data.map((d) => d.source_type).filter(Boolean)))],
    [data]
  );
  const impactLevels = useMemo(
    () => ["All Impact Levels", ...Array.from(new Set(data.map((d) => d.impact_level).filter(Boolean)))],
    [data]
  );

  const filteredData = useMemo(() => {
    return data.filter((record) => {
      if (!selectedSentiment.startsWith("All") && record.sentiment !== selectedSentiment) return false;
      if (!selectedSourceType.startsWith("All") && record.source_type !== selectedSourceType) return false;
      if (!selectedImpact.startsWith("All") && record.impact_level !== selectedImpact) return false;

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
  }, [data, selectedSentiment, selectedSourceType, selectedImpact, startDate, endDate]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const metrics = useMemo(() => {
    const activeNarratives = filteredData.length;
    const positiveSentiment = filteredData.filter((d) => d.sentiment?.toLowerCase() === "positive").length;
    const positivePct = activeNarratives > 0 ? Math.round((positiveSentiment / activeNarratives) * 100) : 0;
    const totalMentions = filteredData.reduce((sum, d) => sum + (parseInt(d.mentions) || 0), 0);
    const totalReach = filteredData.reduce((sum, d) => sum + (parseInt(d.reach) || 0), 0);

    return {
      activeNarratives,
      positivePct: `${positivePct}%`,
      totalMentions: totalMentions.toLocaleString(),
      totalReach: totalReach > 1000000 ? `${(totalReach / 1000000).toFixed(1)}M` : totalReach.toLocaleString(),
    };
  }, [filteredData]);

  const exportToCSV = () => {
    const headers = [
      "Timestamp",
      "Title",
      "Sentiment",
      "Source",
      "Source Type",
      "Publication Date",
      "Therapeutic Area",
      "Impact Level",
      "Reach",
      "Mentions",
      "Engagement",
      "Region",
      "Summary",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredData.map((record) =>
        [
          record.timestamp,
          record.title,
          record.sentiment,
          record.source,
          record.source_type,
          record.publication_date,
          record.therapeutic_area,
          record.impact_level,
          record.reach,
          record.mentions,
          record.engagement,
          record.region,
          record.summary,
        ]
          .map((field) => `"${(field || "").toString().replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Medical_Research_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "✅ Exported filtered data to CSV",
      description: `${filteredData.length} records exported`,
      duration: 3000,
      className: "bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20",
    });
  };

  const getSentimentColor = (sentiment: string) => {
    const s = sentiment?.toLowerCase() || "";
    if (s.includes("positive")) return "bg-success/20 text-success border-success/30";
    if (s.includes("neutral")) return "bg-text-light-gray/20 text-text-light-gray border-text-light-gray/30";
    if (s.includes("negative")) return "bg-destructive/20 text-destructive border-destructive/30";
    return "bg-muted/20 text-muted-foreground border-muted/30";
  };

  const getImpactColor = (impact: string) => {
    const i = impact?.toLowerCase() || "";
    if (i.includes("significant") || i.includes("high")) return "bg-cyan-glow/20 text-cyan-glow border-cyan-glow/30";
    if (i.includes("moderate") || i.includes("medium")) return "bg-warning/20 text-warning border-warning/30";
    if (i.includes("low")) return "bg-text-light-gray/20 text-text-light-gray border-text-light-gray/30";
    return "bg-muted/20 text-muted-foreground border-muted/30";
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Medical Research Insights"
        subtitle="Medical communication monitoring and sentiment analysis"
        icon={Stethoscope}
        onRefresh={handleManualRefresh}
        isRefreshing={isManualRefreshing}
        onExport={exportToCSV}
      />

      <div className="container mx-auto px-6 pt-4 pb-2 md:pt-6">
        {/* Filters */}
        <div className="mb-6 p-0 bg-transparent">
          <div className="flex flex-wrap gap-3 items-center w-full">
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow px-3 text-sm focus:outline-none focus:border-cyan-glow/40 hover:bg-cyan-glow/20 transition-colors"
            >
              {sentiments.map((sentiment) => (
                <option key={sentiment} value={sentiment}>
                  {sentiment}
                </option>
              ))}
            </select>

            <select
              value={selectedSourceType}
              onChange={(e) => setSelectedSourceType(e.target.value)}
              className="h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow px-3 text-sm focus:outline-none focus:border-cyan-glow/40 hover:bg-cyan-glow/20 transition-colors"
            >
              {sourceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={selectedImpact}
              onChange={(e) => setSelectedImpact(e.target.value)}
              className="h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow px-3 text-sm focus:outline-none focus:border-cyan-glow/40 hover:bg-cyan-glow/20 transition-colors"
            >
              {impactLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
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
          <GlassCard className="p-6 hover:shadow-lg hover:shadow-cyan-glow/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-light-gray text-sm mb-1">Active Narratives</p>
                {loading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  <p className="text-3xl font-bold text-cyan-glow">{metrics.activeNarratives}</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-glow/10 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-cyan-glow" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 hover:shadow-lg hover:shadow-success/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-light-gray text-sm mb-1">Positive Sentiment</p>
                {loading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  <p className="text-3xl font-bold text-success">{metrics.positivePct}</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 hover:shadow-lg hover:shadow-cyan-glow/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-light-gray text-sm mb-1">Media Mentions</p>
                {loading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  <p className="text-3xl font-bold text-cyan-glow">{metrics.totalMentions}</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-glow/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-cyan-glow" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 hover:shadow-lg hover:shadow-warning/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-light-gray text-sm mb-1">Total Reach</p>
                {loading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  <p className="text-3xl font-bold text-warning">{metrics.totalReach}</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-warning" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Data Table */}
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : filteredData.length === 0 ? (
              <div className="p-8 text-center text-text-light-gray">
                No records found matching the selected filters.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-cyan-glow/10 hover:bg-transparent">
                    <TableHead className="text-cyan-glow font-semibold">Title</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Sentiment</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Source</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Publication Date</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Therapeutic Area</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Impact</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Reach</TableHead>
                    <TableHead className="text-cyan-glow font-semibold">Mentions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((record, index) => (
                    <TableRow
                      key={index}
                      className="border-cyan-glow/10 hover:bg-cyan-glow/5 hover:border-l-2 hover:border-l-cyan-glow transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        setSelectedRecord(record);
                        setIsModalOpen(true);
                      }}
                    >
                      <TableCell className="font-medium text-text-off-white max-w-md">
                        <div className="truncate">{record.title}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSentimentColor(record.sentiment)}>{record.sentiment}</Badge>
                      </TableCell>
                      <TableCell className="text-text-light-gray text-sm">{record.source_type}</TableCell>
                      <TableCell className="text-text-off-white">{record.publication_date}</TableCell>
                      <TableCell className="text-text-off-white">{record.therapeutic_area}</TableCell>
                      <TableCell>
                        <Badge className={getImpactColor(record.impact_level)}>{record.impact_level}</Badge>
                      </TableCell>
                      <TableCell className="text-text-off-white">{record.reach}</TableCell>
                      <TableCell className="text-text-off-white">{record.mentions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <div className="px-6 py-4 border-t border-cyan-glow/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-text-light-gray">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} records
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
      </div>

      {/* Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-background/95 border-cyan-glow/20 animate-in fade-in-0 zoom-in-95 duration-300">
          <DialogHeader>
            <DialogTitle className="text-xl text-cyan-glow pr-8">{selectedRecord?.title}</DialogTitle>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4 text-text-off-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-light-gray mb-1">Sentiment</p>
                  <Badge className={getSentimentColor(selectedRecord.sentiment)}>
                    {selectedRecord.sentiment}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-text-light-gray mb-1">Impact Level</p>
                  <Badge className={getImpactColor(selectedRecord.impact_level)}>
                    {selectedRecord.impact_level}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-text-light-gray mb-1">Summary</p>
                <p className="text-sm">{selectedRecord.summary}</p>
              </div>

              {selectedRecord.key_findings && (
                <div>
                  <p className="text-sm text-text-light-gray mb-1">Key Findings</p>
                  <p className="text-sm">{selectedRecord.key_findings}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-light-gray mb-1">Source</p>
                  <p className="text-sm">{selectedRecord.source}</p>
                </div>
                <div>
                  <p className="text-sm text-text-light-gray mb-1">Publication Date</p>
                  <p className="text-sm">{selectedRecord.publication_date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-light-gray mb-1">Therapeutic Area</p>
                  <p className="text-sm">{selectedRecord.therapeutic_area}</p>
                </div>
                <div>
                  <p className="text-sm text-text-light-gray mb-1">Region</p>
                  <p className="text-sm">{selectedRecord.region}</p>
                </div>
              </div>

              {selectedRecord.study_design && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-light-gray mb-1">Study Design</p>
                    <p className="text-sm">{selectedRecord.study_design}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-light-gray mb-1">Sample Size</p>
                    <p className="text-sm">{selectedRecord.sample_size}</p>
                  </div>
                </div>
              )}

              {selectedRecord.journal && (
                <div>
                  <p className="text-sm text-text-light-gray mb-1">Journal</p>
                  <p className="text-sm">{selectedRecord.journal}</p>
                </div>
              )}

              {selectedRecord.authors && (
                <div>
                  <p className="text-sm text-text-light-gray mb-1">Authors</p>
                  <p className="text-sm">{selectedRecord.authors}</p>
                </div>
              )}

              {selectedRecord.affiliation && (
                <div>
                  <p className="text-sm text-text-light-gray mb-1">Affiliation</p>
                  <p className="text-sm">{selectedRecord.affiliation}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-text-light-gray mb-1">Mentions</p>
                  <p className="text-sm font-semibold">{selectedRecord.mentions}</p>
                </div>
                <div>
                  <p className="text-sm text-text-light-gray mb-1">Engagement</p>
                  <p className="text-sm font-semibold">{selectedRecord.engagement}</p>
                </div>
                <div>
                  <p className="text-sm text-text-light-gray mb-1">Impact Score</p>
                  <p className="text-sm font-semibold">{selectedRecord.impact_score}</p>
                </div>
              </div>

              {selectedRecord.data_source && (
                <div>
                  <p className="text-sm text-text-light-gray mb-1">Data Source</p>
                  <a
                    href={selectedRecord.data_source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cyan-glow hover:underline"
                  >
                    {selectedRecord.data_source}
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MedNarrative;
