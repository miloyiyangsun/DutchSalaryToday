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

// Sprint 1 特定类型导出
export type Sprint1CoreInsights = CoreInsights;
