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
        className="h-9 rounded-md border inline-flex items-center justify-between gap-2 transition-all focus:outline-none"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #d0d5dd",
          borderRadius: "6px",
          padding: "6px 12px",
          fontSize: "14px",
          color: "#111827",
          fontFamily: "Inter, Arial, sans-serif",
          width: width,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f9fafb";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#ffffff";
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = "1px solid #1a73e8";
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = "1px solid #d0d5dd";
        }}
      >
        <span className="truncate">{displayText}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform"
          )}
          style={{
            color: "#1a73e8",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 mt-2 min-w-[240px] rounded-lg border"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            borderRadius: "6px",
          }}
        >
          {/* Search Field */}
          <div className="p-2 border-b" style={{ borderColor: "#e0e0e0" }}>
            <div className="relative">
              <Search 
                className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4" 
                style={{ color: "#9ca3af" }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-8 pl-8 pr-2 rounded focus:outline-none"
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                  fontSize: "13px",
                  border: "1px solid #ddd",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  backgroundColor: "#ffffff",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid #1a73e8";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid #ddd";
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
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded transition-colors"
                    style={{
                      fontFamily: "Inter, Arial, sans-serif",
                      color: "#111827",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div
                      className={cn(
                        "h-4 w-4 rounded border flex items-center justify-center"
                      )}
                      style={{
                        backgroundColor: isSelected ? "#1a73e8" : "transparent",
                        borderColor: isSelected ? "#1a73e8" : "#d0d5dd",
                      }}
                    >
                      {isSelected && <Check className="h-3 w-3" style={{ color: "#ffffff" }} />}
                    </div>
                    <span 
                      className={cn(isSelected && "font-medium")}
                      style={{ color: "#111827" }}
                    >
                      {option}
                    </span>
                  </button>
                );
              })
            ) : (
              <div 
                className="px-3 py-4 text-sm text-center"
                style={{ color: "#9ca3af" }}
              >
                No results found
              </div>
            )}
          </div>

          {/* Clear All / Select All Footer */}
          {filteredOptions.length > 0 && (
            <div 
              className="p-2 border-t flex items-center justify-between gap-2"
              style={{ borderColor: "#e0e0e0" }}
            >
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs transition-colors"
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                  color: "#6b7280",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#111827";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#6b7280";
                }}
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => onChange(filteredOptions)}
                className="text-xs transition-colors"
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                  color: "#6b7280",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#111827";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#6b7280";
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
