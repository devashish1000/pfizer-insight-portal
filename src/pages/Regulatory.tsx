import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { FilterBar } from "@/components/FilterBar";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Scale, FileCheck, AlertCircle, Clock, Globe } from "lucide-react";

const Regulatory = () => {
  const filters = [
    { label: "Agency" },
    { label: "Type" },
    { label: "Status" },
    { label: "Region" },
  ];

  const submissions = [
    {
      id: "FDA-2024-001",
      title: "New Drug Application - Oncology Compound XR-451",
      agency: "FDA",
      type: "NDA",
      status: "Under Review",
      submitted: "2024-01-15",
      deadline: "2024-07-15",
      priority: "High",
    },
    {
      id: "EMA-2024-042",
      title: "Marketing Authorization Application - Cardiovascular Treatment",
      agency: "EMA",
      type: "MAA",
      status: "Additional Info Requested",
      submitted: "2023-11-20",
      deadline: "2024-05-20",
      priority: "High",
    },
    {
      id: "PMDA-2024-018",
      title: "Approval Application - Rare Disease Therapy",
      agency: "PMDA",
      type: "JNDA",
      status: "In Preparation",
      submitted: null,
      deadline: "2024-06-30",
      priority: "Medium",
    },
  ];

  const metrics = [
    { label: "Active Submissions", value: "47", icon: FileCheck, color: "text-cyan-glow" },
    { label: "Pending Reviews", value: "12", icon: Clock, color: "text-warning" },
    { label: "Action Items", value: "8", icon: AlertCircle, color: "text-destructive" },
    { label: "Global Markets", value: "34", icon: Globe, color: "text-success" },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "under review":
        return "bg-cyan-glow/10 text-cyan-glow border-cyan-glow/30";
      case "additional info requested":
        return "bg-warning/10 text-warning border-warning/30";
      case "in preparation":
        return "bg-text-light-gray/10 text-text-light-gray border-text-light-gray/30";
      default:
        return "bg-text-light-gray/10 text-text-light-gray border-text-light-gray/30";
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col">
        <DashboardHeader 
          title="Regulatory Intelligence Tracker" 
          subtitle="Global regulatory submission monitoring and compliance tracking"
          icon={Scale}
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
            <h2 className="text-xl font-semibold text-text-off-white mb-6">Priority Regulatory Submissions</h2>
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="p-5 rounded-lg bg-cyan-glow/5 border border-cyan-glow/10 hover:border-cyan-glow/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-text-off-white">{submission.title}</h3>
                        <Badge variant="outline" className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-light-gray">
                        <span className="font-medium">ID:</span> {submission.id}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Agency</p>
                      <p className="text-sm font-medium text-text-off-white">{submission.agency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Type</p>
                      <p className="text-sm font-medium text-text-off-white">{submission.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Submitted</p>
                      <p className="text-sm font-medium text-text-off-white">
                        {submission.submitted || "Pending"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-light-gray mb-1">Target Decision</p>
                      <p className="text-sm font-medium text-text-off-white">{submission.deadline}</p>
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

export default Regulatory;
