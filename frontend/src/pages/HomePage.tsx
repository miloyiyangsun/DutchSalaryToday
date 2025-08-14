import { useNavigate } from 'react-router-dom';
import { useStoryData } from "../hooks";
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
        <div className="insight-card champion" onClick={() => navigate('/ice-and-fire')}>
          <h2>🚀 Growth Champion</h2>
          <h3>{data.growthChampion.industry}</h3>
          <div className="rate success">{data.growthChampion.rate}</div>
          <p>2010-2024 Salary Growth</p>
        </div>

        {/* 增长最慢 Slowest Growth */}
        <div className="insight-card slowest" onClick={() => navigate('/ice-and-fire')}>
          <h2>🐌 Slowest Growth</h2>
          <h3>{data.growthSlowest.industry}</h3>
          <div className="rate warning">{data.growthSlowest.rate}</div>
          <p>2010-2024 Salary Growth</p>
        </div>

        {/* 薪酬差距 Salary Gap */}
        <div className="insight-card gap" onClick={() => navigate('/ice-and-fire')}>
          <h2>📊 Salary Gap</h2>
          <div className="gap-comparison">
            <div>
              2010: <span className="gap-value">{data.salaryGap.from}</span>
            </div>
            <div className="arrow">→</div>
            <div>
              2024:{" "}
              <span className="gap-value danger">{data.salaryGap.to}</span>
            </div>
          </div>
          <p>Inter-industry Gap Change</p>
        </div>
      </main>

      <footer>
        <p>Based on CBS (Statistics Netherlands) Data | Sprint 1 Demo</p>
      </footer>
    </div>
  );
}

export default HomePage;