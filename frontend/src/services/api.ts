// 薪酬洞察数据 API 服务层 - 简化版
// Salary Insights Data API Service Layer - Simplified Version

import type {
  CoreInsights,
  SalaryGapTrends,
  GrowthRankings,
} from "../types/salary";

// 统一API URL构建函数 - 支持环境变量配置
// Unified API URL builder - supports environment variable configuration
function getApiUrl(endpoint: string): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
  return `${baseUrl}/api/v1/${endpoint}`;
}

// 获取核心洞察数据 - 最简单的实现
// Fetch core insights data - Simplest implementation
export async function fetchCoreInsights(): Promise<{
  data?: CoreInsights;
  error?: string;
}> {
  try {
    // 同时调用两个API获取完整数据
    // Call both APIs simultaneously to get complete data
    const [coreResponse, trendsResponse] = await Promise.all([
      fetch(getApiUrl("core-insights")),
      fetch(getApiUrl("salary-gap-trends")),
    ]);

    // 检查响应是否成功
    if (!coreResponse.ok) {
      return { error: `Core Insights API Failed: ${coreResponse.status}` };
    }
    if (!trendsResponse.ok) {
      return { error: `Trends API Failed: ${trendsResponse.status}` };
    }

    // 解析两个API的响应数据
    const [coreApiResponse, trendsApiResponse] = await Promise.all([
      coreResponse.json(),
      trendsResponse.json(),
    ]);

    // 验证API响应格式
    if (!coreApiResponse.success || !coreApiResponse.data) {
      return { error: "Invalid Core Insights API response format" };
    }
    if (!trendsApiResponse.success || !trendsApiResponse.data) {
      return { error: "Invalid Trends API response format" };
    }

    const coreData = coreApiResponse.data;
    const trendsData = trendsApiResponse.data.trends;

    // 从trends数据中提取2010年和2024年的具体差距
    const year2010Data = trendsData.find((trend: any) => trend.year === 2010);
    const year2024Data = trendsData.find((trend: any) => trend.year === 2024);

    const gapFrom = year2010Data?.gapRatio
      ? `${year2010Data.gapRatio.toFixed(2)}x`
      : "N/A";
    const gapTo = year2024Data?.gapRatio
      ? `${year2024Data.gapRatio.toFixed(2)}x`
      : "N/A";

    // 转换为前端期望的数据格式
    const frontendData = {
      growthChampion: {
        industry: coreData.growthChampion?.industry || "N/A",
        rate: coreData.growthChampion?.growthRate
          ? `${coreData.growthChampion.growthRate.toFixed(1)}%`
          : "N/A",
      },
      growthSlowest: {
        industry: coreData.growthSlowest?.industry || "N/A",
        rate: coreData.growthSlowest?.growthRate
          ? `${coreData.growthSlowest.growthRate.toFixed(1)}%`
          : "N/A",
      },
      salaryGap: {
        from: gapFrom, // 动态获取2010年实际差距
        to: gapTo, // 动态获取2024年实际差距
      },
    };

    return { data: frontendData };
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

    const apiResponse = await response.json();

    // 后端返回格式: {success: true, data: {trends: [...], timeRange: "...", dataPoints: N}}
    if (apiResponse.success && apiResponse.data) {
      const backendData = apiResponse.data;

      // 转换为前端期望的SalaryGapTrends格式
      const frontendData = {
        title: "Salary Gap Evolution",
        data:
          backendData.trends?.map((trend: any) => ({
            year: trend.year,
            gapRatio: trend.gapRatio,
            industries: {}, // 简化版，暂时不提供详细行业数据
          })) || [],
        industries: [], // 简化版，暂时空数组
      };

      return { data: frontendData };
    }

    return { error: "Invalid API response format" };
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

    const apiResponse = await response.json();

    // 后端返回格式: {success: true, data: {rankings: [...], mode: "growth", totalIndustries: N}}
    if (apiResponse.success && apiResponse.data) {
      const backendData = apiResponse.data;

      // 转换为前端期望的GrowthRankings格式
      const frontendData = {
        title: "Industry Growth Rankings",
        rankings:
          backendData.rankings?.map((item: any, index: number) => ({
            rank: index + 1,
            industry: item.industry,
            growthRate: `${item.growthRate?.toFixed(1)}%`,
            startSalary: `€${item.startSalary?.toFixed(1)}k`,
            endSalary: `€${item.endSalary?.toFixed(1)}k`,
            unit: "k€",
          })) || [],
        trendData: [], // 简化版：暂时返回空数组，后续可扩展
      };

      return { data: frontendData };
    }

    return { error: "Invalid API response format" };
  } catch (error) {
    return { error: "Network Failed, please retry." };
  }
}
