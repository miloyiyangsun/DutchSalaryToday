// useGapTrends.ts - 薪资差距趋势数据 + Hover交互Hook  
// Salary gap trends data with hover interaction custom hook

import { useState, useEffect, useCallback } from 'react';
import type { SalaryGapTrends, YearStatistics } from '../types/salary';
import { fetchSalaryGapTrends } from '../services/api';

export interface GapTrendsHookResult {
  gapTrends: SalaryGapTrends | null;
  hoveredYearStats: YearStatistics | null;
  loading: boolean;
  error: string | null;
  onChartHover: (data: any) => void;
  onChartMouseLeave: () => void;
  refetch: () => Promise<void>;
}

export function useGapTrends(): GapTrendsHookResult {
  const [gapTrends, setGapTrends] = useState<SalaryGapTrends | null>(null);
  const [hoveredYearStats, setHoveredYearStats] = useState<YearStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 计算某年份的最高最低薪资行业
  const calculateYearStatistics = useCallback((year: number): YearStatistics | null => {
    if (!gapTrends) return null;
    
    const yearData = gapTrends.data.find(d => d.year === year);
    if (!yearData?.industries) return null;
    
    const industriesEntries = Object.entries(yearData.industries);
    if (industriesEntries.length === 0) return null;
    
    // 找出最高和最低薪资行业
    const highest = industriesEntries.reduce((max, [name, salary]) => 
      salary > max.salary ? { name, salary } : max,
      { name: industriesEntries[0][0], salary: industriesEntries[0][1] }
    );
    
    const lowest = industriesEntries.reduce((min, [name, salary]) => 
      salary < min.salary ? { name, salary } : min,
      { name: industriesEntries[0][0], salary: industriesEntries[0][1] }
    );
    
    return { year, highest, lowest };
  }, [gapTrends]);

  // 处理图表hover事件
  const handleChartHover = useCallback((data: any) => {
    if (data?.activeLabel) {
      const year = parseInt(data.activeLabel);
      const stats = calculateYearStatistics(year);
      setHoveredYearStats(stats);
    }
  }, [calculateYearStatistics]);

  // 处理鼠标离开图表
  const handleChartMouseLeave = useCallback(() => {
    setHoveredYearStats(null);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchSalaryGapTrends();
      
      if (result.error) {
        setError(result.error);
        setGapTrends(null);
      } else {
        setGapTrends(result.data!);
        setError(null);
      }
    } catch (err) {
      setError('Unexpected error occurred while fetching gap trends data');
      setGapTrends(null);
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
    gapTrends,
    hoveredYearStats,
    loading,
    error,
    onChartHover: handleChartHover,
    onChartMouseLeave: handleChartMouseLeave,
    refetch
  };
}