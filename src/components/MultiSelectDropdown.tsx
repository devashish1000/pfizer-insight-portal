import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  width?: string;
}

export const MultiSelectDropdown = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  className,
  width = "180px",
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((v) => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const displayText =
    selectedValues.length === 0
      ? label
      : `${label.replace(/^All /, "")}: ${selectedValues.length}`;

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow px-3 text-sm focus:outline-none focus:border-cyan-glow/40 hover:bg-cyan-glow/20 transition inline-flex items-center justify-between gap-2"
        style={{ width: width }}
      >
        <span className="truncate">{displayText}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform text-cyan-glow",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 mt-2 min-w-[240px] rounded-lg border border-cyan-glow/20 bg-card/95 backdrop-blur-sm shadow-glow-cyan"
        >
          {/* Search Field */}
          <div className="p-2 border-b border-cyan-glow/10">
            <div className="relative">
              <Search 
                className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-glow/50" 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-8 pl-8 pr-2 rounded bg-cyan-glow/5 border border-cyan-glow/20 text-text-off-white placeholder:text-text-light-gray text-sm focus:outline-none focus:border-cyan-glow/40 transition"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-[300px] overflow-y-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleOption(option)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded transition-colors hover:bg-cyan-glow/10 text-text-off-white"
                  >
                    <div
                      className={cn(
                        "h-4 w-4 rounded border flex items-center justify-center transition-colors",
                        isSelected ? "bg-cyan-glow border-cyan-glow" : "border-cyan-glow/30"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 text-black" />}
                    </div>
                    <span 
                      className={cn(isSelected && "font-medium text-cyan-glow")}
                    >
                      {option}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-4 text-sm text-center text-text-light-gray">
                No results found
              </div>
            )}
          </div>

          {/* Clear All / Select All Footer */}
          {filteredOptions.length > 0 && (
            <div className="p-2 border-t border-cyan-glow/10 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-text-light-gray hover:text-cyan-glow transition-colors"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => onChange(filteredOptions)}
                className="text-xs text-text-light-gray hover:text-cyan-glow transition-colors"
              >
                Select all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
