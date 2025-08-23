// Hidden Labor Cost Data Custom Hook - Story 5
// 隐形人力成本数据自定义Hook

import { useState, useEffect, useCallback } from "react";
import { fetchHiddenCostInsights } from "../services/api";
import type { HiddenCostInsights } from "../types/salary";

export interface UseHiddenCostDataReturn {
  data: HiddenCostInsights | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * 隐形人力成本数据管理Hook - Story 5
 * 
 * 功能：
 * - 自动加载隐形成本洞察数据
 * - 统一状态管理（加载、错误、数据）
 * - 支持手动重新获取数据
 * - 性能优化：useCallback防止重复渲染
 * 
 * @returns {UseHiddenCostDataReturn} 数据状态和操作函数
 */
export function useHiddenCostData(): UseHiddenCostDataReturn {
  // 状态管理
  const [data, setData] = useState<HiddenCostInsights | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 数据获取函数 - 使用useCallback优化性能
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchHiddenCostInsights();
      
      if (result.error) {
        setError(result.error);
        setData(null);
      } else if (result.data) {
        setData(result.data);
        setError(null);
      }
    } catch (err) {
      setError("Unexpected error occurred");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 手动重新获取数据
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // 组件挂载时自动获取数据
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