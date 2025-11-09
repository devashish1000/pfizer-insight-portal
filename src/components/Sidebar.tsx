import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, FileText, BookOpen, Beaker, TrendingUp } from "lucide-react";

export const Sidebar = () => {
  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Global Intelligence" },
    { to: "/clinical-trials", icon: Beaker, label: "Clinical Trials Lens" },
    { to: "/regulatory", icon: FileText, label: "Regulatory Tracker" },
    { to: "/mednarrative", icon: BookOpen, label: "MedNarrative Insights" },
    { to: "/public-health", icon: TrendingUp, label: "Public Health" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border/50 flex flex-col">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-xl">P</span>
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Pfizer</h2>
            <p className="text-xs text-muted-foreground">Intelligence Hub</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
            activeClassName="bg-primary/10 text-primary font-medium border-l-2 border-primary"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary text-xs font-medium">AD</span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-foreground">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@pfizer.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
