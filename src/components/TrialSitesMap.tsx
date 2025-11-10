import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";

interface TrialData {
  trial_id: string;
  drug_name: string;
  site_locations: string;
  status: string;
  phase: string;
  completion_percent: string;
}

interface TrialSitesMapProps {
  data: TrialData[];
}

// Basic city coordinates mapping (expand as needed)
const CITY_COORDINATES: Record<string, [number, number]> = {
  // North America
  "New York": [-74.006, 40.7128],
  "Los Angeles": [-118.2437, 34.0522],
  "Chicago": [-87.6298, 41.8781],
  "Boston": [-71.0589, 42.3601],
  "San Francisco": [-122.4194, 37.7749],
  "Houston": [-95.3698, 29.7604],
  "Miami": [-80.1918, 25.7617],
  "Seattle": [-122.3321, 47.6062],
  "Philadelphia": [-75.1652, 39.9526],
  "Washington": [-77.0369, 38.9072],
  
  // Europe
  "London": [-0.1276, 51.5074],
  "Paris": [2.3522, 48.8566],
  "Berlin": [13.405, 52.52],
  "Madrid": [-3.7038, 40.4168],
  "Rome": [12.4964, 41.9028],
  "Amsterdam": [4.9041, 52.3676],
  "Brussels": [4.3517, 50.8503],
  "Vienna": [16.3738, 48.2082],
  "Stockholm": [18.0686, 59.3293],
  "Copenhagen": [12.5683, 55.6761],
  
  // Asia
  "Tokyo": [139.6917, 35.6895],
  "Beijing": [116.4074, 39.9042],
  "Shanghai": [121.4737, 31.2304],
  "Seoul": [126.978, 37.5665],
  "Mumbai": [72.8777, 19.076],
  "Delhi": [77.1025, 28.7041],
  "Bangkok": [100.5018, 13.7563],
  "Singapore": [103.8198, 1.3521],
  "Hong Kong": [114.1694, 22.3193],
  "Manila": [120.9842, 14.5995],
  
  // Australia & Oceania
  "Sydney": [151.2093, -33.8688],
  "Melbourne": [144.9631, -37.8136],
  "Auckland": [174.7633, -36.8485],
  
  // South America
  "São Paulo": [-46.6333, -23.5505],
  "Buenos Aires": [-58.3816, -34.6037],
  "Mexico City": [-99.1332, 19.4326],
  
  // Africa
  "Cairo": [31.2357, 30.0444],
  "Johannesburg": [28.0473, -26.2041],
  "Lagos": [3.3792, 6.5244],
};

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const TrialSitesMap = ({ data }: TrialSitesMapProps) => {
  const [tooltipContent, setTooltipContent] = useState("");

  const siteMarkers = useMemo(() => {
    const locationMap = new Map<string, {
      coordinates: [number, number];
      trials: typeof data;
      count: number;
    }>();

    data.forEach((trial) => {
      if (!trial.site_locations) return;

      const sites = trial.site_locations.split(",").map((s) => s.trim());
      
      sites.forEach((site) => {
        const coords = CITY_COORDINATES[site];
        if (!coords) return;

        const key = `${coords[0]},${coords[1]}`;
        if (locationMap.has(key)) {
          const existing = locationMap.get(key)!;
          existing.trials.push(trial);
          existing.count++;
        } else {
          locationMap.set(key, {
            coordinates: coords,
            trials: [trial],
            count: 1,
          });
        }
      });
    });

    return Array.from(locationMap.values());
  }, [data]);

  if (siteMarkers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] text-text-light-gray text-sm">
        <div className="text-center">
          <p>No mappable trial sites found</p>
          <p className="text-xs mt-2">Sites need to match known city names</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[300px]">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
        }}
        className="w-full h-full"
      >
        <ZoomableGroup center={[0, 20]} zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="rgba(6, 182, 212, 0.1)"
                  stroke="rgba(6, 182, 212, 0.2)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { 
                      fill: "rgba(6, 182, 212, 0.15)", 
                      outline: "none",
                      cursor: "pointer"
                    },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
          
          {siteMarkers.map((marker, index) => {
            const size = Math.min(8 + marker.count * 2, 20);
            const activeTrials = marker.trials.filter((t) => t.status === "Active").length;
            
            return (
              <Marker
                key={`marker-${index}`}
                coordinates={marker.coordinates}
                onMouseEnter={() => {
                  const tooltipText = `
                    <div style="text-align: left;">
                      <strong>${marker.count} Trial${marker.count > 1 ? "s" : ""}</strong><br/>
                      Active: ${activeTrials}<br/>
                      ${marker.trials.slice(0, 3).map((t) => `• ${t.drug_name} (${t.phase})`).join("<br/>")}
                      ${marker.count > 3 ? `<br/>+${marker.count - 3} more` : ""}
                    </div>
                  `;
                  setTooltipContent(tooltipText);
                }}
                onMouseLeave={() => {
                  setTooltipContent("");
                }}
              >
                <g
                  data-tooltip-id="map-tooltip"
                  data-tooltip-html={tooltipContent}
                  className="cursor-pointer transition-all duration-300 hover:scale-125"
                >
                  <circle
                    r={size}
                    fill="rgba(6, 182, 212, 0.3)"
                    className="animate-pulse"
                  />
                  <circle
                    r={size * 0.6}
                    fill="#06b6d4"
                    stroke="#fff"
                    strokeWidth={1.5}
                    className="drop-shadow-glow"
                  />
                  <text
                    textAnchor="middle"
                    y={size + 12}
                    style={{ fontSize: "10px", fill: "#e2e8f0", fontWeight: "500" }}
                  >
                    {marker.count}
                  </text>
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
      
      <ReactTooltip
        id="map-tooltip"
        place="top"
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          color: "#e2e8f0",
          borderRadius: "8px",
          padding: "8px 12px",
          fontSize: "12px",
          border: "1px solid rgba(6, 182, 212, 0.3)",
          boxShadow: "0 4px 12px rgba(6, 182, 212, 0.2)",
          zIndex: 1000,
        }}
      />
    </div>
  );
};
