import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export const LastUpdatedTimestamp = () => {
  const [timestamp, setTimestamp] = useState<string>("");

  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      setTimestamp(timeString);
    };

    updateTimestamp();
    
    // Listen for custom refresh events
    const handleRefresh = () => updateTimestamp();
    window.addEventListener('data-refreshed', handleRefresh);

    return () => {
      window.removeEventListener('data-refreshed', handleRefresh);
    };
  }, []);

  if (!timestamp) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-400 tracking-wide animate-fade-in">
      <Clock className="w-3.5 h-3.5" />
      <span>Last Updated: {timestamp}</span>
    </div>
  );
};
