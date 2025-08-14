// 薪酬洞察数据 API 服务层 - 简化版
// Salary Insights Data API Service Layer - Simplified Version

import type { CoreInsights, SalaryGapTrends, GrowthRankings } from "../types/salary";

// 统一API URL构建函数 - 支持环境变量配置
// Unified API URL builder - supports environment variable configuration
function getApiUrl(endpoint: string): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  return `${baseUrl}/api/v1/${endpoint}`;
}

// 获取核心洞察数据 - 最简单的实现
// Fetch core insights data - Simplest implementation
export async function fetchCoreInsights(): Promise<{
  data?: CoreInsights;
  error?: string;
}> {
  try {
    // 使用环境变量配置的API URL
    // Use environment variable configured API URL
    const response = await fetch(getApiUrl("core-insights"));

    // 检查响应是否成功
    // Check if response is successful
    if (!response.ok) {
      return { error: `Loading Failed: ${response.status}` };
    }

    // 解析并返回数据
    // Parse and return data
    const data = await response.json();
    return { data };
  } catch (error) {
    // 简单的错误处理
    // Simple error handling
    return { error: "Network Failed, please retry." };
  }
}

// 获取薪资差距趋势数据
// Fetch salary gap trends data
export async function fetchSalaryGapTrends(): Promise<{
  data?: SalaryGapTrends;
  error?: string;
}> {
  try {
    const response = await fetch(getApiUrl("salary-gap-trends"));
    
    if (!response.ok) {
      return { error: `Loading Failed: ${response.status}` };
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: "Network Failed, please retry." };
  }
}

// 获取工资增长排名数据
// Fetch growth rankings data
export async function fetchGrowthRankings(): Promise<{
  data?: GrowthRankings;
  error?: string;
}> {
  try {
    const response = await fetch(getApiUrl("growth-rankings"));
    
    if (!response.ok) {
      return { error: `Loading Failed: ${response.status}` };
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: "Network Failed, please retry." };
  }
}
