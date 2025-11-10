import { Calendar as CalendarIcon, MoveHorizontal } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

export const DateRangeFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-2 self-start">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-9 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow px-3 text-sm focus:outline-none focus:border-cyan-glow/40 hover:bg-cyan-glow/20 transition inline-flex items-center justify-center gap-2 w-[180px] whitespace-nowrap"
            >
              <span>Date Range</span>
              <MoveHorizontal className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent 
            className="bg-cyan-glow/10 text-cyan-glow text-xs rounded-md px-2 py-1 shadow-md border border-cyan-glow/20"
            mobileAutoHide
          >
            Click to select start and end dates
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div
        className={cn(
          "flex flex-col sm:flex-row gap-2 items-start sm:items-center overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-9 justify-start text-left font-normal bg-cyan-glow/10 border-cyan-glow/20 text-cyan-glow hover:bg-cyan-glow/20",
                !startDate && "text-text-light-gray"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "MMM dd, yyyy") : "From"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-background/95 border-cyan-glow/20" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={onStartDateChange}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <span className="text-text-light-gray hidden sm:inline">—</span>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-9 justify-start text-left font-normal bg-cyan-glow/10 border-cyan-glow/20 text-cyan-glow hover:bg-cyan-glow/20",
                !endDate && "text-text-light-gray"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "MMM dd, yyyy") : "To"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-background/95 border-cyan-glow/20" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={onEndDateChange}
              initialFocus
              disabled={(date) => startDate ? date < startDate : false}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
