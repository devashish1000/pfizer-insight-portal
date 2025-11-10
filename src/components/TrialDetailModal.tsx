import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Activity, AlertTriangle, Flag, Users } from "lucide-react";

interface TrialData {
  trial_id: string;
  drug_name: string;
  phase: string;
  status: string;
  therapeutic_area: string;
  start_date: string;
  expected_end_date: string;
  completion_percent: string;
  site_locations?: string;
  region?: string;
  key_milestone?: string;
  next_milestone_date?: string;
  milestone_status?: string;
  bottleneck_category?: string;
  bottleneck_description?: string;
  enrolled_count?: string;
  target_enrollment?: string;
}

interface TrialDetailModalProps {
  trial: TrialData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TrialDetailModal = ({ trial, open, onOpenChange }: TrialDetailModalProps) => {
  if (!trial) return null;

  const statusColor = trial.status === "Active" ? "text-success" : 
                      trial.status === "Completed" ? "text-text-light-gray" : 
                      "text-warning";

  const milestoneColor = trial.milestone_status?.toLowerCase() === "completed" ? "text-success" :
                         trial.milestone_status?.toLowerCase() === "active" ? "text-cyan-glow" :
                         "text-text-light-gray";

  const enrollmentPercent = parseFloat(trial.completion_percent) || 0;
  const enrollmentColor = enrollmentPercent >= 75 ? "text-success" :
                          enrollmentPercent >= 50 ? "text-cyan-glow" :
                          enrollmentPercent >= 25 ? "text-warning" : "text-destructive";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-cyan-glow/30">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-text-off-white mb-2">
                {trial.drug_name}
              </DialogTitle>
              <DialogDescription className="text-text-light-gray">
                {trial.trial_id}
              </DialogDescription>
            </div>
            <Badge className={`${statusColor} bg-cyan-glow/10 border-cyan-glow/20`}>
              {trial.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Trial Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-text-light-gray flex items-center gap-2">
                <Activity className="w-4 h-4" /> Phase
              </p>
              <p className="text-base font-semibold text-text-off-white">{trial.phase}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-text-light-gray flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Therapeutic Area
              </p>
              <p className="text-base font-semibold text-text-off-white">{trial.therapeutic_area}</p>
            </div>
          </div>

          <Separator className="bg-cyan-glow/10" />

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-text-off-white mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-glow" /> Timeline
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-text-light-gray">Start Date</p>
                <p className="text-base text-text-off-white">
                  {trial.start_date ? new Date(trial.start_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  }) : "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-text-light-gray">Expected End Date</p>
                <p className="text-base text-text-off-white">
                  {trial.expected_end_date ? new Date(trial.expected_end_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  }) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-cyan-glow/10" />

          {/* Enrollment Progress */}
          <div>
            <h3 className="text-lg font-semibold text-text-off-white mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-glow" /> Enrollment Progress
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-light-gray">Completion</span>
                <span className={`text-xl font-bold ${enrollmentColor}`}>
                  {enrollmentPercent.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-3 bg-cyan-glow/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-glow to-primary transition-all duration-500"
                  style={{ width: `${enrollmentPercent}%` }}
                />
              </div>
              {trial.enrolled_count && trial.target_enrollment && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-light-gray">
                    {trial.enrolled_count} / {trial.target_enrollment} enrolled
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-cyan-glow/10" />

          {/* Sites */}
          {trial.site_locations && (
            <>
              <div>
                <h3 className="text-lg font-semibold text-text-off-white mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-glow" /> Trial Sites
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trial.site_locations.split(",").map((site, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-cyan-glow/10 border-cyan-glow/20 text-cyan-glow"
                    >
                      {site.trim()}
                    </Badge>
                  ))}
                </div>
                {trial.region && (
                  <p className="text-sm text-text-light-gray mt-2">Region: {trial.region}</p>
                )}
              </div>
              <Separator className="bg-cyan-glow/10" />
            </>
          )}

          {/* Milestones */}
          {trial.key_milestone && (
            <>
              <div>
                <h3 className="text-lg font-semibold text-text-off-white mb-3 flex items-center gap-2">
                  <Flag className="w-5 h-5 text-cyan-glow" /> Key Milestone
                </h3>
                <div className="space-y-2">
                  <p className="text-base text-text-off-white">{trial.key_milestone}</p>
                  {trial.next_milestone_date && (
                    <p className="text-sm text-text-light-gray">
                      Due: {new Date(trial.next_milestone_date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                  )}
                  {trial.milestone_status && (
                    <Badge className={`${milestoneColor} bg-cyan-glow/10 border-cyan-glow/20`}>
                      {trial.milestone_status}
                    </Badge>
                  )}
                </div>
              </div>
              <Separator className="bg-cyan-glow/10" />
            </>
          )}

          {/* Bottlenecks */}
          {trial.bottleneck_category && (
            <div>
              <h3 className="text-lg font-semibold text-text-off-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" /> Bottlenecks
              </h3>
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 space-y-2">
                <p className="font-semibold text-warning">{trial.bottleneck_category}</p>
                {trial.bottleneck_description && (
                  <p className="text-sm text-text-light-gray">{trial.bottleneck_description}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
