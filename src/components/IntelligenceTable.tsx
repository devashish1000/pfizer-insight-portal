import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, Info } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { sheetLabelMap } from "@/lib/googleSheets";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DateRangeFilter } from "@/components/DateRangeFilter";

export interface IntelligenceData {
  timestamp: string;
  title: string;
  summary: string;
  category?: string;
  source: string;
  impact: string;
  region: string;
  _sourceSheet?: string;
  [key: string]: any; // Allow dynamic fields
}

interface IntelligenceTableProps {
  data: IntelligenceData[];
  children?: React.ReactNode; // Content to render between separator and table
}

export const IntelligenceTable = ({ data, children }: IntelligenceTableProps) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All Categories");
  const [impactFilter, setImpactFilter] = useState<string>("All Impacts");
  const [regionFilter, setRegionFilter] = useState<string>("All Regions");
  const [selectedRecord, setSelectedRecord] = useState<IntelligenceData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // Default to last 30 days
    return date;
  });
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  
  const itemsPerPage = 10;

  // Define official dashboard categories only (exclude backend sheets)
  const EXCLUDED_SHEETS = ['Logs', 'Medical Research Insights', 'Clinical Trials Tracker'];
  
  const categories = useMemo(() => {
    return Object.values(sheetLabelMap)
      .filter(mapping => !EXCLUDED_SHEETS.includes(mapping.name))
      .map(mapping => ({
        value: mapping.name,
        label: mapping.name,
        description: mapping.description
      }));
  }, []);
  
  const impacts = useMemo(
    () => ["All Impacts", ...Array.from(new Set(data.map((item) => item.impact).filter(Boolean)))],
    [data]
  );
  const regions = useMemo(
    () => ["All Regions", ...Array.from(new Set(data.map((item) => item.region).filter(Boolean)))],
    [data]
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        search === "" ||
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.summary?.toLowerCase().includes(search.toLowerCase()) ||
        item.source?.toLowerCase().includes(search.toLowerCase()) ||
        item.compound_name?.toLowerCase().includes(search.toLowerCase());

      const itemSourceLabel = sheetLabelMap[item._sourceSheet || '']?.name || item.category;
      const matchesCategory = 
        categoryFilter === "All Categories" || 
        itemSourceLabel === categoryFilter || 
        item.category === categoryFilter;
      const matchesImpact = impactFilter === "All Impacts" || item.impact === impactFilter;
      const matchesRegion = regionFilter === "All Regions" || item.region === regionFilter;

      // Date range filter
      if (startDate || endDate) {
        const recordDate = new Date(item.timestamp);
        if (startDate && recordDate < startDate) return false;
        if (endDate) {
          const endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);
          if (recordDate > endOfDay) return false;
        }
      }

      return matchesSearch && matchesCategory && matchesImpact && matchesRegion;
    });
  }, [data, search, categoryFilter, impactFilter, regionFilter, startDate, endDate]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const getImpactColor = (impact: string) => {
    const lower = impact?.toLowerCase() || "";
    if (lower.includes("high")) return "bg-warning text-warning-foreground";
    if (lower.includes("medium")) return "bg-primary/20 text-primary";
    return "bg-muted text-muted-foreground";
  };

  const getSourceTypeBadge = (sourceSheet: string | undefined) => {
    if (!sourceSheet) return { label: "General", color: "bg-muted/50 text-muted-foreground hover:bg-muted/70" };
    
    const mapping = sheetLabelMap[sourceSheet];
    
    if (!mapping) {
      return { label: sourceSheet, color: "bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30 pulse-on-hover" };
    }

    const colorClasses: Record<string, string> = {
      cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30 pulse-on-hover',
      teal: 'bg-teal-500/20 text-teal-400 border-teal-500/30 hover:bg-teal-500/30 pulse-on-hover',
      green: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 pulse-on-hover',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30 pulse-on-hover',
      orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30 pulse-on-hover',
      indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30 pulse-on-hover',
      pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30 hover:bg-pink-500/30 pulse-on-hover',
    };

    const color = colorClasses[mapping.color] || colorClasses.cyan;

    return { label: mapping.name, color };
  };

  const handleRowClick = (item: IntelligenceData) => {
    setSelectedRecord(item);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Filters Section */}
      <div className="mb-6 p-0 bg-transparent">
        <div className="flex flex-wrap gap-3 items-center w-full">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-glow/50 w-4 h-4" />
            <Input
              placeholder="Search updates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow placeholder:text-cyan-glow/50 focus:border-cyan-glow/40 hover:bg-cyan-glow/20 transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px] h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow hover:bg-cyan-glow/20 focus:border-cyan-glow/40 transition">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-sm border-cyan-glow/20 z-50">
                <SelectItem value="All Categories">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-cyan-glow/60 hover:text-cyan-glow transition-colors focus:outline-none">
                    <Info className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-glass/95 backdrop-blur-md border-cyan-glow/20" mobileAutoHide>
                  <div className="space-y-2 text-xs">
                    {categories.map((cat) => (
                      <div key={cat.value} className="flex flex-col">
                        <span className="font-semibold text-cyan-glow">{cat.label}</span>
                        <span className="text-text-light-gray">{cat.description}</span>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select value={impactFilter} onValueChange={setImpactFilter}>
            <SelectTrigger className="w-full md:w-[180px] h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow hover:bg-cyan-glow/20 focus:border-cyan-glow/40 transition">
              <SelectValue placeholder="Impact" />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-sm border-cyan-glow/20 z-50">
              {impacts.map((imp) => (
                <SelectItem key={imp} value={imp}>
                  {imp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-full md:w-[180px] h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow hover:bg-cyan-glow/20 focus:border-cyan-glow/40 transition">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-sm border-cyan-glow/20 z-50">
              {regions.map((reg) => (
                <SelectItem key={reg} value={reg}>
                  {reg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>
      </div>

      {/* Separator line */}
      <div className="border-t border-cyan-glow/10 mb-6" />

      {/* Content between separator and table (e.g., metrics) */}
      {children}

      {/* Data Table */}
      <GlassCard>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow className="border-cyan-glow/10 hover:bg-transparent">
                <TableHead className="text-cyan-glow font-semibold">Date</TableHead>
                <TableHead className="text-cyan-glow font-semibold">Title</TableHead>
                <TableHead className="text-cyan-glow font-semibold">Summary</TableHead>
                <TableHead className="text-cyan-glow font-semibold">Source Type</TableHead>
                <TableHead className="text-cyan-glow font-semibold">Impact</TableHead>
                <TableHead className="text-cyan-glow font-semibold">Region</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No updates found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => {
                  const sourceBadge = getSourceTypeBadge(item._sourceSheet);
                  return (
                    <TableRow 
                      key={index} 
                      className="border-cyan-glow/10 hover:bg-cyan-glow/5 transition-all duration-300 cursor-pointer"
                      onClick={() => handleRowClick(item)}
                    >
                      <TableCell className="text-sm text-text-off-white whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium text-text-off-white max-w-xs">
                        {item.title || item.compound_name || "Untitled"}
                      </TableCell>
                      <TableCell className="text-sm text-text-light-gray max-w-md">
                        {item.summary || item.indication || "No summary available"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${sourceBadge.color} transition-all duration-300`}>
                          {sourceBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.impact && (
                          <Badge className={getImpactColor(item.impact)}>{item.impact}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-text-off-white">
                        {item.region}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
          <span className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} updates
          </span>
          
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

      {/* Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glassmorphism max-w-3xl max-h-[85vh] overflow-y-auto border-cyan-glow/20 shimmer-on-open">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-text-off-white mb-2 leading-tight">
              {selectedRecord?.title || selectedRecord?.compound_name || "Record Details"}
            </DialogTitle>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-6 mt-4">
              {/* Source Type Badge */}
              {selectedRecord._sourceSheet && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getSourceTypeBadge(selectedRecord._sourceSheet).color}>
                    {getSourceTypeBadge(selectedRecord._sourceSheet).label}
                  </Badge>
                  {selectedRecord.impact && (
                    <Badge className={getImpactColor(selectedRecord.impact)}>
                      {selectedRecord.impact}
                    </Badge>
                  )}
                </div>
              )}

              {/* Main Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-light-gray uppercase tracking-wide mb-1">Date</p>
                  <p className="text-sm text-text-off-white">
                    {new Date(selectedRecord.timestamp).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                {selectedRecord.region && (
                  <div>
                    <p className="text-xs text-text-light-gray uppercase tracking-wide mb-1">Region</p>
                    <p className="text-sm text-text-off-white">{selectedRecord.region}</p>
                  </div>
                )}
              </div>

              {/* Summary */}
              {selectedRecord.summary && (
                <div>
                  <p className="text-xs text-text-light-gray uppercase tracking-wide mb-2">Summary</p>
                  <p className="text-sm text-text-off-white leading-relaxed">{selectedRecord.summary}</p>
                </div>
              )}

              {/* Regulatory-specific fields */}
              {selectedRecord.agency && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-light-gray uppercase tracking-wide mb-1">Agency</p>
                    <p className="text-sm text-text-off-white">{selectedRecord.agency}</p>
                  </div>
                  {selectedRecord.status && (
                    <div>
                      <p className="text-xs text-text-light-gray uppercase tracking-wide mb-1">Status</p>
                      <p className="text-sm text-text-off-white">{selectedRecord.status}</p>
                    </div>
                  )}
                </div>
              )}

              {selectedRecord.compound_name && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-light-gray uppercase tracking-wide mb-1">Compound Name</p>
                    <p className="text-sm text-text-off-white">{selectedRecord.compound_name}</p>
                  </div>
                  {selectedRecord.generic_name && (
                    <div>
                      <p className="text-xs text-text-light-gray uppercase tracking-wide mb-1">Generic Name</p>
                      <p className="text-sm text-text-off-white">{selectedRecord.generic_name}</p>
                    </div>
                  )}
                </div>
              )}

              {selectedRecord.indication && (
                <div>
                  <p className="text-xs text-text-light-gray uppercase tracking-wide mb-2">Indication</p>
                  <p className="text-sm text-text-off-white leading-relaxed">{selectedRecord.indication}</p>
                </div>
              )}

              {selectedRecord.key_issues && selectedRecord.key_issues !== "N/A" && (
                <div>
                  <p className="text-xs text-text-light-gray uppercase tracking-wide mb-2">Key Issues</p>
                  <p className="text-sm text-text-off-white leading-relaxed">{selectedRecord.key_issues}</p>
                </div>
              )}

              {/* Category */}
              {selectedRecord.category && (
                <div>
                  <p className="text-xs text-text-light-gray uppercase tracking-wide mb-1">Category</p>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    {selectedRecord.category}
                  </Badge>
                </div>
              )}

              {/* Source Link */}
              {selectedRecord.source && (
                <div>
                  <p className="text-xs text-text-light-gray uppercase tracking-wide mb-2">Source</p>
                  <a
                    href={selectedRecord.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-cyan-glow hover:text-cyan-glow/80 transition-colors duration-300 hover:underline button-expand"
                  >
                    <span>{selectedRecord.source}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {/* Footer metadata */}
              {selectedRecord.last_updated_by && (
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-text-light-gray">
                    Last updated by: <span className="text-text-off-white">{selectedRecord.last_updated_by}</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
