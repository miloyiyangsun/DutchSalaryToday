import { useState, useEffect } from "react";
import type { CoreInsights } from "./types/salary";
import { fetchCoreInsights } from "./services/api";
import "./App.css";

function App() {
  // 简单的状态管理：数据 + 错误信息
  // Simple state management: data + error message
  const [data, setData] = useState<CoreInsights | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 组件加载时获取数据
  // Fetch data when component loads
  useEffect(() => {
    fetchCoreInsights().then((result) => {
      if (result.error) {
        setError(result.error);
      } else {
        setData(result.data!);
      }
    });
  }, []);

  // 如果有错误，显示错误信息
  // If error, show error message
  if (error) {
    return (
      <div className="container">
        <h1>🇳🇱 Dutch Salary Insights</h1>
        <p>❌ {error}</p>
      </div>
    );
  }

  // 如果数据还没加载，显示加载中
  // If data not loaded yet, show loading
  if (!data) {
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
        <div className="insight-card champion">
          <h2>🚀 Growth Champion</h2>
          <h3>{data.growthChampion.industry}</h3>
          <div className="rate success">{data.growthChampion.rate}</div>
          <p>2010-2024 Salary Growth</p>
        </div>

        {/* 增长最慢 Slowest Growth */}
        <div className="insight-card slowest">
          <h2>🐌 Slowest Growth</h2>
          <h3>{data.growthSlowest.industry}</h3>
          <div className="rate warning">{data.growthSlowest.rate}</div>
          <p>2010-2024 Salary Growth</p>
        </div>

        {/* 薪酬差距 Salary Gap */}
        <div className="insight-card gap">
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

export default App;
