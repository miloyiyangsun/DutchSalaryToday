import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import type { CoreInsights } from "./types/salary";
import "./App.css";

function App() {
  // 使用硬编码数据，与Mock API保持一致
  const coreData: CoreInsights = {
    growthChampion: {
      industry: "Information and communication",
      rate: "164.5%",
    },
    growthSlowest: {
      industry: "Agriculture, forestry and fishing",
      rate: "20.8%",
    },
    salaryGap: {
      from: "2.6x",
      to: "3.4x",
    },
  };

  return (
    <div className="container">
      <header>
        <h1>🇳🇱 Dutch Salary Insight</h1>
        <p>Sprint 1: Industry Ice and Fire</p>
      </header>

      <main className="insights-grid">
        {/* 增长冠军卡片 */}
        <div className="insight-card champion">
          <h2>🚀 Growth Champion</h2>
          <h3>{coreData.growthChampion.industry}</h3>
          <div className="rate success">{coreData.growthChampion.rate}</div>
          <p>2010-2024 Salary Growth</p>
        </div>

        {/* 增长最慢卡片 */}
        <div className="insight-card slowest">
          <h2>🐌 Growth Slowest</h2>
          <h3>{coreData.growthSlowest.industry}</h3>
          <div className="rate warning">{coreData.growthSlowest.rate}</div>
          <p>2010-2024 Salary Growth</p>
        </div>

        {/* 薪酬差距卡片 */}
        <div className="insight-card gap">
          <h2>📊 Salary Gap</h2>
          <div className="gap-comparison">
            <div>
              2010: <span className="gap-value">{coreData.salaryGap.from}</span>
            </div>
            <div className="arrow">→</div>
            <div>
              2024:{" "}
              <span className="gap-value danger">{coreData.salaryGap.to}</span>
            </div>
          </div>
          <p>Industry Salary Gap Change</p>
        </div>
      </main>

      <footer>
        <p>Based on Dutch Statistics Bureau (CBS) data | Sprint 1 Demo</p>
      </footer>
    </div>
  );
}

export default App;
