// Work Intensification Data Custom Hook - Story 4
// 工作密集化数据自定义Hook

import { useState, useEffect, useCallback } from "react";
import { fetchWorkIntensificationInsights } from "../services/api";
import type { WorkIntensificationInsights } from "../types/salary";

interface UseWorkIntensificationDataReturn {
  data: WorkIntensificationInsights | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * 工作密集化数据管理Hook - Story 4
 * 
 * 功能：
 * - 自动加载工作密集化洞察数据
 * - 统一状态管理（加载、错误、数据）
 * - 支持手动重新获取数据
 * - 性能优化：useCallback防止重复渲染
 * 
 * @returns {UseWorkIntensificationDataReturn} 数据状态和操作函数
 */
export function useWorkIntensificationData(): UseWorkIntensificationDataReturn {
  // 状态管理
  const [data, setData] = useState<WorkIntensificationInsights | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 获取数据的异步函数
  const loadWorkIntensificationData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchWorkIntensificationInsights();

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
      setError("Failed to load work intensification data");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 手动重新获取数据
  const refetch = useCallback(() => {
    loadWorkIntensificationData();
  }, [loadWorkIntensificationData]);

  // 组件挂载时自动加载数据
  useEffect(() => {
    loadWorkIntensificationData();
  }, [loadWorkIntensificationData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

export default useWorkIntensificationData;