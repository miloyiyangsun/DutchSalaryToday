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
      console.error("StoryData fetch error:", err);
      setError("Network Failed, please retry.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    return fetchData();
  }, [fetchData]);

  // 🔧 修复：使用空依赖数组避免无限循环
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchCoreInsights();

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
        console.error("StoryData fetch error:", err);
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
  }, []); // 🎯 空依赖数组 - 只在组件挂载时执行一次

  return {
    data,
    loading,
    error,
    refetch,
  };
}
