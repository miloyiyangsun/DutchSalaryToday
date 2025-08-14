// InsightCard.tsx
// 可点击的洞察卡片组件 - 支持3种类型的数据展示
import React from 'react';

// 3种卡片类型的数据结构
interface ChampionData {
  industry: string;
  rate: string;
}

interface SlowestData {
  industry: string;
  rate: string;
}

interface GapData {
  from: string;
  to: string;
}

// InsightCard组件属性
interface InsightCardProps {
  type: 'champion' | 'slowest' | 'gap';
  championData?: ChampionData;
  slowestData?: SlowestData;
  gapData?: GapData;
  onClick?: () => void;
  clickable?: boolean;
  variant?: 'home' | 'detail'; // 控制文案版本
}

const InsightCard: React.FC<InsightCardProps> = ({
  type,
  championData,
  slowestData,
  gapData,
  onClick,
  clickable = false,
  variant = 'home'
}) => {
  // 根据类型渲染不同内容
  const renderContent = () => {
    switch (type) {
      case 'champion':
        if (!championData) return null;
        return (
          <>
            <h2>🚀 Growth Champion</h2>
            <h3>{championData.industry}</h3>
            <div className="rate success">{championData.rate}</div>
            <p>{variant === 'detail' ? '2010-2024 Salary Growth Leader' : '2010-2024 Salary Growth'}</p>
          </>
        );
      
      case 'slowest':
        if (!slowestData) return null;
        return (
          <>
            <h2>🐌 Slowest Growth</h2>
            <h3>{slowestData.industry}</h3>
            <div className="rate warning">{slowestData.rate}</div>
            <p>{variant === 'detail' ? '2010-2024 Growth Laggard' : '2010-2024 Salary Growth'}</p>
          </>
        );
      
      case 'gap':
        if (!gapData) return null;
        return (
          <>
            <h2>{variant === 'detail' ? '📊 Salary Gap Evolution' : '📊 Salary Gap'}</h2>
            <div className="gap-comparison">
              <div>
                2010: <span className="gap-value">{gapData.from}</span>
              </div>
              <div className="arrow">→</div>
              <div>
                2024: <span className="gap-value danger">{gapData.to}</span>
              </div>
            </div>
            <p>{variant === 'detail' ? 'Industry Salary Gap Expansion' : 'Inter-industry Gap Change'}</p>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      className={`insight-card ${type} ${clickable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick}
    >
      {renderContent()}
    </div>
  );
};

export default InsightCard;