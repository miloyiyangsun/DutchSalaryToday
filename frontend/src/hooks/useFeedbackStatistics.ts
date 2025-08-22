// useFeedbackStatistics.ts - 平台emoji反馈统计数据Hook
// Platform emoji feedback statistics data custom hook

import { useState, useEffect, useCallback } from "react";
import type { FeedbackStatistics, FeedbackStatisticsHookResult } from "../types/feedback";
import { fetchFeedbackStatistics } from "../services/api";

export function useFeedbackStatistics(): FeedbackStatisticsHookResult {
  const [statistics, setStatistics] = useState<FeedbackStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFeedbackStatistics();

      if (result.error) {
        setError(result.error);
        setStatistics(null);
      } else if (result.data) {
        setStatistics(result.data);
        setError(null);
      } else {
        setError("No statistics data received from API");
        setStatistics(null);
      }
    } catch (err) {
      console.error("FeedbackStatistics fetch error:", err);
      setError("Network Failed, please retry.");
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    return fetchData();
  }, [fetchData]);

  // 组件挂载时获取数据 - 使用空依赖数组避免无限循环
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchFeedbackStatistics();

        // 防止组件卸载后更新状态
        if (!isMounted) return;

        if (result.error) {
          setError(result.error);
          setStatistics(null);
        } else if (result.data) {
          setStatistics(result.data);
          setError(null);
        } else {
          setError("No statistics data received from API");
          setStatistics(null);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("FeedbackStatistics fetch error:", err);
        setError("Network Failed, please retry.");
        setStatistics(null);
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
    statistics,
    loading,
    error,
    refetch,
  };
}