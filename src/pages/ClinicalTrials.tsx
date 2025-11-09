import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Users, CheckCircle2, Clock } from "lucide-react";

const ClinicalTrials = () => {
  const trials = [
    {
      id: "NCT05234567",
      title: "Phase III Study of Novel Oncology Compound",
      phase: "Phase III",
      status: "Active, recruiting",
      enrollment: 450,
      target: 600,
      progress: 75,
      region: "Global",
      indication: "Non-Small Cell Lung Cancer",
    },
    {
      id: "NCT05234568",
      title: "Immunotherapy Combination for Advanced Melanoma",
      phase: "Phase II",
      status: "Active, not recruiting",
      enrollment: 120,
      target: 120,
      progress: 100,
      region: "North America, EU",
      indication: "Melanoma",
    },
    {
      id: "NCT05234569",
      title: "Rare Disease Treatment - Pediatric Population",
      phase: "Phase I/II",
      status: "Active, recruiting",
      enrollment: 18,
      target: 45,
      progress: 40,
      region: "North America",
      indication: "Rare Genetic Disorder",
    },
  ];

  const metrics = [
    { label: "Active Trials", value: "127", icon: Activity, color: "text-primary" },
    { label: "Total Enrollment", value: "45,892", icon: Users, color: "text-success" },
    { label: "Completed This Quarter", value: "23", icon: CheckCircle2, color: "text-primary" },
    { label: "Avg. Duration", value: "18.4 mo", icon: Clock, color: "text-warning" },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <DashboardHeader 
          title="Clinical Trials Lens" 
          subtitle="Real-time clinical research monitoring and analysis"
        />
        
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric) => (
              <GlassCard key={metric.label}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                    <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                  </div>
                  <metric.icon className={`w-10 h-10 ${metric.color}`} />
                </div>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Priority Clinical Trials</h2>
            <div className="space-y-6">
              {trials.map((trial) => (
                <div
                  key={trial.id}
                  className="p-5 rounded-lg bg-background/30 border border-border/30 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{trial.title}</h3>
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          {trial.phase}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium">ID:</span> {trial.id} • <span className="font-medium">Indication:</span> {trial.indication}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Status</p>
                      <p className="text-sm font-medium text-foreground">{trial.status}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Region</p>
                      <p className="text-sm font-medium text-foreground">{trial.region}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Enrollment</p>
                      <p className="text-sm font-medium text-foreground">
                        {trial.enrollment} / {trial.target} patients
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>Enrollment Progress</span>
                      <span className="font-medium">{trial.progress}%</span>
                    </div>
                    <Progress value={trial.progress} className="h-2" />
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

export default ClinicalTrials;
