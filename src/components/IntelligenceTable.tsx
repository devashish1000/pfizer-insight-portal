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
import { Search } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

export interface IntelligenceData {
  timestamp: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  impact: string;
  region: string;
}

interface IntelligenceTableProps {
  data: IntelligenceData[];
}

export const IntelligenceTable = ({ data }: IntelligenceTableProps) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [impactFilter, setImpactFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(data.map((item) => item.category)))],
    [data]
  );
  const impacts = useMemo(
    () => ["all", ...Array.from(new Set(data.map((item) => item.impact)))],
    [data]
  );
  const regions = useMemo(
    () => ["all", ...Array.from(new Set(data.map((item) => item.region)))],
    [data]
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        search === "" ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.summary.toLowerCase().includes(search.toLowerCase()) ||
        item.source.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      const matchesImpact = impactFilter === "all" || item.impact === impactFilter;
      const matchesRegion = regionFilter === "all" || item.region === regionFilter;

      return matchesSearch && matchesCategory && matchesImpact && matchesRegion;
    });
  }, [data, search, categoryFilter, impactFilter, regionFilter]);

  const getImpactColor = (impact: string) => {
    const lower = impact.toLowerCase();
    if (lower.includes("high")) return "bg-warning text-warning-foreground";
    if (lower.includes("medium")) return "bg-primary/20 text-primary";
    return "bg-muted text-muted-foreground";
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
        </div>

        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50 border-border">
                <TableHead className="text-muted-foreground font-semibold">Date</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Title</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Summary</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Category</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Source</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Impact</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Region</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No updates found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/30 border-border">
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium text-foreground max-w-xs">
                      {item.title}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-md">
                      {item.summary}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.source}
                    </TableCell>
                    <TableCell>
                      <Badge className={getImpactColor(item.impact)}>{item.impact}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.region}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>
            Showing {filteredData.length} of {data.length} updates
          </span>
        </div>
      </div>
    </GlassCard>
  );
};
