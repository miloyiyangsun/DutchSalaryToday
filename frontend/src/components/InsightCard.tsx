// InsightCard.tsx
// 可点击的洞察卡片组件 - 支持3种类型的数据展示
import React from 'react';

// 3种卡片类型的数据结构
interface ChampionData {
  industry: string;
  rate: string;
}

interface SlowestData {
  industry: string;
  rate: string;
}

interface GapData {
  from: string;
  to: string;
}

// 故事2: 工时分析数据结构
interface AverageHoursData {
  weeklyHours: number;
  annualHours: number;
  description: string;
}

interface HoursRankingData {
  highest: {
    industry: string;
    weeklyHours: number;
  };
  gapRatio: number;
}

interface WageRankingData {
  highest: {
    industry: string;
    hourlyWage: number;
  };
  gapRatio: number;
}

// 故事3: 性别力量数据结构
interface HistoricalBreakthroughData {
  percentage1995: number;
  percentage2024: number;
  changePoints: number;
}

interface JobsContributionData {
  contributionRate: number;
  femaleNewJobs: number;
  totalNewJobs: number;
}

interface IndustryDominanceData {
  dominantIndustryCount: number;
  topFemaleIndustry: {
    industry: string;
    femalePercentage: number;
  };
}

// 故事4: 工作密集化数据结构
interface WorkloadDistributionData {
  parttimeRatio: number;
  totalFte: number;
  totalEmployees: number;
}

interface IntensificationIndexData {
  intensificationIndex: number;
  interpretation: 'increasing_workload' | 'decreasing_workload';
}

interface IndustryWorkloadRankingData {
  heaviestWorkload: {
    industry: string;
    parttimeRatio: number;
  };
  totalIndustries: number;
}

// 故事5: 隐形人力成本数据结构
interface BenefitBurdenLevelData {
  benefitRatio: number;
  totalSocialContributions: number;
  totalCompensation: number;
  interpretation: string;
}

interface IndustryGapMultipleData {
  gapMultiple: number;
  highestBenefitIndustry: {
    industry: string;
    benefitRatio: number;
  };
  lowestBenefitIndustry: {
    industry: string;
    benefitRatio: number;
  };
  totalIndustries: number;
}

interface AbsoluteCostGrowthData {
  startAmount: number;
  endAmount: number;
  growthRate: number;
  startYear: number;
  endYear: number;
}

// InsightCard组件属性
interface InsightCardProps {
  type: 'champion' | 'slowest' | 'gap' | 'average-hours' | 'hours-ranking' | 'wage-ranking' | 'historical-breakthrough' | 'jobs-contribution' | 'industry-dominance' | 'workload-distribution' | 'intensification-index' | 'industry-workload-ranking' | 'benefit-burden-level' | 'industry-gap-multiple' | 'absolute-cost-growth';
  championData?: ChampionData;
  slowestData?: SlowestData;
  gapData?: GapData;
  // 故事2数据属性
  averageHoursData?: AverageHoursData;
  hoursRankingData?: HoursRankingData;
  wageRankingData?: WageRankingData;
  // 故事3数据属性
  historicalBreakthroughData?: HistoricalBreakthroughData;
  jobsContributionData?: JobsContributionData;
  industryDominanceData?: IndustryDominanceData;
  // 故事4数据属性  
  workloadDistributionData?: WorkloadDistributionData;
  intensificationIndexData?: IntensificationIndexData;
  industryWorkloadRankingData?: IndustryWorkloadRankingData;
  // 故事5数据属性
  benefitBurdenLevelData?: BenefitBurdenLevelData;
  industryGapMultipleData?: IndustryGapMultipleData;
  absoluteCostGrowthData?: AbsoluteCostGrowthData;
  onClick?: () => void;
  clickable?: boolean;
  variant?: 'home' | 'detail'; // 控制文案版本
}

