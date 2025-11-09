import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export const useRefreshData = (queryKey: string[]) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const refreshData = async () => {
    setIsRefreshing(true);
    
    try {
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.refetchQueries({ queryKey });
      
      const timestamp = new Date().toLocaleTimeString();
      console.log(`[${timestamp}] Data refreshed for: ${queryKey.join(", ")}`);
      
      toast({
        title: "Data refreshed successfully",
        description: `Updated at ${timestamp}`,
        duration: 2000,
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh failed",
        description: "Please try again",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  return { isRefreshing, refreshData };
};
