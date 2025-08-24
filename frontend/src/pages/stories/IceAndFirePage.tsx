// IceAndFirePage.tsx - Sprint1: Industry Ice and Fire 完整故事页面
import { Link } from "react-router-dom";
import { useMemo, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useStoryData, useGapTrends, useGrowthRankings } from "../../hooks";
import InsightCard from "../../components/InsightCard";
import "../../SuperDesign.css";

// 🔥 暖色系：增长最快的5个行业 (rank 1-5)
const WARM_COLORS = [
  "#FF6B35", // 热橙红 - rank 1 最快
  "#F7931E", // 暖橙色 - rank 2
  "#FFD23F", // 金黄色 - rank 3
  "#FF8E53", // 暖橙色 - rank 4
  "#FFA726", // 亮橙色 - rank 5
];

// ❄️ 冷色系：增长最慢的5个行业 (rank 6-10)
const COOL_COLORS = [
  "#4FC3F7", // 天蓝色 - rank 6 开始慢
  "#26C6DA", // 青蓝色 - rank 7
  "#66BB6A", // 薄荷绿 - rank 8
  "#42A5F5", // 深蓝色 - rank 9
  "#7E57C2", // 紫色    - rank 10 最慢
];

function IceAndFirePage() {
  // ✅ 使用Custom Hooks管理数据和状态
  const { data, loading: coreLoading, error } = useStoryData();
  const {
    gapTrends,
    hoveredYearStats,
    loading: trendsLoading,
    onChartHover,
    onChartMouseLeave,
  } = useGapTrends();
  const {
    growthRankings,
    selectedIndustries,
    setSelectedIndustries,
    loading: rankingsLoading,
  } = useGrowthRankings();

  // 基于API数据获取行业颜色的函数 - 冰火双色系
  const getIndustryColor = (industryName: string): string => {
    const ranking = growthRankings?.rankings?.find(
      (r) => r.industry === industryName,
    );

    if (!ranking) return "#CCCCCC"; // 默认灰色

    // rank 1-5: 使用暖色系 (增长最快)
    if (ranking.rank <= 5) {
      return WARM_COLORS[ranking.rank - 1];
    }
    // rank 6-10: 使用冷色系 (增长最慢)
    else {
      return COOL_COLORS[ranking.rank - 6]; // rank 6 → index 0
    }
  };

  // 切换行业选择状态
  const toggleIndustry = (industryKey: string) => {
    setSelectedIndustries(
      (prev) =>
        prev.includes(industryKey)
          ? prev.filter((key) => key !== industryKey) // 取消选择
          : [...prev, industryKey], // 添加选择
    );
  };

  // 🔧 稳定的事件处理器引用 - 防止图表重新渲染
  const stableOnChartHover = useCallback(
    (data: unknown) => {
      onChartHover(data);
    },
    [onChartHover],
  );

  const stableOnChartMouseLeave = useCallback(() => {
    onChartMouseLeave();
  }, [onChartMouseLeave]);

  // 📊 缓存的图表组件 - 只依赖于图表数据，不依赖于UI状态
  const memoizedLineChart = useMemo(
    () => (
      <LineChart
        data={gapTrends?.data || []}
        onMouseMove={stableOnChartHover}
        onMouseLeave={stableOnChartMouseLeave}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="gapRatio"
          stroke="#8884d8"
          strokeWidth={2}
          name="Gap Ratio"
        />
      </LineChart>
    ),
    [gapTrends?.data, stableOnChartHover, stableOnChartMouseLeave],
  );

  // ✅ 统一loading状态
  const isLoading = coreLoading || trendsLoading || rankingsLoading;

  // ✅ 数据获取和业务逻辑现在都封装在custom hooks中

  // ✅ 简化的错误和加载状态处理
  if (error) {
    return (
      <div className="ice-fire-container">
        <nav className="breadcrumb mb-4">
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </nav>
        <h1>🔥❄️ Industry Ice and Fire</h1>
        <p>❌ {error}</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="ice-fire-container">
        <nav className="breadcrumb mb-4">
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </nav>
        <h1>🔥❄️ Industry Ice and Fire</h1>
        <p>⏳ Loading story data...</p>
      </div>
    );
  }

  // 显示正常数据 - 现在TypeScript知道data不为null
  // Show normal data - now TypeScript knows data is not null
  return (
    <div className="ice-fire-page">
      <div className="ice-fire-container">
        {/* 页面标题区域 */}
        <header className="page-header">
          {/* 面包屑导航 */}
          <nav className="breadcrumb">
            <Link to="/" className="text-lg">
              ← Back to Dashboard
            </Link>
          </nav>

          {/* 主标题 */}
          <h1 className="main-title">
            <span style={{ marginRight: "0.5rem" }}>🔥</span>
            Industry Ice and Fire
            <span style={{ marginLeft: "0.5rem" }}>❄️</span>
          </h1>
          <p className="subtitle">
            The Great Salary Divide: How Industries Drifted Apart (2010-2024)
          </p>
        </header>

        {/* 核心洞察卡片区域 */}
        <section className="section-spacing">
          <div className="insight-card-grid">
            {/* 增长冠军 Growth Champion */}
            <InsightCard
              type="champion"
              championData={data.growthChampion}
              variant="detail"
            />

            {/* 增长最慢 Slowest Growth */}
            <InsightCard
              type="slowest"
              slowestData={data.growthSlowest}
              variant="detail"
            />

            {/* 薪酬差距 Salary Gap */}
            <InsightCard type="gap" gapData={data.salaryGap} variant="detail" />
          </div>
        </section>

        {/* 交互式图表区域 */}
        <section className="fire-ice-section section-spacing">
          <h2 className="chart-title">🚀 Industry Growth Trends & Rankings</h2>

          {/* 图表容器 */}
          <div className="chart-wrapper">
            {growthRankings?.trendData ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={growthRankings.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[25, 100]} />
                  <Tooltip
                    wrapperStyle={{ zIndex: 9999 }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        // 对数据按薪资降序排序
                        const sortedPayload = [...payload].sort(
                          (a, b) => b.value - a.value,
                        );

                        return (
                          <div
                            style={{
                              backgroundColor: "rgba(0, 0, 0, 0.8)",
                              border: "none",
                              borderRadius: "6px",
                              color: "white",
                              padding: "10px",
                              zIndex: 9999,
                            }}
                          >
                            <p
                              style={{
                                color: "white",
                                margin: "0 0 5px 0",
                                fontWeight: "bold",
                              }}
                            >
                              {label}
                            </p>
                            {sortedPayload.map((entry, index) => (
                              <p
                                key={index}
                                style={{
                                  color: entry.color,
                                  margin: "2px 0",
                                  fontSize: "14px",
                                }}
                              >
                                {`${entry.name} : ${entry.value} k€/y`}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  {selectedIndustries.map((industryKey) => {
                    return (
                      <Line
                        key={industryKey}
                        type="monotone"
                        dataKey={industryKey}
                        stroke={getIndustryColor(industryKey)}
                        name={industryKey} // 直接使用完整的行业名称
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-loading">Loading chart data...</div>
            )}
          </div>

          {/* 控制按钮 */}
          <div className="control-buttons">
            <button
              onClick={() =>
                setSelectedIndustries(
                  growthRankings?.rankings.map((ranking) => ranking.industry) ||
                    [],
                )
              }
              className="control-button"
            >
              Select All Industries
            </button>
            <button
              onClick={() => setSelectedIndustries([])}
              className="control-button secondary"
            >
              Clear Selection
            </button>
            <button
              onClick={() =>
                setSelectedIndustries(
                  growthRankings?.rankings.slice(0, 5).map((r) => r.industry) ||
                    [],
                )
              }
              className="control-button"
            >
              Show Top 5
            </button>
            <button
              onClick={() =>
                setSelectedIndustries(
                  growthRankings?.rankings
                    .slice(5, 10)
                    .map((r) => r.industry) || [],
                )
              }
              className="control-button"
            >
              Show Bottom 5
            </button>
          </div>
        </section>

        {/* 🔥❄️ 冰火双列表展示区域 */}
        <section className="section-spacing">
          <div className="fire-ice-grid">
            {/* 🔥 Fire Zone - Growth Champions */}
            <div className="fire-zone fire-pulse">
              <h3 className="fire-zone-title">
                <span>🔥</span>
                <span>Growth Champions (Top 5)</span>
              </h3>
              <div className="industry-list">
                {growthRankings?.rankings ? (
                  growthRankings.rankings.slice(0, 5).map((item) => (
                    <div
                      key={item.rank}
                      onClick={() => toggleIndustry(item.industry)}
                      className={`industry-card ${
                        selectedIndustries.includes(item.industry)
                          ? "selected-fire"
                          : ""
                      }`}
                    >
                      <div className="industry-rank">#{item.rank}</div>
                      <div className="industry-name">{item.industry}</div>
                      <div className="industry-rate number-fire">
                        {item.growthRate}
                      </div>
                      <div className="industry-details">
                        {item.startSalary} → {item.endSalary} {item.unit}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">
                    Loading fastest rankings...
                  </div>
                )}
              </div>
            </div>

            {/* ❄️ Ice Zone - Slowest Growth */}
            <div className="ice-zone ice-pulse">
              <h3 className="ice-zone-title">
                <span>❄️</span>
                <span>Slowest Growth (Bottom 5)</span>
              </h3>
              <div className="industry-list">
                {growthRankings?.rankings ? (
                  growthRankings.rankings.slice(5, 10).map((item) => (
                    <div
                      key={item.rank}
                      onClick={() => toggleIndustry(item.industry)}
                      className={`industry-card ${
                        selectedIndustries.includes(item.industry)
                          ? "selected-ice"
                          : ""
                      }`}
                    >
                      <div className="industry-rank">#{item.rank}</div>
                      <div className="industry-name">{item.industry}</div>
                      <div className="industry-rate number-ice">
                        {item.growthRate}
                      </div>
                      <div className="industry-details">
                        {item.startSalary} → {item.endSalary} {item.unit}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">
                    Loading slowest rankings...
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 薪资差距演变分析区域 */}
        <section className="gap-evolution-section section-spacing">
          <h2 className="chart-title">📈 Salary Gap Evolution Over Time</h2>

          <div className="trend-analysis-grid">
            {/* 左侧图表区域 */}
            <div className="chart-container">
              {gapTrends ? (
                <ResponsiveContainer width="100%" height={300}>
                  {memoizedLineChart}
                </ResponsiveContainer>
              ) : (
                <div className="chart-loading">Loading chart data...</div>
              )}
            </div>

            {/* 右侧统计面板 */}
            <div className="stats-panel">
              <h3 className="stats-panel-title">📊 Year Statistics</h3>
              {hoveredYearStats ? (
                <div className="stats-content">
                  {/* 年份标题 */}
                  <div className="year-header">
                    <h4 className="year-title">{hoveredYearStats.year}</h4>
                    <p className="year-subtitle">Salary Analysis</p>
                  </div>

                  {/* 最高薪资行业 */}
                  <div className="stat-item highest">
                    <div className="stat-label">
                      <span className="label-highest">🏆 HIGHEST</span>
                    </div>
                    <h5 className="industry-name">
                      {hoveredYearStats.highest.name.substring(0, 30)}
                      {hoveredYearStats.highest.name.length > 30 ? "..." : ""}
                    </h5>
                    <p className="salary-value highest">
                      €{hoveredYearStats.highest.salary.toFixed(1)}k/year
                    </p>
                  </div>

                  {/* 最低薪资行业 */}
                  <div className="stat-item lowest">
                    <div className="stat-label">
                      <span className="label-lowest">📉 LOWEST</span>
                    </div>
                    <h5 className="industry-name">
                      {hoveredYearStats.lowest.name.substring(0, 30)}
                      {hoveredYearStats.lowest.name.length > 30 ? "..." : ""}
                    </h5>
                    <p className="salary-value lowest">
                      €{hoveredYearStats.lowest.salary.toFixed(1)}k/year
                    </p>
                  </div>

                  {/* 差距信息 */}
                  <div className="gap-ratio-info">
                    <p className="gap-ratio-text">
                      Gap Ratio:{" "}
                      <span className="gap-ratio-value">
                        {(
                          hoveredYearStats.highest.salary /
                          hoveredYearStats.lowest.salary
                        ).toFixed(2)}
                        x
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="stats-placeholder">
                  <div className="placeholder-icon">📈</div>
                  <p className="placeholder-text">
                    Hover over the chart to see
                    <br />
                    year-specific statistics
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 页脚 */}
        <footer className="page-footer">
          <div className="footer-content">
            <span>🔥❄️</span>
            <span>The Ice and Fire Story - Dutch Salary Insights</span>
            <span className="footer-separator">•</span>
            <span>
              Based on CBS Netherlands Statistics Bureau Data (2010-2024)
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default IceAndFirePage;
