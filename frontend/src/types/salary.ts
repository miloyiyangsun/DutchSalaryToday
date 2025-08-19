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

// Gender Power Analysis data type definition - Story 3
// API endpoint: /api/v1/gender-power-insights
export interface GenderPowerInsights {
  historicalBreakthrough: {
    percentage1995: number;
    percentage2024: number;
    changePoints: number;
    description: string;
    trend: 'increasing' | 'decreasing';
  };
  newJobsContribution: {
    contributionRate: number;
    femaleNewJobs: number;
    totalNewJobs: number;
    description: string;
    unit: string;
  };
  industryDominance: {
    dominantIndustryCount: number;
    totalIndustries: number;
    topFemaleIndustry: {
      industry: string;
      femalePercentage: number;
      femaleCount: number;
      totalCount: number;
    };
    description: string;
    analysisYear: number;
  };
  analysisYears: {
    historical: string;
    growth: string;
    current: number;
  };
  totalIndustries2024: number;
  dataSource: string;
}

// Work Intensification Analysis data type definition - Story 4  
// API endpoint: /api/v1/work-intensification
export interface WorkIntensificationInsights {
  workloadDistribution: {
    parttimeRatio: number;
    totalFte: number;
    totalEmployees: number;
    analysisYear: number;
    description: string;
    unit: string;
  };
  intensificationIndex: {
    intensificationIndex: number;
    fteGrowthRate: number;
    employeeGrowthRate: number;
    interpretation: 'increasing_workload' | 'decreasing_workload';
    description: string;
    unit: string;
  };
  industryWorkloadRanking: {
    heaviestWorkload: {
      industry: string;
      parttimeRatio: number;
      fteCount: number;
      totalEmployees: number;
    };
    lightestWorkload: {
      industry: string;
      parttimeRatio: number;
      fteCount: number;
      totalEmployees: number;
    };
    totalIndustries: number;
    analysisYear: number;
    description: string;
    unit: string;
  };
  totalIndustries2024: number;
  analysisYears: string;
  dataSource: string;
}

// Hidden Labor Cost Analysis data type definition - Story 5  
// API endpoint: /api/v1/hidden-costs-insights
export interface HiddenCostInsights {
  benefitBurdenLevel: {
    benefitRatio: number;
    totalSocialContributions: number;
    totalCompensation: number;
    description: string;
    unit: string;
    interpretation: string;
  };
  industryGapMultiple: {
    gapMultiple: number;
    highestBenefitIndustry: {
      industry: string;
      benefitRatio: number;
      socialContributions: number;
      totalCompensation: number;
    };
    lowestBenefitIndustry: {
      industry: string;
      benefitRatio: number;
      socialContributions: number;
      totalCompensation: number;
    };
    totalIndustries: number;
    description: string;
    unit: string;
  };
  absoluteCostGrowth: {
    startAmount: number;
    endAmount: number;
    growthRate: number;
    absoluteGrowth: number;
    startYear: number;
    endYear: number;
    description: string;
    unit: string;
  };
  analysisYear: number;
  comparisonBaseYear: number;
  totalIndustriesAnalyzed: number;
  dataComplete: boolean;
}

// Sprint 1 specific type exports
export type Sprint1CoreInsights = CoreInsights;
