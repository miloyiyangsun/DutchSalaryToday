import { useNavigate } from "react-router-dom";
import {
  useStoryData,
  useWorkHoursData,
  useGenderPowerData,
  useWorkIntensificationData,
  useHiddenCostData,
} from "../hooks";
import InsightCard from "../components/InsightCard";
import FeedbackWidget from "../components/FeedbackWidget";
import { ROUTES } from "../types/routes";
import "../SuperDesign.css";

function HomePage() {
  // 导航功能
  const navigate = useNavigate();

  // ✅ 使用统一的custom hook管理数据
  const { data, loading, error } = useStoryData();
  const {
    data: workHoursData,
    loading: workHoursLoading,
    error: workHoursError,
  } = useWorkHoursData();
  const {
    data: genderPowerData,
    loading: genderPowerLoading,
    error: genderPowerError,
  } = useGenderPowerData();
  const {
    data: workIntensificationData,
    loading: workIntensificationLoading,
    error: workIntensificationError,
  } = useWorkIntensificationData();
  const {
    data: hiddenCostData,
    loading: hiddenCostLoading,
    error: hiddenCostError,
  } = useHiddenCostData();

  // ✅ 统一的错误和加载状态处理
  if (
    error ||
    workHoursError ||
    genderPowerError ||
    workIntensificationError ||
    hiddenCostError
  ) {
    return (
      <div className="container">
        <h1>🇳🇱 Dutch Salary Insights</h1>
        <p>
          ❌{" "}
          {error ||
            workHoursError ||
            genderPowerError ||
            workIntensificationError ||
            hiddenCostError}
        </p>
      </div>
    );
  }

  if (
    loading ||
    workHoursLoading ||
    genderPowerLoading ||
    workIntensificationLoading ||
    hiddenCostLoading ||
    !data ||
    !workHoursData ||
    !genderPowerData ||
    !workIntensificationData ||
    !hiddenCostData
  ) {
    return (
      <div className="container">
        <h1>🇳🇱 Dutch Salary Insights</h1>
        <p>⏳ Loading stories...</p>
      </div>
    );
  }

  // 显示正常数据 - Show normal data with SuperDesign styling
  return (
    <div className="gradient-bg min-h-screen">
      <div className="container mx-auto px-6 py-16 max-w-5xl superdesign-container">
        {/* 页面标题区域 - SuperDesign精确Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl mr-3">🇳🇱</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-title-fix">
              Dutch Salary Insights
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-300 font-medium">
            Data Stories Dashboard - CBS Netherlands (2010-2024)
          </p>
        </header>

        {/* Sprint 1: Industry Ice and Fire */}
        <section
          className="mb-32 card-slide-in"
          style={{ "--delay": "0.2s" } as React.CSSProperties}
        >
          <div className="flex items-center mb-8">
            <div className="sprint-label mr-4">SPRINT 1</div>
            <h2 className="text-2xl md:text-3xl font-bold superdesign-section-title flex items-center">
              <span className="mr-3">🔥</span>
              Industry Ice and Fire
            </h2>
          </div>
          <p className="text-gray-400 mb-12 text-lg">
            Explore salary growth champions and laggards across Dutch industries
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 增长冠军 Growth Champion */}
            <InsightCard
              type="champion"
              championData={data.growthChampion}
              onClick={() => navigate(ROUTES.ICE_AND_FIRE)}
              clickable={true}
            />

            {/* 增长最慢 Slowest Growth */}
            <InsightCard
              type="slowest"
              slowestData={data.growthSlowest}
              onClick={() => navigate(ROUTES.ICE_AND_FIRE)}
              clickable={true}
            />

            {/* 薪酬差距 Salary Gap */}
            <InsightCard
              type="gap"
              gapData={data.salaryGap}
              onClick={() => navigate(ROUTES.ICE_AND_FIRE)}
              clickable={true}
            />
          </div>
        </section>

        {/* Sprint 2: Work Hours Analysis */}
        <section
          className="mb-32 card-slide-in"
          style={{ "--delay": "0.4s" } as React.CSSProperties}
        >
          <div className="flex items-center mb-8">
            <div className="sprint-label mr-4">SPRINT 2</div>
            <h2 className="text-2xl md:text-3xl font-bold superdesign-section-title flex items-center">
              <span className="mr-3">⏰</span>
              Work Hours Analysis
            </h2>
          </div>
          <p className="text-gray-400 mb-12 text-lg">
            Deep dive into working time patterns and hourly wage distributions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 平均工时 Average Hours */}
            <InsightCard
              type="average-hours"
              averageHoursData={{
                weeklyHours: workHoursData.averageHours.weeklyHours,
                annualHours: workHoursData.averageHours.annualHours,
                description: workHoursData.averageHours.description,
              }}
              onClick={() => navigate(ROUTES.WORK_HOURS)}
              clickable={true}
            />

            {/* 工时排名 Hours Ranking */}
            <InsightCard
              type="hours-ranking"
              hoursRankingData={{
                highest: workHoursData.hoursRanking.highest,
                gapRatio: workHoursData.hoursRanking.gapRatio,
              }}
              onClick={() => navigate(ROUTES.WORK_HOURS)}
              clickable={true}
            />

            {/* 时薪排名 Wage Ranking */}
            <InsightCard
              type="wage-ranking"
              wageRankingData={{
                highest: workHoursData.wageRanking.highest,
                gapRatio: workHoursData.wageRanking.gapRatio,
              }}
              onClick={() => navigate(ROUTES.WORK_HOURS)}
              clickable={true}
            />
          </div>
        </section>

        {/* Sprint 3: Gender Power Rise */}
        <section
          className="mb-32 card-slide-in"
          style={{ "--delay": "0.6s" } as React.CSSProperties}
        >
          <div className="flex items-center mb-8">
            <div className="sprint-label mr-4">SPRINT 3</div>
            <h2 className="text-2xl md:text-3xl font-bold superdesign-section-title flex items-center">
              <span className="mr-3">🚺</span>
              Gender Power Rise
            </h2>
          </div>
          <p className="text-gray-400 mb-12 text-lg">
            Analyzing the transformation of gender representation in Dutch
            workforce
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 女性占比历史突破 Historical Breakthrough */}
            <InsightCard
              type="historical-breakthrough"
              historicalBreakthroughData={{
                percentage1995:
                  genderPowerData.historicalBreakthrough.percentage1995,
                percentage2024:
                  genderPowerData.historicalBreakthrough.percentage2024,
                changePoints:
                  genderPowerData.historicalBreakthrough.changePoints,
              }}
              onClick={() => navigate(ROUTES.GENDER_POWER)}
              clickable={true}
            />

            {/* 新增岗位贡献力 New Jobs Contribution */}
            <InsightCard
              type="jobs-contribution"
              jobsContributionData={{
                contributionRate:
                  genderPowerData.newJobsContribution.contributionRate,
                femaleNewJobs:
                  genderPowerData.newJobsContribution.femaleNewJobs,
                totalNewJobs: genderPowerData.newJobsContribution.totalNewJobs,
              }}
              onClick={() => navigate(ROUTES.GENDER_POWER)}
              clickable={true}
            />

            {/* 行业主导地位 Industry Dominance */}
            <InsightCard
              type="industry-dominance"
              industryDominanceData={{
                dominantIndustryCount:
                  genderPowerData.industryDominance.dominantIndustryCount,
                topFemaleIndustry:
                  genderPowerData.industryDominance.topFemaleIndustry,
              }}
              onClick={() => navigate(ROUTES.GENDER_POWER)}
              clickable={true}
            />
          </div>
        </section>

        {/* Sprint 4: Work Intensification Revolution */}
        <section
          className="mb-32 card-slide-in"
          style={{ "--delay": "0.8s" } as React.CSSProperties}
        >
          <div className="flex items-center mb-8">
            <div className="sprint-label mr-4">SPRINT 4</div>
            <h2 className="text-2xl md:text-3xl font-bold superdesign-section-title flex items-center">
              <span className="mr-3">🏭</span>
              Work Intensification Revolution
            </h2>
          </div>
          <p className="text-gray-400 mb-12 text-lg">
            Analyzing non-standard work arrangements and employment patterns
            transformation
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 工作负载分布 Workload Distribution */}
            <InsightCard
              type="workload-distribution"
              workloadDistributionData={{
                parttimeRatio:
                  workIntensificationData.workloadDistribution.parttimeRatio,
                totalFte: workIntensificationData.workloadDistribution.totalFte,
                totalEmployees:
                  workIntensificationData.workloadDistribution.totalEmployees,
              }}
              onClick={() => navigate(ROUTES.WORK_INTENSIFICATION)}
              clickable={true}
            />

            {/* 密集化指数 Intensification Index */}
            <InsightCard
              type="intensification-index"
              intensificationIndexData={{
                intensificationIndex:
                  workIntensificationData.intensificationIndex
                    .intensificationIndex,
                interpretation:
                  workIntensificationData.intensificationIndex.interpretation,
              }}
              onClick={() => navigate(ROUTES.WORK_INTENSIFICATION)}
              clickable={true}
            />

            {/* 行业工作负载排名 Industry Workload Ranking */}
            <InsightCard
              type="industry-workload-ranking"
              industryWorkloadRankingData={{
                heaviestWorkload:
                  workIntensificationData.industryWorkloadRanking
                    .heaviestWorkload,
                totalIndustries:
                  workIntensificationData.industryWorkloadRanking
                    .totalIndustries,
              }}
              onClick={() => navigate(ROUTES.WORK_INTENSIFICATION)}
              clickable={true}
            />
          </div>
        </section>

        {/* Sprint 5: Hidden Labor Costs */}
        <section
          className="mb-32 card-slide-in"
          style={{ "--delay": "1.0s" } as React.CSSProperties}
        >
          <div className="flex items-center mb-8">
            <div className="sprint-label mr-4">SPRINT 5</div>
            <h2 className="text-2xl md:text-3xl font-bold superdesign-section-title flex items-center">
              <span className="mr-3">💰</span>
              Hidden Labor Costs
            </h2>
          </div>
          <p className="text-gray-400 mb-12 text-lg">
            Uncovering the true cost burden of Dutch employment beyond salaries
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 福利负担水平 Benefit Burden Level */}
            <InsightCard
              type="benefit-burden-level"
              benefitBurdenLevelData={{
                benefitRatio: hiddenCostData.benefitBurdenLevel.benefitRatio,
                totalSocialContributions:
                  hiddenCostData.benefitBurdenLevel.totalSocialContributions,
                totalCompensation:
                  hiddenCostData.benefitBurdenLevel.totalCompensation,
                interpretation:
                  hiddenCostData.benefitBurdenLevel.interpretation,
              }}
              onClick={() => navigate(ROUTES.HIDDEN_COSTS)}
              clickable={true}
            />

            {/* 行业差异悬殊 Industry Gap Multiple */}
            <InsightCard
              type="industry-gap-multiple"
              industryGapMultipleData={{
                gapMultiple: hiddenCostData.industryGapMultiple.gapMultiple,
                highestBenefitIndustry:
                  hiddenCostData.industryGapMultiple.highestBenefitIndustry,
                lowestBenefitIndustry:
                  hiddenCostData.industryGapMultiple.lowestBenefitIndustry,
                totalIndustries:
                  hiddenCostData.industryGapMultiple.totalIndustries,
              }}
              onClick={() => navigate(ROUTES.HIDDEN_COSTS)}
              clickable={true}
            />

            {/* 绝对成本增长 Absolute Cost Growth */}
            <InsightCard
              type="absolute-cost-growth"
              absoluteCostGrowthData={{
                startAmount: hiddenCostData.absoluteCostGrowth.startAmount,
                endAmount: hiddenCostData.absoluteCostGrowth.endAmount,
                growthRate: hiddenCostData.absoluteCostGrowth.growthRate,
                startYear: hiddenCostData.absoluteCostGrowth.startYear,
                endYear: hiddenCostData.absoluteCostGrowth.endYear,
              }}
              onClick={() => navigate(ROUTES.HIDDEN_COSTS)}
              clickable={true}
            />
          </div>
        </section>

        {/* Platform Feedback Section */}
        <section
          className="mt-40 card-slide-in"
          style={{ "--delay": "1.2s" } as React.CSSProperties}
        >
          <FeedbackWidget className="feedback-section superdesign" />
        </section>

        {/* 页脚 - Footer */}
        <footer className="mt-32 text-center text-gray-400">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span>📊</span>
            <span>Based on CBS Netherlands Statistics Bureau Data</span>
            <span className="mx-2">•</span>
            <span>5 Data Stories Available</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;
