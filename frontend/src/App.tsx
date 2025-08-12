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
      from: "2.6倍",
      to: "3.4倍",
    },
  };

  return (
    <div className="container">
      <header>
        <h1>🇳🇱 荷兰薪酬洞察</h1>
        <p>Sprint 1: 行业冰与火之歌</p>
      </header>

      <main className="insights-grid">
        {/* 增长冠军卡片 */}
        <div className="insight-card champion">
          <h2>🚀 增长冠军</h2>
          <h3>{coreData.growthChampion.industry}</h3>
          <div
            className="rate 
  success"
          >
            {coreData.growthChampion.rate}
          </div>
          <p>2010-2024年薪酬增长</p>
        </div>

        {/* 增长最慢卡片 */}
        <div className="insight-card slowest">
          <h2>🐌 增长最慢</h2>
          <h3>{coreData.growthSlowest.industry}</h3>
          <div
            className="rate 
  warning"
          >
            {coreData.growthSlowest.rate}
          </div>
          <p>2010-2024年薪酬增长</p>
        </div>

        {/* 薪酬差距卡片 */}
        <div className="insight-card gap">
          <h2>📊 薪酬差距</h2>
          <div className="gap-comparison">
            <div>
              2010年:{" "}
              <span className="gap-value">{coreData.salaryGap.from}</span>
            </div>
            <div className="arrow">→</div>
            <div>
              2024年:{" "}
              <span
                className="gap-value 
  danger"
              >
                {coreData.salaryGap.to}
              </span>
            </div>
          </div>
          <p>行业间薪酬差距变化</p>
        </div>
      </main>

      <footer>
        <p>基于荷兰统计局(CBS)数据 | Sprint 1 Demo</p>
      </footer>
    </div>
  );
}

export default App;
