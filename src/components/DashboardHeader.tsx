import { LucideIcon, Search, Download, User } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  showSearch?: boolean;
  showExport?: boolean;
}

export const DashboardHeader = ({ 
  title = "Pfizer Intelligence Hub", 
  subtitle = "Real-time global medical and regulatory updates",
  icon: Icon,
  showSearch = true,
  showExport = true,
}: DashboardHeaderProps) => {
  return (
    <header className="frosted-glass border-b border-cyan-glow/10 px-6 py-3 flex shrink-0 items-center justify-between whitespace-nowrap">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-text-off-white">
          {Icon && (
            <div className="text-cyan-glow">
              <Icon className="w-9 h-9" />
            </div>
          )}
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-off-white">
            {title}
          </h2>
        </div>
        <div className="text-sm text-text-light-gray">{subtitle}</div>
      </div>
      
      <div className="flex flex-1 items-center justify-end gap-4">
        {showSearch && (
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-glow/60" />
            <input 
              className="h-10 w-full rounded-lg border-none bg-cyan-glow/10 pl-10 pr-4 text-sm text-text-off-white placeholder-text-light-gray/70 ring-1 ring-inset ring-cyan-glow/20 transition-all duration-300 focus:ring-2 focus:ring-cyan-glow focus:outline-none" 
              placeholder="Search trials, drugs, or regions..." 
              type="text"
            />
          </div>
        )}
        
        {showExport && (
          <button className="flex h-10 min-w-0 items-center justify-center gap-2 overflow-hidden rounded-lg border border-cyan-glow/30 bg-cyan-glow/10 px-4 text-sm font-medium leading-normal text-cyan-glow transition-all duration-300 hover:bg-cyan-glow/20 hover:shadow-glow-cyan">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        )}
        
        <div className="relative">
          <button className="group flex size-10 cursor-pointer items-center justify-center rounded-full bg-cyan-glow/10 transition-colors hover:bg-cyan-glow/20 hover:shadow-glow-cyan">
            <User className="w-5 h-5 text-cyan-glow transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
};
