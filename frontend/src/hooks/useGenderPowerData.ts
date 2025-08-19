// Gender Power Data Custom Hook - Story 3
// 性别力量数据自定义Hook

import { useState, useEffect, useCallback } from "react";
import { fetchGenderPowerInsights } from "../services/api";
import type { GenderPowerInsights } from "../types/salary";

interface UseGenderPowerDataReturn {
  data: GenderPowerInsights | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * 性别力量数据管理Hook - Story 3
 * 
 * 功能：
 * - 自动加载性别力量洞察数据
 * - 统一状态管理（加载、错误、数据）
 * - 支持手动重新获取数据
 * - 性能优化：useCallback防止重复渲染
 * 
 * @returns {UseGenderPowerDataReturn} 数据状态和操作函数
 */
export function useGenderPowerData(): UseGenderPowerDataReturn {
  // 状态管理
  const [data, setData] = useState<GenderPowerInsights | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 获取数据的异步函数
  const loadGenderPowerData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchGenderPowerInsights();

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
    } catch {
      setError("Failed to load gender power data");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 手动重新获取数据
  const refetch = useCallback(() => {
    loadGenderPowerData();
  }, [loadGenderPowerData]);

  // 组件挂载时自动加载数据
  useEffect(() => {
    loadGenderPowerData();
  }, [loadGenderPowerData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

export default useGenderPowerData;