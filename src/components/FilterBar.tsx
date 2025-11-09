import { Plus, ChevronDown } from "lucide-react";

interface FilterItem {
  label: string;
  active?: boolean;
}

interface FilterBarProps {
  filters: FilterItem[];
}

export const FilterBar = ({ filters }: FilterBarProps) => {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-cyan-glow/10 p-4">
      {filters.map((filter, index) => (
        <button 
          key={index}
          className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-2 text-sm font-medium leading-normal transition-all duration-300 ${
            filter.active 
              ? 'bg-cyan-glow text-black shadow-glow-cyan' 
              : 'bg-cyan-glow/10 text-cyan-glow hover:bg-cyan-glow/20 hover:shadow-glow-cyan'
          }`}
        >
          <span>{filter.label}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      ))}
      <button className="ml-auto flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-cyan-glow/20 pl-3 pr-3 text-cyan-glow text-sm font-medium leading-normal transition-all duration-300 hover:bg-cyan-glow/20 hover:shadow-glow-cyan">
        <Plus className="w-4 h-4" />
        <span>Add Filter</span>
      </button>
    </div>
  );
};
