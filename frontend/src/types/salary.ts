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

// 薪资差距趋势数据类型定义
// 对应 API: /api/v1/salary-gap-trends
export interface SalaryGapTrends {
  title: string;
  data: {
    year: number;
    gapRatio: number;
    industries: Record<string, number>; // 新增：各行业薪资数据 {行业名: 薪资}
  }[];
  industries: string[];
}

// 年份统计数据类型 - 用于hover显示
export interface YearStatistics {
  year: number;
  highest: {
    name: string;
    salary: number;
  };
  lowest: {
    name: string;
    salary: number;
  };
}

// 工资增长排名数据类型定义
// 对应 API: /api/v1/growth-rankings
export interface GrowthRankings {
  title: string;
  rankings: {
    rank: number;
    industry: string;
    growthRate: string;
    startSalary: string;
    endSalary: string;
    unit: string;
  }[];
  trendData: {
    year: number;
    [industry: string]: number;
  }[];
}

// Work Hours Analysis data type definition - Story 2
// API endpoint: /api/v1/work-hours-analysis
export interface WorkHoursAnalysis {
  averageHours: {
    weeklyHours: number;
    annualHours: number;
    description: string;
    unit: string;
  };
  hoursRanking: {
    highest: {
      industry: string;
      weeklyHours: number;
      annualHours: number;
    };
    lowest: {
      industry: string;
      weeklyHours: number;
      annualHours: number;
    };
    gapRatio: number;
    description: string;
    unit: string;
  };
  wageRanking: {
    highest: {
      industry: string;
      hourlyWage: number;
    };
    lowest: {
      industry: string;
      hourlyWage: number;
    };
    gapRatio: number;
    description: string;
    unit: string;
  };
  analysisYear: number;
  totalIndustries: number;
  dataSource: string;
}

// Sprint 1 specific type exports
export type Sprint1CoreInsights = CoreInsights;
