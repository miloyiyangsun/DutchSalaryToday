import { useNavigate } from 'react-router-dom';
import { useStoryData } from "../hooks";
import InsightCard from "../components/InsightCard";
import { ROUTES } from "../types/routes";
import "../App.css";

function HomePage() {
  // 导航功能
  const navigate = useNavigate();
  
  // ✅ 使用统一的custom hook管理数据
  const { data, loading, error } = useStoryData();

  // ✅ 统一的错误和加载状态处理
  if (error) {
    return (
      <div className="container">
        <h1>🇳🇱 Dutch Salary Insights</h1>
        <p>❌ {error}</p>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="container">
        <h1>🇳🇱 Dutch Salary Insights</h1>
        <p>⏳ Loading...</p>
      </div>
    );
  }

  // 显示正常数据
  // Show normal data
  return (
    <div className="container">
      <header>
        <h1>🇳🇱 Dutch Salary Insights</h1>
        <p>Sprint 1: Industry Ice and Fire</p>
      </header>

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

      <footer>
        <p>Based on CBS (Statistics Netherlands) Data | Sprint 1 Demo</p>
      </footer>
    </div>
  );
}

export default HomePage;