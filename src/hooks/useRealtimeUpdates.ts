import { useEffect, useRef, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface UseRealtimeUpdatesOptions {
  queryKeys: string[][];
  interval?: number;
  enabled?: boolean;
}

/**
 * Hook for real-time polling updates
 * Automatically refetches specified queries at regular intervals
 */
export const useRealtimeUpdates = ({
  queryKeys,
  interval = 5000, // 5 seconds default
  enabled = true,
}: UseRealtimeUpdatesOptions) => {
  const queryClient = useQueryClient();
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPolling = useCallback(() => {
    if (!enabled) return;

    intervalIdRef.current = setInterval(() => {
      queryKeys.forEach((key) => {
        queryClient.refetchQueries({ queryKey: key });
      });
    }, interval);
  }, [queryClient, queryKeys, interval, enabled]);

  const stopPolling = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      startPolling();
    }
    return () => stopPolling();
  }, [enabled, startPolling, stopPolling]);

  return { startPolling, stopPolling };
};

/**
 * Hook for visibility-based polling
 * Pauses polling when tab is hidden, resumes when visible
 */
export const useVisibilityPolling = ({
  queryKeys,
  interval = 5000,
}: Omit<UseRealtimeUpdatesOptions, "enabled">) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return useRealtimeUpdates({
    queryKeys,
    interval,
    enabled: isVisible,
  });
};
