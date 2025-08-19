// useWorkHoursData.ts - 工时分析数据Hook  
// Work Hours Analysis data custom hook - Story 2

import { useState, useEffect, useCallback } from "react";
import type { WorkHoursAnalysis } from "../types/salary";
import { fetchWorkHoursAnalysis } from "../services/api";

export interface WorkHoursDataHookResult {
  data: WorkHoursAnalysis | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWorkHoursData(): WorkHoursDataHookResult {
  const [data, setData] = useState<WorkHoursAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchWorkHoursAnalysis();

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
      console.error("WorkHoursData fetch error:", err);
      setError("Network Failed, please retry.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    return fetchData();
  }, [fetchData]);

  // 组件挂载时加载数据
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchWorkHoursAnalysis();

        // 防止组件卸载后更新状态
        if (!isMounted) return;

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
        if (!isMounted) return;
        console.error("WorkHoursData fetch error:", err);
        setError("Network Failed, please retry.");
        setData(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []); // 空依赖数组 - 只在组件挂载时执行一次

  return {
    data,
    loading,
    error,
    refetch,
  };
}