import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Button } from "./ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

interface TrialData {
  trial_id: string;
  drug_name: string;
  phase: string;
  status: string;
  start_date: string;
  expected_end_date: string;
  completion_percent: string;
  therapeutic_area: string;
}

interface TrialsGanttChartProps {
  data: TrialData[];
  maxTrials?: number;
  onTrialClick?: (trial: TrialData) => void;
}

interface GanttDataPoint {
  trialName: string;
  phase: string;
  status: string;
  startOffset: number;
  duration: number;
  completionPercent: number;
  startDate: string;
  endDate: string;
  therapeuticArea: string;
  trend: string;
  trendIcon: string;
  originalTrial: TrialData;
}

const PHASE_COLORS = {
  "Phase I": "#3b82f6",
  "Phase II": "#8b5cf6",
  "Phase III": "#ec4899",
  "Phase IV": "#f59e0b",
  "Preclinical": "#6366f1",
  "default": "#06b6d4",
};

const STATUS_COLORS = {
  "Active": "#10b981",
  "Completed": "#64748b",
  "On Hold": "#f59e0b",
  "Recruiting": "#06b6d4",
  "default": "#06b6d4",
};

export const TrialsGanttChart = ({ data, maxTrials = 10, onTrialClick }: TrialsGanttChartProps) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const ganttData = useMemo(() => {
    // Filter valid trials with dates
    const validTrials = data.filter(
      (trial) => trial.start_date && trial.expected_end_date
    );

    // Get earliest and latest dates for timeline reference
    const allDates = validTrials.flatMap((t) => [
      new Date(t.start_date).getTime(),
      new Date(t.expected_end_date).getTime(),
    ]);
    
    const minDate = Math.min(...allDates);
    const maxDate = Math.max(...allDates);
    const timelineRange = maxDate - minDate;

    // Transform data for Gantt chart
    const transformed: GanttDataPoint[] = validTrials
      .slice(0, maxTrials)
      .map((trial) => {
        const startTime = new Date(trial.start_date).getTime();
        const endTime = new Date(trial.expected_end_date).getTime();
        const duration = endTime - startTime;
        const startOffset = startTime - minDate;
        const completionPercent = parseFloat(trial.completion_percent) || 0;
        
        // Calculate trend based on completion percentage
        let trend = "";
        let trendIcon = "";
        if (completionPercent >= 75) {
          trend = "On Schedule";
          trendIcon = "▲";
        } else if (completionPercent >= 40) {
          trend = "Moderate Progress";
          trendIcon = "◕";
        } else {
          trend = "Behind";
          trendIcon = "▼";
        }
        
        return {
          trialName: `${trial.drug_name} (${trial.trial_id})`,
          phase: trial.phase || "Unknown",
          status: trial.status || "Unknown",
          startOffset: (startOffset / timelineRange) * 100,
          duration: (duration / timelineRange) * 100,
          completionPercent,
          startDate: new Date(trial.start_date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          endDate: new Date(trial.expected_end_date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          therapeuticArea: trial.therapeutic_area || "N/A",
          trend,
          trendIcon,
          originalTrial: trial,
        };
      });

    return transformed;
  }, [data, maxTrials]);

  const handleBarClick = (data: any) => {
    if (onTrialClick && data && data.payload) {
      const trialName = data.payload.trialName;
      const trial = data.payload.originalTrial;
      if (trial) {
        onTrialClick(trial);
      }
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-cyan-glow/30 rounded-lg p-3 shadow-glow-cyan">
          <p className="font-semibold text-text-off-white mb-2">{data.trialName}</p>
          <div className="space-y-1 text-xs">
            <p className="text-text-light-gray">
              <span className="text-cyan-glow">Drug:</span> {data.originalTrial.drug_name}
            </p>
            <p className="text-text-light-gray">
              <span className="text-cyan-glow">Phase:</span> {data.phase}
            </p>
            <p className="text-text-light-gray">
              <span className="text-cyan-glow">Status:</span> {data.status}
            </p>
            <p className="text-text-light-gray">
              <span className="text-cyan-glow">Start:</span> {data.startDate} → <span className="text-cyan-glow">End:</span> {data.endDate}
            </p>
            <p className="text-text-light-gray">
              <span className="text-cyan-glow">Progress:</span> {data.completionPercent.toFixed(1)}%
            </p>
            <p className={`text-sm font-semibold ${
              data.completionPercent >= 75 ? 'text-success' : 
              data.completionPercent >= 40 ? 'text-warning' : 
              'text-destructive'
            }`}>
              <span className="text-cyan-glow">Trend:</span> {data.trendIcon} {data.trend}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (ganttData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] text-text-light-gray text-sm">
        <div className="text-center">
          <p>No valid trial timeline data available</p>
          <p className="text-xs mt-2">Trials need start and end dates to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-end gap-4 pb-3 border-b border-cyan-glow/10">
        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-light-gray font-semibold">Zoom:</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setZoomLevel((prev) => Math.max(0.5, prev - 0.25))}
            disabled={zoomLevel <= 0.5}
            className="h-7 w-7 p-0 bg-cyan-glow/10 border-cyan-glow/20 text-cyan-glow hover:bg-cyan-glow/20"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-text-off-white font-mono">{(zoomLevel * 100).toFixed(0)}%</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setZoomLevel((prev) => Math.min(2, prev + 0.25))}
            disabled={zoomLevel >= 2}
            className="h-7 w-7 p-0 bg-cyan-glow/10 border-cyan-glow/20 text-cyan-glow hover:bg-cyan-glow/20"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="100%" minHeight={400 * zoomLevel}>
      <BarChart
        data={ganttData}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          axisLine={{ stroke: "rgba(6, 182, 212, 0.2)" }}
          tickFormatter={(value) => `${value}%`}
        />
        <YAxis
          type="category"
          dataKey="trialName"
          width={200}
          tick={(props) => {
            const { x, y, payload } = props;
            const dataPoint = ganttData.find(d => d.trialName === payload.value);
            return (
              <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={4} textAnchor="end" fill="#e2e8f0" fontSize={11}>
                  {payload.value}
                </text>
                {dataPoint && (
                  <text 
                    x={-5} 
                    y={0} 
                    dy={4} 
                    textAnchor="end" 
                    fontSize={10}
                    fill={
                      dataPoint.completionPercent >= 75 ? '#22c55e' : 
                      dataPoint.completionPercent >= 40 ? '#facc15' : 
                      '#ef4444'
                    }
                  >
                    {dataPoint.trendIcon}
                  </text>
                )}
              </g>
            );
          }}
          axisLine={{ stroke: "rgba(6, 182, 212, 0.2)" }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(6, 182, 212, 0.1)" }} />
        <Legend
          wrapperStyle={{ paddingTop: "20px" }}
          iconType="circle"
          formatter={(value) => <span className="text-text-light-gray text-xs">{value}</span>}
        />
        
        {/* Timeline bar (background) */}
        <Bar
          dataKey="startOffset"
          stackId="timeline"
          fill="transparent"
          isAnimationActive={true}
          animationDuration={800}
        />
        
        {/* Duration bar with completion overlay */}
        <Bar
          dataKey="duration"
          stackId="timeline"
          fill="#06b6d4"
          radius={[0, 8, 8, 0]}
          isAnimationActive={true}
          animationDuration={1000}
          animationBegin={200}
          name="Trial Duration"
          onClick={handleBarClick}
        >
          {ganttData.map((entry, index) => {
            const phaseColor = PHASE_COLORS[entry.phase as keyof typeof PHASE_COLORS] || PHASE_COLORS.default;
            const statusColor = STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default;
            
            // Use phase color with opacity based on completion
            const opacity = 0.4 + (entry.completionPercent / 100) * 0.6;
            
            return (
              <Cell
                key={`cell-${index}`}
                fill={phaseColor}
                opacity={opacity}
                className="transition-all duration-300 hover:opacity-100 cursor-pointer"
              />
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
};
