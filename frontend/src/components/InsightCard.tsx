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
            <div className="text-4xl mb-3">🚀</div>
            <div className="big-number-responsive text-green-400 mb-2 number-animate">{championData.rate}</div>
            <h3 className="text-xl font-bold text-white mb-2">Growth Champion</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {championData.industry}<br/>
              <span className="text-gray-400 small-annotation">{variant === 'detail' ? '2010-2024 Salary Growth Leader' : '2010-2024 Growth'}</span>
            </p>
          </>
        );
      
      case 'slowest':
        if (!slowestData) return null;
        return (
          <>
            <div className="text-4xl mb-3">🐌</div>
            <div className="big-number-responsive text-yellow-400 mb-2 number-animate">{slowestData.rate}</div>
            <h3 className="text-xl font-bold text-white mb-2">Slowest Growth</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {slowestData.industry}<br/>
              <span className="text-gray-400 small-annotation">{variant === 'detail' ? '2010-2024 Growth Laggard' : '2010-2024 Growth'}</span>
            </p>
          </>
        );
      
      case 'gap':
        if (!gapData) return null;
        return (
          <>
            <div className="text-4xl mb-3">📊</div>
            <div className="flex justify-center items-center gap-2 mb-1">
              <div className="medium-number-responsive text-blue-400 number-animate">{gapData.from}</div>
              <div className="text-2xl text-orange-400 mx-1">→</div>
              <div className="big-number-responsive long-text text-pink-400 number-animate">{gapData.to}</div>
            </div>
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="small-annotation text-gray-400">2010</div>
              <div className="small-annotation text-gray-400">2024</div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Salary Gap</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {variant === 'detail' ? 'Industry Salary Gap Evolution' : 'Inter-industry Gap Change'}<br/>
              <span className="text-gray-400 text-xs">Improvement in salary equality</span>
            </p>
          </>
        );
      
      // 故事2: 工时分析卡片类型
      case 'average-hours':
        if (!averageHoursData) return null;
        return (
          <>
            <div className="text-4xl mb-3">🕒</div>
            <div className="big-number-responsive text-blue-400 mb-1 number-animate">{averageHoursData.weeklyHours}</div>
            <div className="small-annotation text-gray-400 mb-3">hours/week</div>
            <h3 className="text-xl font-bold text-white mb-2">Average Work Hours</h3>
            <p className="text-gray-300 text-sm">{variant === 'detail' ? averageHoursData.description : 'Netherlands 2024 Average'}</p>
          </>
        );
      
      case 'hours-ranking':
        if (!hoursRankingData) return null;
        return (
          <>
            <div className="text-4xl mb-3">⚠️</div>
            <div className="big-number-responsive text-yellow-400 mb-1 number-animate">{hoursRankingData.highest.weeklyHours}</div>
            <div className="small-annotation text-gray-400 mb-3">hours/week</div>
            <h3 className="text-xl font-bold text-white mb-2">Longest Hours</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {hoursRankingData.highest.industry}<br/>
              <span className="text-gray-400 small-annotation">{hoursRankingData.gapRatio}x vs lowest industry</span>
            </p>
          </>
        );
      
      case 'wage-ranking':
        if (!wageRankingData) return null;
        return (
          <>
            <div className="text-4xl mb-3">💰</div>
            <div className="big-number-responsive text-green-400 mb-2 number-animate">€{wageRankingData.highest.hourlyWage}/h</div>
            <h3 className="text-xl font-bold text-white mb-2">Wage Champion</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {wageRankingData.highest.industry}<br/>
              <span className="text-gray-400 small-annotation">{wageRankingData.gapRatio}x vs lowest industry</span>
            </p>
          </>
        );
      
      // 故事3: 性别力量卡片类型 - 大数字居中突出
      case 'historical-breakthrough':
        if (!historicalBreakthroughData) return null;
        return (
          <>
            <div className="text-4xl mb-3">🚺</div>
            <div className="big-number-responsive long-text text-pink-400 mb-2 number-animate">+{historicalBreakthroughData.changePoints.toFixed(1)} points</div>
            <h3 className="text-xl font-bold text-white mb-2">Female Breakthrough</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Historical Growth<br/>
              <span className="text-gray-400">1995: {historicalBreakthroughData.percentage1995.toFixed(1)}% → 2024: {historicalBreakthroughData.percentage2024.toFixed(1)}%</span>
            </p>
          </>
        );
      
      case 'jobs-contribution':
        if (!jobsContributionData) return null;
        return (
          <>
            <div className="text-4xl mb-3">💼</div>
            <div className="big-number-responsive text-blue-400 mb-2 number-animate">{jobsContributionData.contributionRate.toFixed(1)}%</div>
            <h3 className="text-xl font-bold text-white mb-2">New Jobs Power</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Female contribution rate
            </p>
            <div className="text-gray-400 mt-2 font-medium">
              {jobsContributionData.femaleNewJobs.toLocaleString()} of {jobsContributionData.totalNewJobs.toLocaleString()} new positions
            </div>
          </>
        );
      
      case 'industry-dominance':
        if (!industryDominanceData) return null;
        return (
          <>
            <div className="text-4xl mb-3">👑</div>
            <div className="big-number-responsive long-text text-purple-400 mb-2 number-animate">{industryDominanceData.dominantIndustryCount} industries</div>
            <h3 className="text-xl font-bold text-white mb-2">Industry Dominance</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Female majority (&gt;50%)<br/>
              <span className="text-gray-400">Top: {industryDominanceData.topFemaleIndustry.femalePercentage.toFixed(1)}% in {industryDominanceData.topFemaleIndustry.industry.substring(0, 20)}...</span>
            </p>
          </>
        );
      
      // 故事4: 工作密集化卡片类型 - 大数字居中突出
      case 'workload-distribution':
        if (!workloadDistributionData) return null;
        return (
          <>
            <div className="text-4xl mb-3">⚖️</div>
            <div className="big-number-responsive text-indigo-400 mb-2 number-animate">{workloadDistributionData.parttimeRatio.toFixed(1)}%</div>
            <h3 className="text-xl font-bold text-white mb-2">Work Distribution</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Non-standard arrangements<br/>
              <span className="text-gray-400 text-xs">{workloadDistributionData.totalFte.toLocaleString()} FTE / {workloadDistributionData.totalEmployees.toLocaleString()} total employees</span>
            </p>
          </>
        );
      
      case 'intensification-index': {
        if (!intensificationIndexData) return null;
        const isIncreasing = intensificationIndexData.interpretation === 'increasing_workload';
        return (
          <>
            <div className="text-4xl mb-3">{isIncreasing ? '📈' : '📉'}</div>
            <div className={`big-number-responsive mb-2 number-animate ${isIncreasing ? 'text-yellow-400' : 'text-cyan-400'}`}>
              {intensificationIndexData.intensificationIndex.toFixed(1)}%
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Work Trend</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {isIncreasing ? 'More Intensive' : 'More Standard'}<br/>
              <span className="text-gray-400 text-xs">{isIncreasing ? 'Work becoming more flexible' : 'More standard employment'} (2010-2024)</span>
            </p>
          </>
        );
      }
      
      case 'industry-workload-ranking':
        if (!industryWorkloadRankingData) return null;
        return (
          <>
            <div className="text-4xl mb-3">🏭</div>
            <div className="big-number-responsive text-yellow-400 mb-2 number-animate">{industryWorkloadRankingData.heaviestWorkload.parttimeRatio.toFixed(1)}%</div>
            <h3 className="text-xl font-bold text-white mb-2">Heaviest Workload</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Non-standard work extreme<br/>
              <span className="text-gray-400 text-xs">{industryWorkloadRankingData.heaviestWorkload.industry.substring(0, 30)}... leads {industryWorkloadRankingData.totalIndustries} industries</span>
            </p>
          </>
        );
      
      // 故事5: 隐形人力成本卡片类型 - 大数字居中突出
      case 'benefit-burden-level':
        if (!benefitBurdenLevelData) return null;
        return (
          <>
            <div className="text-4xl mb-3">🧾</div>
            <div className="big-number-responsive text-yellow-400 mb-2 number-animate">{benefitBurdenLevelData.benefitRatio.toFixed(1)}%</div>
            <h3 className="text-xl font-bold text-white mb-2">Benefit Burden</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Social contribution level<br/>
              <span className="text-gray-400 text-xs">For every €100 salary, employers pay €23...</span>
            </p>
          </>
        );
      
      case 'industry-gap-multiple':
        if (!industryGapMultipleData) return null;
        return (
          <>
            <div className="text-4xl mb-3">💸</div>
            <div className="big-number-responsive text-red-400 mb-2 number-animate">{industryGapMultipleData.gapMultiple.toFixed(1)}x</div>
            <h3 className="text-xl font-bold text-white mb-2">Industry Gap</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Benefit burden disparity<br/>
              <span className="text-gray-400 text-xs">Range: {industryGapMultipleData.lowestBenefitIndustry.benefitRatio.toFixed(1)}% - {industryGapMultipleData.highestBenefitIndustry.benefitRatio.toFixed(1)}% across {industryGapMultipleData.totalIndustries} industries</span>
            </p>
          </>
        );
      
      case 'absolute-cost-growth':
        if (!absoluteCostGrowthData) return null;
        return (
          <>
            <div className="text-4xl mb-3">📈</div>
            <div className="big-number-responsive text-orange-400 mb-2 number-animate">+{absoluteCostGrowthData.growthRate.toFixed(1)}%</div>
            <h3 className="text-xl font-bold text-white mb-2">Cost Growth</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Absolute increase<br/>
              <span className="text-gray-400 text-xs">€{absoluteCostGrowthData.startAmount}B → €{absoluteCostGrowthData.endAmount}B ({absoluteCostGrowthData.startYear}-{absoluteCostGrowthData.endYear})</span>
            </p>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      className={`story-card-hover dutch-gradient-card rounded-2xl border-2 border-gray-600 ${clickable ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="text-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default InsightCard;