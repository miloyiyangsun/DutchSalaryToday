import { useNavigate } from 'react-router-dom';
import { useStoryData, useWorkHoursData } from "../hooks";
import InsightCard from "../components/InsightCard";
import { ROUTES } from "../types/routes";
import "../App.css";

function HomePage() {
  // 导航功能
  const navigate = useNavigate();
  
  // ✅ 使用统一的custom hook管理数据
  const { data, loading, error } = useStoryData();
  const { data: workHoursData, loading: workHoursLoading, error: workHoursError } = useWorkHoursData();

  // ✅ 统一的错误和加载状态处理
  if (error || workHoursError) {
    return (
      <div className="container">
        <h1>🇳🇱 Dutch Salary Insights</h1>
        <p>❌ {error || workHoursError}</p>
      </div>
    );
  }

  if (loading || workHoursLoading || !data || !workHoursData) {
    return (
      <div className="container">
        <h1>🇳🇱 Dutch Salary Insights</h1>
        <p>⏳ Loading stories...</p>
      </div>
    );
  }

  // 显示正常数据
  // Show normal data
  return (
    <div className="container">
      <header>
        <h1>🇳🇱 Dutch Salary Insights</h1>
        <p>Data Stories Dashboard - CBS Netherlands</p>
      </header>

      {/* Sprint 1: Industry Ice and Fire */}
      <section>
        <h2 style={{ marginBottom: '1rem', color: '#374151' }}>🔥 Sprint 1: Industry Ice and Fire</h2>
        <main className="insights-grid">
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
        </main>
      </section>

      {/* Sprint 2: Work Hours Analysis */}
      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#374151' }}>🕒 Sprint 2: Work Hours Analysis</h2>
        <main className="insights-grid">
          {/* 平均工时 Average Hours */}
          <InsightCard
            type="average-hours"
            averageHoursData={{
              weeklyHours: workHoursData.averageHours.weeklyHours,
              annualHours: workHoursData.averageHours.annualHours,
              description: workHoursData.averageHours.description
            }}
            onClick={() => navigate(ROUTES.WORK_HOURS)}
            clickable={true}
          />

          {/* 工时排名 Hours Ranking */}
          <InsightCard
            type="hours-ranking"
            hoursRankingData={{
              highest: workHoursData.hoursRanking.highest,
              gapRatio: workHoursData.hoursRanking.gapRatio
            }}
            onClick={() => navigate(ROUTES.WORK_HOURS)}
            clickable={true}
          />

          {/* 时薪排名 Wage Ranking */}
          <InsightCard
            type="wage-ranking"
            wageRankingData={{
              highest: workHoursData.wageRanking.highest,
              gapRatio: workHoursData.wageRanking.gapRatio
            }}
            onClick={() => navigate(ROUTES.WORK_HOURS)}
            clickable={true}
          />
        </main>
      </section>

      <footer>
        <p>Based on CBS (Statistics Netherlands) Data | 2 Stories Available</p>
      </footer>
    </div>
  );
}

export default HomePage;