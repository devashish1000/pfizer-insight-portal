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
}

export const MultiSelectDropdown = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  className,
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
      ? placeholder
      : selectedValues.length === 1
      ? selectedValues[0]
      : `${selectedValues.length} selected`;

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 rounded-lg bg-background/50 border border-border/50 text-foreground px-3 text-sm focus:outline-none focus:border-primary/40 hover:bg-background/70 transition inline-flex items-center justify-between gap-2 min-w-[180px]"
        style={{
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <span className="truncate">{displayText}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 mt-2 min-w-[240px] rounded-lg bg-background border border-border shadow-lg"
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {/* Search Field */}
          <div className="p-2 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-8 pl-8 pr-2 text-sm rounded border border-border/50 bg-background focus:outline-none focus:border-primary/40"
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                  fontSize: "13px",
                }}
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
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded hover:bg-accent transition"
                    style={{
                      fontFamily: "Inter, Arial, sans-serif",
                    }}
                  >
                    <div
                      className={cn(
                        "h-4 w-4 rounded border flex items-center justify-center",
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-border/50"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <span className={cn(isSelected && "font-medium")}>
                      {option}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                No results found
              </div>
            )}
          </div>

          {/* Clear All / Select All Footer */}
          {filteredOptions.length > 0 && (
            <div className="p-2 border-t border-border/50 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-muted-foreground hover:text-foreground transition"
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                }}
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => onChange(filteredOptions)}
                className="text-xs text-muted-foreground hover:text-foreground transition"
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                }}
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
