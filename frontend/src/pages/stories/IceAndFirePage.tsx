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
import "../../App.css";

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
  const stableOnChartHover = useCallback((data: any) => {
    onChartHover(data);
  }, [onChartHover]);

  const stableOnChartMouseLeave = useCallback(() => {
    onChartMouseLeave();
  }, [onChartMouseLeave]);

  // 📊 缓存的图表组件 - 只依赖于图表数据，不依赖于UI状态
  const memoizedLineChart = useMemo(() => (
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
  ), [gapTrends?.data, stableOnChartHover, stableOnChartMouseLeave]);

  // ✅ 统一loading状态
  const isLoading = coreLoading || trendsLoading || rankingsLoading;

  // ✅ 数据获取和业务逻辑现在都封装在custom hooks中

  // ✅ 简化的错误和加载状态处理
  if (error) {
    return (
      <div className="container">
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
      <div className="container">
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
    <div className="container">
      <nav className="breadcrumb mb-4">
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </nav>

      <header>
        <h1>🔥❄️ Industry Ice and Fire</h1>
        <p>The Great Salary Divide: How Industries Drifted Apart (2010-2024)</p>
      </header>

      <main className="insights-grid">
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
      </main>

      {/* 工资增长趋势表 */}
      <section className="mb-8">
        <div className="insight-card">
          <h2 className="text-xl font-bold mb-4">
            🚀 Industry Growth Trends & Rankings
          </h2>
          {/* 折线图区域：横向占满 */}
          <div className="w-full mb-6">
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
              <div className="h-[400px] flex items-center justify-center text-gray-500">
                Loading chart data...
              </div>
            )}
          </div>

          {/* 选择控制按钮 */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() =>
                setSelectedIndustries(
                  growthRankings?.rankings.map((ranking) => ranking.industry) ||
                    [],
                )
              }
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Select All
            </button>
            <button
              onClick={() => setSelectedIndustries([])}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Select None
            </button>
          </div>

          {/* 下方：冰火双卡片并列显示 */}
          <div className="grid grid-cols-2 gap-6">
            {/* 🔥 增长最快的5个行业 */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-lg border-2 border-red-200">
              <h3 className="font-semibold mb-3 text-red-800">
                🔥 Growth Champions (Fastest 5)
              </h3>
              {growthRankings?.rankings ? (
                <div className="space-y-3">
                  {growthRankings.rankings.slice(0, 5).map((item) => (
                    <div
                      key={item.rank}
                      onClick={() => toggleIndustry(item.industry)}
                      className={`p-3 rounded cursor-pointer transition-colors border-2 ${
                        selectedIndustries.includes(item.industry)
                          ? "bg-orange-100 border-orange-300 text-orange-900" // 选中状态：橙色
                          : "bg-white border-red-200 text-gray-700 hover:bg-red-50" // 未选中：白色 + hover
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-lg">#{item.rank}</span>
                        <span className="text-green-600 font-semibold">
                          {item.growthRate}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm mb-2 leading-tight">
                        {item.industry}
                      </h4>
                      <div className="text-xs opacity-75">
                        <div>
                          {item.startSalary} → {item.endSalary} {item.unit}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">Loading fastest rankings...</div>
              )}
            </div>

            {/* ❄️ 增长最慢的5个行业 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-blue-200">
              <h3 className="font-semibold mb-3 text-blue-800">
                ❄️ Slowest Growth (Bottom 5)
              </h3>
              {growthRankings?.rankings ? (
                <div className="space-y-3">
                  {growthRankings.rankings.slice(5, 10).map((item) => (
                    <div
                      key={item.rank}
                      onClick={() => toggleIndustry(item.industry)}
                      className={`p-3 rounded cursor-pointer transition-colors border-2 ${
                        selectedIndustries.includes(item.industry)
                          ? "bg-blue-100 border-blue-300 text-blue-900" // 选中状态：蓝色
                          : "bg-white border-blue-200 text-gray-700 hover:bg-blue-50" // 未选中：白色 + hover
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-lg">#{item.rank}</span>
                        <span className="text-blue-600 font-semibold">
                          {item.growthRate}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm mb-2 leading-tight">
                        {item.industry}
                      </h4>
                      <div className="text-xs opacity-75">
                        <div>
                          {item.startSalary} → {item.endSalary} {item.unit}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">Loading slowest rankings...</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 薪资差距趋势表 */}
      <section className="mb-8">
        <div className="insight-card">
          <h2 className="text-xl font-bold mb-4">
            📈 Salary Gap Evolution Over Time
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {/* 左侧：折线图 */}
            <div className="col-span-2">
              {gapTrends ? (
                <ResponsiveContainer width="100%" height={300}>
                  {memoizedLineChart}
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  Loading chart data...
                </div>
              )}
            </div>

            {/* 右侧：年份统计显示 */}
            <div className="col-span-1">
              <h3 className="font-semibold mb-3">📊 Year Statistics</h3>
              {hoveredYearStats ? (
                <div className="space-y-4">
                  {/* 年份标题 */}
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-blue-600">
                      {hoveredYearStats.year}
                    </h4>
                    <p className="text-sm text-gray-600">Salary Analysis</p>
                  </div>

                  {/* 最高薪资行业 */}
                  <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center mb-2">
                      <span className="text-green-600 font-semibold text-sm">
                        🏆 HIGHEST
                      </span>
                    </div>
                    <h5 className="font-medium text-sm mb-1 leading-tight">
                      {hoveredYearStats.highest.name}
                    </h5>
                    <p className="text-green-700 font-bold">
                      €{hoveredYearStats.highest.salary.toFixed(1)}k/year
                    </p>
                  </div>

                  {/* 最低薪资行业 */}
                  <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-500">
                    <div className="flex items-center mb-2">
                      <span className="text-orange-600 font-semibold text-sm">
                        📉 LOWEST
                      </span>
                    </div>
                    <h5 className="font-medium text-sm mb-1 leading-tight">
                      {hoveredYearStats.lowest.name}
                    </h5>
                    <p className="text-orange-700 font-bold">
                      €{hoveredYearStats.lowest.salary.toFixed(1)}k/year
                    </p>
                  </div>

                  {/* 差距信息 */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 text-center">
                      Gap:{" "}
                      {(
                        hoveredYearStats.highest.salary /
                        hoveredYearStats.lowest.salary
                      ).toFixed(2)}
                      x
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">📈</div>
                  <p className="text-gray-500 text-sm">
                    Hover over the chart to see
                    <br />
                    year-specific statistics
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer>
        <p>The Ice and Fire Story | Based on CBS Data 2010-2024</p>
      </footer>
    </div>
  );
}

export default IceAndFirePage;
