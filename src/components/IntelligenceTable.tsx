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
import { Search, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
}

export const IntelligenceTable = ({ data }: IntelligenceTableProps) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [impactFilter, setImpactFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [sourceTypeFilter, setSourceTypeFilter] = useState<string>("all");
  const [selectedRecord, setSelectedRecord] = useState<IntelligenceData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(data.map((item) => item.category).filter(Boolean)))],
    [data]
  );
  const impacts = useMemo(
    () => ["all", ...Array.from(new Set(data.map((item) => item.impact).filter(Boolean)))],
    [data]
  );
  const regions = useMemo(
    () => ["all", ...Array.from(new Set(data.map((item) => item.region).filter(Boolean)))],
    [data]
  );
  const sourceTypes = useMemo(
    () => ["all", ...Array.from(new Set(data.map((item) => item._sourceSheet).filter(Boolean)))],
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

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      const matchesImpact = impactFilter === "all" || item.impact === impactFilter;
      const matchesRegion = regionFilter === "all" || item.region === regionFilter;
      const matchesSourceType =
        sourceTypeFilter === "all" || item._sourceSheet === sourceTypeFilter;

      return matchesSearch && matchesCategory && matchesImpact && matchesRegion && matchesSourceType;
    });
  }, [data, search, categoryFilter, impactFilter, regionFilter, sourceTypeFilter]);

  const getImpactColor = (impact: string) => {
    const lower = impact?.toLowerCase() || "";
    if (lower.includes("high")) return "bg-warning text-warning-foreground";
    if (lower.includes("medium")) return "bg-primary/20 text-primary";
    return "bg-muted text-muted-foreground";
  };

  const getSourceTypeBadge = (sourceSheet: string | undefined) => {
    if (!sourceSheet) return { label: "General", color: "bg-muted/50 text-muted-foreground hover:bg-muted/70" };
    
    const normalized = sourceSheet.toLowerCase();
    
    // Map sheet names to friendly labels
    if (normalized === "sheet1") {
      return { label: "Global Intelligence", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30 pulse-on-hover" };
    }
    if (normalized.includes("regulatory")) {
      return { label: "Regulatory Intelligence", color: "bg-cyan-glow/20 text-cyan-glow border-cyan-glow/30 hover:bg-cyan-glow/30 pulse-on-hover" };
    }
    if (normalized.includes("clinical")) {
      return { label: "Clinical Trials", color: "bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30 pulse-on-hover" };
    }
    if (normalized.includes("research") || normalized.includes("medical")) {
      return { label: "Medical Research", color: "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 pulse-on-hover" };
    }
    if (normalized.includes("public_health") || normalized.includes("health")) {
      return { label: "Public Health & Forecasts", color: "bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30 pulse-on-hover" };
    }
    return { label: sourceSheet, color: "bg-muted/50 text-muted-foreground hover:bg-muted/70" };
  };

  const handleRowClick = (item: IntelligenceData) => {
    setSelectedRecord(item);
    setIsModalOpen(true);
  };

  return (
    <GlassCard>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search updates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-secondary border-border">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={impactFilter} onValueChange={setImpactFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-secondary border-border">
              <SelectValue placeholder="Impact" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              {impacts.map((imp) => (
                <SelectItem key={imp} value={imp}>
                  {imp === "all" ? "All Impacts" : imp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-secondary border-border">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              {regions.map((reg) => (
                <SelectItem key={reg} value={reg}>
                  {reg === "all" ? "All Regions" : reg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sourceTypeFilter} onValueChange={setSourceTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-secondary border-border">
              <SelectValue placeholder="Source Type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              {sourceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all" ? "All Sources" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50 border-border">
                <TableHead className="text-muted-foreground font-semibold">Date</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Title</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Summary</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Source Type</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Impact</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Region</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No updates found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.slice(0, 100).map((item, index) => {
                  const sourceBadge = getSourceTypeBadge(item._sourceSheet);
                  return (
                    <TableRow 
                      key={index} 
                      className="hover:bg-muted/30 border-border cursor-pointer transition-all duration-300 hover:border-cyan-glow/30 hover-glow-row group"
                      onClick={() => handleRowClick(item)}
                    >
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium text-foreground max-w-xs">
                        {item.title || item.compound_name || "Untitled"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-md">
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
                      <TableCell className="text-sm text-muted-foreground">
                        {item.region}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>
            Showing {Math.min(filteredData.length, 100)} of {data.length} updates
          </span>
        </div>
      </div>

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
    </GlassCard>
  );
};
