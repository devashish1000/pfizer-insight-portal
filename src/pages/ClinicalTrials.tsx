import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { FilterBar } from "@/components/FilterBar";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Beaker, CheckCircle2, HourglassIcon, Calendar, Flag, MoreVertical } from "lucide-react";

const ClinicalTrials = () => {
  const filters = [
    { label: "Therapeutic Area" },
    { label: "Drug Name" },
    { label: "Trial Phase" },
    { label: "Region" },
    { label: "Status: Active", active: true },
  ];

  const milestones = [
    {
      id: 1,
      title: "Phase II Completion (PAX-101)",
      date: "Achieved: 15 Jun 2024",
      status: "completed",
      icon: CheckCircle2,
      iconColor: "text-success",
      bgColor: "bg-success/20",
    },
    {
      id: 2,
      title: "First Patient Dosed (CVX-34)",
      date: "Due: 30 Jul 2024",
      status: "active",
      icon: HourglassIcon,
      iconColor: "text-cyan-glow",
      bgColor: "bg-cyan-glow/20",
    },
    {
      id: 3,
      title: "Interim Analysis Due (IMN-05)",
      date: "Upcoming: 15 Aug 2024",
      status: "upcoming",
      icon: Calendar,
      iconColor: "text-text-light-gray",
      bgColor: "bg-cyan-glow/10",
    },
    {
      id: 4,
      title: "Regulatory Submission (PAX-101)",
      date: "Upcoming: 01 Oct 2024",
      status: "upcoming",
      icon: Calendar,
      iconColor: "text-text-light-gray",
      bgColor: "bg-cyan-glow/10",
    },
    {
      id: 5,
      title: "Primary Endpoint Met (GLC-77)",
      date: "Upcoming: 20 Nov 2024",
      status: "upcoming",
      icon: Calendar,
      iconColor: "text-text-light-gray",
      bgColor: "bg-cyan-glow/10",
    },
  ];

  const bottlenecks = [
    {
      id: 1,
      title: "Patient Recruitment Slowdown",
      description: "Trial NCT0456789 (Oncology) - EU Region",
      severity: "high",
      color: "bg-destructive",
      shadowColor: "shadow-glow-red",
      iconColor: "text-destructive",
    },
    {
      id: 2,
      title: "Supply Chain Issue",
      description: "Trial NCT0123456 (Cardiology) - US Site 14",
      severity: "medium",
      color: "bg-warning",
      shadowColor: "shadow-glow-amber",
      iconColor: "text-warning",
    },
    {
      id: 3,
      title: "Regulatory Query Received",
      description: "Trial NCT0789012 (Virology) - FDA Submission",
      severity: "medium",
      color: "bg-warning",
      shadowColor: "shadow-glow-amber",
      iconColor: "text-warning",
    },
    {
      id: 4,
      title: "Adverse Event Report",
      description: "Trial NCT0345678 (Immunology) - Japan",
      severity: "high",
      color: "bg-destructive",
      shadowColor: "shadow-glow-red",
      iconColor: "text-destructive",
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col">
        <DashboardHeader 
          title="Clinical Trials Lens" 
          subtitle="Last updated: 14:32 EST"
          icon={Beaker}
        />
        
        <FilterBar filters={filters} />

        <div className="flex flex-1 gap-6 overflow-auto p-6">
          <div className="flex flex-1 flex-col gap-6">
            {/* Trials Timeline */}
            <GlassCard className="min-h-[400px]">
              <h3 className="mb-4 text-lg font-semibold text-text-off-white">Trials Timeline</h3>
              <div className="flex-1 flex items-center justify-center text-text-light-gray text-sm">
                [Gantt Chart Placeholder - Connect with data visualization library]
              </div>
            </GlassCard>

            {/* Bottom Row: Global Trial Sites & Bottleneck Monitor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Global Trial Sites */}
              <GlassCard>
                <h3 className="mb-4 text-lg font-semibold text-text-off-white">Global Trial Sites</h3>
                <div className="relative min-h-[300px] w-full h-full rounded-lg bg-deep-navy flex items-center justify-center">
                  <span className="text-text-light-gray text-sm">[World Map with Trial Site Markers]</span>
                </div>
              </GlassCard>

              {/* Bottleneck Monitor */}
              <GlassCard>
                <h3 className="mb-4 text-lg font-semibold text-text-off-white">Bottleneck Monitor</h3>
                <div className="flex flex-col gap-3">
                  {bottlenecks.map((bottleneck) => (
                    <div
                      key={bottleneck.id}
                      className="group flex cursor-pointer items-start gap-3 rounded-lg bg-cyan-glow/10 p-3 transition-colors duration-300 hover:bg-cyan-glow/20"
                    >
                      <div className={`h-10 w-1.5 rounded-full ${bottleneck.color} ${bottleneck.shadowColor}`} />
                      <div className="flex-1">
                        <p className="font-semibold text-text-off-white">{bottleneck.title}</p>
                        <p className="text-sm text-text-light-gray">{bottleneck.description}</p>
                      </div>
                      <Flag className={`ml-auto w-5 h-5 ${bottleneck.iconColor} transition-all duration-300 group-hover:scale-125 group-hover:text-cyan-glow`} />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Right Sidebar: Key Milestone Tracker */}
          <aside className="glassmorphism w-[320px] shrink-0 rounded-xl p-4 flex flex-col overflow-hidden">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-off-white">Key Milestone Tracker</h3>
              <button className="text-text-light-gray transition-all duration-300 hover:scale-110 hover:text-cyan-glow">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-4 overflow-y-auto">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="grid grid-cols-[32px_1fr] gap-x-2">
                  <div className="flex flex-col items-center gap-1 pt-2">
                    <div className={`relative flex size-8 items-center justify-center rounded-full ${milestone.bgColor}`}>
                      <milestone.icon className={`w-5 h-5 ${milestone.iconColor}`} />
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="h-full w-[2px] bg-cyan-glow/20" />
                    )}
                  </div>
                  <div className={`-ml-2 flex flex-1 cursor-pointer flex-col rounded-lg p-2 pb-4 transition-colors ${
                    milestone.status === 'active' ? 'bg-cyan-glow/10' : 'hover:bg-cyan-glow/10'
                  }`}>
                    <p className="text-sm font-medium leading-normal text-text-off-white">{milestone.title}</p>
                    <p className="text-xs leading-normal text-text-light-gray">{milestone.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClinicalTrials;
