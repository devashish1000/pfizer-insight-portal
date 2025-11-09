import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { FilterBar } from "@/components/FilterBar";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Microscope, BookOpen, TrendingUp, MessageSquare, Eye } from "lucide-react";

const MedNarrative = () => {
  // Dummy state for refresh - in production this would fetch actual data
  const handleRefresh = () => {
    console.log(`[${new Date().toLocaleTimeString()}] Medical Research data refreshed`);
  };

  const filters = [
    { label: "Sentiment" },
    { label: "Source Type" },
    { label: "Impact Level" },
    { label: "Date Range" },
  ];

  const narratives = [
    {
      id: "MN-2024-089",
      title: "Breakthrough Immunotherapy Results Published in NEJM",
      source: "New England Journal of Medicine",
      date: "2024-03-10",
      sentiment: "Positive",
      reach: "High",
      impact: "Significant",
      summary: "Phase III trial demonstrates 47% improvement in progression-free survival compared to standard of care.",
      mentions: 234,
      engagement: "12.4K",
    },
    {
      id: "MN-2024-090",
      title: "Rare Disease Treatment Shows Promise in Early Clinical Data",
      source: "The Lancet",
      date: "2024-03-08",
      sentiment: "Positive",
      reach: "Medium",
      impact: "Moderate",
      summary: "First-in-human study reveals favorable safety profile and preliminary efficacy signals in ultra-rare genetic disorder.",
      mentions: 156,
      engagement: "8.2K",
    },
    {
      id: "MN-2024-091",
      title: "Cardiovascular Safety Profile Update from Real-World Evidence",
      source: "JAMA Cardiology",
      date: "2024-03-05",
      sentiment: "Neutral",
      reach: "High",
      impact: "Monitoring",
      summary: "Large observational study confirms established cardiovascular safety profile across diverse patient populations.",
      mentions: 189,
      engagement: "9.8K",
    },
  ];

  const metrics = [
    { label: "Active Narratives", value: "67", icon: BookOpen, color: "text-cyan-glow" },
    { label: "Positive Sentiment", value: "78%", icon: TrendingUp, color: "text-success" },
    { label: "Media Mentions", value: "1,247", icon: MessageSquare, color: "text-cyan-glow" },
    { label: "Total Reach", value: "2.4M", icon: Eye, color: "text-warning" },
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "bg-success/10 text-success border-success/30";
      case "neutral":
        return "bg-text-light-gray/10 text-text-light-gray border-text-light-gray/30";
      case "negative":
        return "bg-destructive/10 text-destructive border-destructive/30";
      default:
        return "bg-text-light-gray/10 text-text-light-gray border-text-light-gray/30";
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col">
        <DashboardHeader 
          title="Medical Research Insights" 
          subtitle="Medical communication monitoring and sentiment analysis"
          icon={Microscope}
          onRefresh={handleRefresh}
        />
        
        <FilterBar filters={filters} />
        
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric) => (
              <GlassCard key={metric.label}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-light-gray mb-1">{metric.label}</p>
                    <p className="text-3xl font-bold text-text-off-white">{metric.value}</p>
                  </div>
                  <metric.icon className={`w-10 h-10 ${metric.color}`} />
                </div>
              </GlassCard>
            ))}
          </div>

          <GlassCard>
            <h2 className="text-xl font-semibold text-text-off-white mb-6">Recent Medical Narratives</h2>
            <div className="space-y-4">
              {narratives.map((narrative) => (
                <div
                  key={narrative.id}
                  className="p-5 rounded-lg bg-cyan-glow/5 border border-cyan-glow/10 hover:border-cyan-glow/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-text-off-white">{narrative.title}</h3>
                        <Badge variant="outline" className={getSentimentColor(narrative.sentiment)}>
                          {narrative.sentiment}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-light-gray mb-3">
                        <span className="font-medium">{narrative.source}</span> • {narrative.date}
                      </p>
                      <p className="text-sm text-text-off-white/80 mb-4">{narrative.summary}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-cyan-glow/10">
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Reach</p>
                      <p className="text-sm font-medium text-text-off-white">{narrative.reach}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Impact</p>
                      <p className="text-sm font-medium text-text-off-white">{narrative.impact}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Mentions</p>
                      <p className="text-sm font-medium text-text-off-white">{narrative.mentions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Engagement</p>
                      <p className="text-sm font-medium text-text-off-white">{narrative.engagement}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MedNarrative;
