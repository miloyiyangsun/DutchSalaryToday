// 薪酬洞察数据类型定义
// 对应 API: /api/v1/core-insights

export interface CoreInsights {
  growthChampion: {
    industry: string;
    rate: string;
  };
  growthSlowest: {
    industry: string;
    rate: string;
  };
  salaryGap: {
    from: string;
    to: string;
  };
}

// 为未来扩展预留的通用API响应类型
export interface APIResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

// Sprint 1 特定类型导出
export type Sprint1CoreInsights = CoreInsights;