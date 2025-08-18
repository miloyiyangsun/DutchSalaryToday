// IceAndFirePage.tsx - Sprint1: Industry Ice and Fire 完整故事页面
import { Link } from "react-router-dom";
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

// 基于排名的配色规则 - 前端职责，按rank 1-5分配颜色
const RANK_COLORS = [
  "#8884d8", // rank 1
  "#8dd1e1", // rank 2
  "#82ca9d", // rank 3
  "#ff7300", // rank 4
  "#ffc658", // rank 5
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

  // 基于API数据获取行业颜色的函数 - 完全数据驱动
  const getIndustryColor = (industryName: string): string => {
    const ranking = growthRankings?.rankings?.find(
      (r) => r.industry === industryName,
    );
    return ranking ? RANK_COLORS[ranking.rank - 1] : "#cccccc"; // 默认颜色作为fallback
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：动态折线图 */}
            <div className="lg:col-span-2">
              {growthRankings?.trendData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={growthRankings.trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
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
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  Loading chart data...
                </div>
              )}
            </div>

            {/* 右侧：可点击的增长冠军排名选择器 */}
            <div className="lg:col-span-1">
              <h3 className="font-semibold mb-3">
                🏆 Growth Champions (Click to Select)
              </h3>
              {growthRankings?.rankings ? (
                <div className="space-y-3">
                  {growthRankings.rankings.slice(0, 5).map((item) => (
                    <div
                      key={item.rank}
                      onClick={() => toggleIndustry(item.industry)}
                      className={`p-3 rounded cursor-pointer transition-colors border-2 ${
                        selectedIndustries.includes(item.industry)
                          ? "bg-blue-100 border-blue-300 text-blue-900" // 选中状态：蓝色
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100" // 未选中：灰色 + hover
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
                <div className="text-gray-500">Loading rankings...</div>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：折线图 */}
            <div className="lg:col-span-2">
              {gapTrends ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={gapTrends.data}
                    onMouseMove={onChartHover}
                    onMouseLeave={onChartMouseLeave}
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
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  Loading chart data...
                </div>
              )}
            </div>

            {/* 右侧：年份统计显示 */}
            <div className="lg:col-span-1">
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
                      €{hoveredYearStats.highest.salary.toLocaleString()}
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
                      €{hoveredYearStats.lowest.salary.toLocaleString()}
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
