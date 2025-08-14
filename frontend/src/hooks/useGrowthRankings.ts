// useGrowthRankings.ts - 工资增长排名数据Hook
// Growth rankings data custom hook

import { useState, useEffect, useCallback } from "react";
import type { GrowthRankings } from "../types/salary";
import { fetchGrowthRankings } from "../services/api";

export interface GrowthRankingsHookResult {
  growthRankings: GrowthRankings | null;
  selectedIndustries: string[];
  loading: boolean;
  error: string | null;
  setSelectedIndustries: React.Dispatch<React.SetStateAction<string[]>>;
  refetch: () => Promise<void>;
}

export function useGrowthRankings(): GrowthRankingsHookResult {
  const [growthRankings, setGrowthRankings] = useState<GrowthRankings | null>(
    null,
  );
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchGrowthRankings();

      if (result.error) {
        setError(result.error);
        setGrowthRankings(null);
      } else if (result.data) {
        setGrowthRankings(result.data);
        setError(null);

        // ✅ 基于API数据动态设置默认选中行业（全选）- 数据驱动
        setSelectedIndustries(
          result.data.rankings.map((ranking) => ranking.industry),
        );
      }
    } catch (err) {
      setError("Unexpected error occurred while fetching growth rankings data");
      setGrowthRankings(null);
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
    growthRankings,
    selectedIndustries,
    loading,
    error,
    setSelectedIndustries,
    refetch,
  };
}
