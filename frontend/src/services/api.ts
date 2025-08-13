// 薪酬洞察数据 API 服务层 - 简化版
// Salary Insights Data API Service Layer - Simplified Version

import type { CoreInsights } from "../types/salary";

// 获取核心洞察数据 - 最简单的实现
// Fetch core insights data - Simplest implementation
export async function fetchCoreInsights(): Promise<{
  data?: CoreInsights;
  error?: string;
}> {
  try {
    // 直接调用Mock API
    // Direct call to Mock API
    const response = await fetch("http://localhost:3001/api/v1/core-insights");

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