const InsightCard: React.FC<InsightCardProps> = ({
  type,
  championData,
  slowestData,
  gapData,
  averageHoursData,
  hoursRankingData,
  wageRankingData,
  historicalBreakthroughData,
  jobsContributionData,
  industryDominanceData,
  workloadDistributionData,
  intensificationIndexData,
  industryWorkloadRankingData,
  benefitBurdenLevelData,
  industryGapMultipleData,
  absoluteCostGrowthData,
  onClick,
  clickable = false,
  variant = 'home'
}) => {
  // 根据类型渲染不同内容
  const renderContent = () => {
    switch (type) {
      case 'champion':
        if (!championData) return null;
        return (
          <>
            <h2>🚀 Growth Champion</h2>
            <h3>{championData.industry}</h3>
            <div className="rate success">{championData.rate}</div>
            <p>{variant === 'detail' ? '2010-2024 Salary Growth Leader' : '2010-2024 Salary Growth'}</p>
          </>
        );
      
      case 'slowest':
        if (!slowestData) return null;
        return (
          <>
            <h2>🐌 Slowest Growth</h2>
            <h3>{slowestData.industry}</h3>
            <div className="rate warning">{slowestData.rate}</div>
            <p>{variant === 'detail' ? '2010-2024 Growth Laggard' : '2010-2024 Salary Growth'}</p>
          </>
        );
      
      case 'gap':
        if (!gapData) return null;
        return (
          <>
            <h2>{variant === 'detail' ? '📊 Salary Gap Evolution' : '📊 Salary Gap'}</h2>
            <div className="gap-comparison">
              <div>
                2010: <span className="gap-value">{gapData.from}</span>
              </div>
              <div className="arrow">→</div>
              <div>
                2024: <span className="gap-value danger">{gapData.to}</span>
              </div>
            </div>
            <p>{variant === 'detail' ? 'Industry Salary Gap Expansion' : 'Inter-industry Gap Change'}</p>
          </>
        );
      
      // 故事2: 工时分析卡片类型
      case 'average-hours':
        if (!averageHoursData) return null;
        return (
          <>
            <h2>🕒 Average Work Hours</h2>
            <h3>{averageHoursData.annualHours} hours/year</h3>
            <div className="rate info">{averageHoursData.weeklyHours} hours/week</div>
            <p>{variant === 'detail' ? averageHoursData.description : 'Netherlands 2024 Average'}</p>
          </>
        );
      
      case 'hours-ranking':
        if (!hoursRankingData) return null;
        return (
          <>
            <h2>⚠️ Longest Hours</h2>
            <h3>{hoursRankingData.highest.industry}</h3>
            <div className="rate warning">{hoursRankingData.highest.weeklyHours} hours/week</div>
            <p>{hoursRankingData.gapRatio}x vs lowest industry</p>
          </>
        );
      
      case 'wage-ranking':
        if (!wageRankingData) return null;
        return (
          <>
            <h2>💰 Wage Champion</h2>
            <h3>{wageRankingData.highest.industry}</h3>
            <div className="rate success">€{wageRankingData.highest.hourlyWage}/hour</div>
            <p>{wageRankingData.gapRatio}x vs lowest industry</p>
          </>
        );
      
      // 故事3: 性别力量卡片类型 - 大数字居中突出
      case 'historical-breakthrough':
        if (!historicalBreakthroughData) return null;
        return (
          <>
            <h2>🚺 Female Breakthrough</h2>
            <div className="rate success">+{historicalBreakthroughData.changePoints.toFixed(1)} points</div>
            <h3>Historical Growth</h3>
            <p>1995: {historicalBreakthroughData.percentage1995.toFixed(1)}% → 2024: {historicalBreakthroughData.percentage2024.toFixed(1)}%</p>
          </>
        );
      
      case 'jobs-contribution':
        if (!jobsContributionData) return null;
        return (
          <>
            <h2>💼 New Jobs Power</h2>
            <div className="rate info">{jobsContributionData.contributionRate.toFixed(1)}%</div>
            <h3>Female contribution rate</h3>
            <p>{jobsContributionData.femaleNewJobs.toLocaleString()} of {jobsContributionData.totalNewJobs.toLocaleString()} new positions</p>
          </>
        );
      
      case 'industry-dominance':
        if (!industryDominanceData) return null;
        return (
          <>
            <h2>👑 Industry Dominance</h2>
            <div className="rate success">{industryDominanceData.dominantIndustryCount} industries</div>
            <h3>Female majority (&gt;50%)</h3>
            <p>Top: {industryDominanceData.topFemaleIndustry.femalePercentage.toFixed(1)}% in {industryDominanceData.topFemaleIndustry.industry.substring(0, 20)}...</p>
          </>
        );
      
      // 故事4: 工作密集化卡片类型 - 大数字居中突出
      case 'workload-distribution':
        if (!workloadDistributionData) return null;
        return (
          <>
            <h2>⚖️ Work Distribution</h2>
            <div className="rate info">{workloadDistributionData.parttimeRatio.toFixed(1)}%</div>
            <h3>Non-standard arrangements</h3>
            <p>{workloadDistributionData.totalFte.toLocaleString()} FTE / {workloadDistributionData.totalEmployees.toLocaleString()} total employees</p>
          </>
        );
      
      case 'intensification-index':
        if (!intensificationIndexData) return null;
        const isIncreasing = intensificationIndexData.interpretation === 'increasing_workload';
        return (
          <>
            <h2>{isIncreasing ? '📈' : '📉'} Work Trend</h2>
            <div className={`rate ${isIncreasing ? 'warning' : 'success'}`}>
              {intensificationIndexData.intensificationIndex.toFixed(1)}%
            </div>
            <h3>{isIncreasing ? 'More Intensive' : 'More Standard'}</h3>
            <p>{isIncreasing ? 'Work becoming more flexible' : 'More standard employment'} (2010-2024)</p>
          </>
        );
      
      case 'industry-workload-ranking':
        if (!industryWorkloadRankingData) return null;
        return (
          <>
            <h2>🏭 Heaviest Workload</h2>
            <div className="rate danger">{industryWorkloadRankingData.heaviestWorkload.parttimeRatio.toFixed(1)}%</div>
            <h3>Non-standard work extreme</h3>
            <p>{industryWorkloadRankingData.heaviestWorkload.industry.substring(0, 30)}... leads {industryWorkloadRankingData.totalIndustries} industries</p>
          </>
        );
      
      // 故事5: 隐形人力成本卡片类型 - 大数字居中突出
      case 'benefit-burden-level':
        if (!benefitBurdenLevelData) return null;
        return (
          <>
            <h2>🧾 Benefit Burden</h2>
            <div className="rate warning">{benefitBurdenLevelData.benefitRatio.toFixed(1)}%</div>
            <h3>Social contribution level</h3>
            <p>{benefitBurdenLevelData.interpretation.substring(0, 40)}...</p>
          </>
        );
      
      case 'industry-gap-multiple':
        if (!industryGapMultipleData) return null;
        return (
          <>
            <h2>💸 Industry Gap</h2>
            <div className="rate danger">{industryGapMultipleData.gapMultiple.toFixed(1)}x</div>
            <h3>Benefit burden disparity</h3>
            <p>Range: {industryGapMultipleData.lowestBenefitIndustry.benefitRatio.toFixed(1)}% - {industryGapMultipleData.highestBenefitIndustry.benefitRatio.toFixed(1)}% across {industryGapMultipleData.totalIndustries} industries</p>
          </>
        );
      
      case 'absolute-cost-growth':
        if (!absoluteCostGrowthData) return null;
        return (
          <>
            <h2>📈 Cost Growth</h2>
            <div className="rate info">+{absoluteCostGrowthData.growthRate.toFixed(1)}%</div>
            <h3>Absolute increase</h3>
            <p>€{absoluteCostGrowthData.startAmount}B → €{absoluteCostGrowthData.endAmount}B ({absoluteCostGrowthData.startYear}-{absoluteCostGrowthData.endYear})</p>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      className={`insight-card ${type} ${clickable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick}
    >
      {renderContent()}
    </div>
  );
};

export default InsightCard;