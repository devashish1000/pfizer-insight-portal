import { Activity } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

export const DashboardHeader = ({ 
  title = "Pfizer Intelligence Hub", 
  subtitle = "Real-time global medical and regulatory updates" 
}: DashboardHeaderProps) => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded bg-primary/10">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
