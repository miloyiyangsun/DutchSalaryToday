// 薪酬洞察数据 API 服务层 - 简化版
// Salary Insights Data API Service Layer - Simplified Version

import type {
  CoreInsights,
  SalaryGapTrends,
  GrowthRankings,
  WorkHoursAnalysis,
} from "../types/salary";

// 统一API URL构建函数 - 动态环境检测
// Unified API URL builder - dynamic environment detection
function getApiUrl(endpoint: string): string {
  // 优先使用环境变量配置
  if (import.meta.env.VITE_API_BASE_URL) {
    return `${import.meta.env.VITE_API_BASE_URL}/api/v1/${endpoint}`;
  }
  
  // 动态检测运行环境
  const hostname = window.location.hostname;
  
  // Azure生产环境自动检测
  if (hostname.includes('azurewebsites.net')) {
    const baseUrl = 'https://backend-webapp-16283450340.azurewebsites.net';
    return `${baseUrl}/api/v1/${endpoint}`;
  }
  
  // 本地开发环境
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const baseUrl = 'http://localhost:8080';
    return `${baseUrl}/api/v1/${endpoint}`;
  }
  
  // 默认fallback
  return `http://localhost:8080/api/v1/${endpoint}`;
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
          backendData.trends?.map((trend: any) => {
            // 构建行业薪资映射：从后端的maxIndustry/minIndustry + maxSalary/minSalary
            const industries: Record<string, number> = {};
            
            // 添加最高薪资行业
            if (trend.maxIndustry && typeof trend.maxSalary === 'number') {
              industries[trend.maxIndustry] = trend.maxSalary;
            }
            
            // 添加最低薪资行业（确保不重复）
            if (trend.minIndustry && typeof trend.minSalary === 'number') {
              industries[trend.minIndustry] = trend.minSalary;
            }
            
            return {
              year: trend.year,
              gapRatio: trend.gapRatio,
              industries, // 真实的行业薪资数据：{行业名: 薪资值}
            };
          }) || [],
        industries: [], // 保留空数组，实际数据在data中的industries字段
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

    // 后端返回格式: {success: true, data: {title, rankings: [...], trendData: [...], mode: "growth"}}
    if (apiResponse.success && apiResponse.data) {
      const backendData = apiResponse.data;

      // 转换为前端期望的GrowthRankings格式
      const frontendData = {
        title: "Industry Growth Rankings",
        rankings:
          backendData.rankings?.map((item: any) => ({
            rank: item.rank, // 直接使用后端提供的排名
            industry: item.industry,
            growthRate: `${item.growthRate?.toFixed(1)}%`,
            startSalary: `€${item.startSalary?.toFixed(1)}k`,
            endSalary: `€${item.endSalary?.toFixed(1)}k`,
            unit: item.unit || "k€",
          })) || [],
        trendData: backendData.trendData || [], // 使用后端返回的真实趋势数据
      };

      return { data: frontendData };
    }

    return { error: "Invalid API response format" };
  } catch (error) {
    return { error: "Network Failed, please retry." };
  }
}

// 获取工时分析数据 - Story 2
// Fetch work hours analysis data - Story 2
export async function fetchWorkHoursAnalysis(): Promise<{
  data?: WorkHoursAnalysis;
  error?: string;
}> {
  try {
    const response = await fetch(getApiUrl("work-hours-analysis"));

    if (!response.ok) {
      return { error: `Loading Failed: ${response.status}` };
    }

    const apiResponse = await response.json();

    // 后端返回格式: {success: true, data: {...}}
    if (apiResponse.success && apiResponse.data) {
      return { data: apiResponse.data };
    }

    return { error: "Invalid API response format" };
  } catch (error) {
    return { error: "Network Failed, please retry." };
  }
}
