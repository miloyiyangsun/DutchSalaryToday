// useStoryData.ts - 核心洞察数据Hook
// Core insights data custom hook

import { useState, useEffect, useCallback } from "react";
import type { CoreInsights } from "../types/salary";
import { fetchCoreInsights } from "../services/api";

export interface StoryDataHookResult {
  data: CoreInsights | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useStoryData(): StoryDataHookResult {
  const [data, setData] = useState<CoreInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchCoreInsights();

      if (result.error) {
        setError(result.error);
        setData(null);
      } else if (result.data) {
        setData(result.data);
        setError(null);
      } else {
        setError("No data received from API");
        setData(null);
      }
    } catch (err) {
      setError("Unexpected error occurred while fetching story data");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
