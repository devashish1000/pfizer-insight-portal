import { Activity } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded bg-primary/10">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Pfizer Intelligence Hub
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time global medical and regulatory updates
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
