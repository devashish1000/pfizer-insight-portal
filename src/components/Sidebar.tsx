import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Scale, Microscope, Beaker, Globe2, Settings, HelpCircle } from "lucide-react";

export const Sidebar = () => {
  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/regulatory", icon: Scale, label: "Regulatory Intelligence" },
    { to: "/mednarrative", icon: Microscope, label: "Medical Research" },
    { to: "/clinical-trials", icon: Beaker, label: "Clinical Trials" },
    { to: "/public-health", icon: Globe2, label: "Public Health & Forecasts" },
  ];

  const bottomNavItems = [
    { to: "/settings", icon: Settings, label: "Settings" },
    { to: "/help", icon: HelpCircle, label: "Help" },
  ];

  return (
    <aside className="w-64 min-h-screen frosted-glass border-r border-cyan-glow/10 flex flex-col p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-lg bg-cyan-glow/20 flex items-center justify-center">
            <span className="text-cyan-glow font-bold text-xl">P</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold leading-normal text-text-off-white">Pfizer</h1>
            <p className="text-sm font-normal leading-normal text-text-light-gray">Intelligence Hub</p>
          </div>
        </div>
        
        <nav className="mt-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className="group relative flex items-center gap-3 rounded-lg px-3 py-2 text-text-light-gray transition-all duration-300 hover:bg-cyan-glow/10 hover:text-cyan-glow"
              activeClassName="relative bg-cyan-glow/10 text-cyan-glow shadow-glow-cyan active-glow font-bold"
            >
              <item.icon className="w-5 h-5 transition-colors group-hover:text-cyan-glow" />
              <p className="text-sm font-medium leading-normal">{item.label}</p>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto flex flex-col gap-1">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="group relative flex items-center gap-3 rounded-lg px-3 py-2 text-text-light-gray transition-all duration-300 hover:bg-cyan-glow/10 hover:text-cyan-glow"
            activeClassName="bg-cyan-glow/10 text-cyan-glow"
          >
            <item.icon className="w-5 h-5 transition-colors group-hover:text-cyan-glow" />
            <p className="text-sm font-medium leading-normal">{item.label}</p>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};
