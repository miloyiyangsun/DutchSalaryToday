// IceAndFirePage.tsx - Sprint1: Industry Ice and Fire 完整故事页面
import { Link } from 'react-router-dom';

function IceAndFirePage() {
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

      <main>
        {/* Hero区域 - 3个核心数字重展示 */}
        <section className="story-hero mb-8">
          <div className="insight-card">
            <h2>🚧 Story Under Development...</h2>
            <p>This will show the complete Sprint 1 data story with:</p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Core insights summary (3 key numbers)</li>
              <li>Growth trends visualization</li>
              <li>Salary gap analysis charts</li>
              <li>Detailed data tables</li>
              <li>Story conclusions and insights</li>
            </ul>
          </div>
        </section>

        {/* 未来将添加图表区域 */}
        <section className="charts-section">
          <div className="insight-card">
            <h3>📊 Charts Coming Soon...</h3>
            <p>Growth trends and gap analysis visualizations will be implemented here.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default IceAndFirePage;