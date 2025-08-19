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

// 故事2: 工时分析数据结构
interface AverageHoursData {
  weeklyHours: number;
  annualHours: number;
  description: string;
}

interface HoursRankingData {
  highest: {
    industry: string;
    weeklyHours: number;
  };
  gapRatio: number;
}

interface WageRankingData {
  highest: {
    industry: string;
    hourlyWage: number;
  };
  gapRatio: number;
}

// InsightCard组件属性
interface InsightCardProps {
  type: 'champion' | 'slowest' | 'gap' | 'average-hours' | 'hours-ranking' | 'wage-ranking';
  championData?: ChampionData;
  slowestData?: SlowestData;
  gapData?: GapData;
  // 故事2数据属性
  averageHoursData?: AverageHoursData;
  hoursRankingData?: HoursRankingData;
  wageRankingData?: WageRankingData;
  onClick?: () => void;
  clickable?: boolean;
  variant?: 'home' | 'detail'; // 控制文案版本
}

const InsightCard: React.FC<InsightCardProps> = ({
  type,
  championData,
  slowestData,
  gapData,
  averageHoursData,
  hoursRankingData,
  wageRankingData,
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
      
      // 故事2: 工时分析卡片类型
      case 'average-hours':
        if (!averageHoursData) return null;
        return (
          <>
            <h2>🕒 Average Work Hours</h2>
            <h3>{averageHoursData.annualHours} hours/year</h3>
            <div className="rate info">{averageHoursData.weeklyHours} hours/week</div>
            <p>{variant === 'detail' ? averageHoursData.description : 'Netherlands 2024 Average'}</p>
          </>
        );
      
      case 'hours-ranking':
        if (!hoursRankingData) return null;
        return (
          <>
            <h2>⚠️ Longest Hours</h2>
            <h3>{hoursRankingData.highest.industry}</h3>
            <div className="rate warning">{hoursRankingData.highest.weeklyHours} hours/week</div>
            <p>{hoursRankingData.gapRatio}x vs lowest industry</p>
          </>
        );
      
      case 'wage-ranking':
        if (!wageRankingData) return null;
        return (
          <>
            <h2>💰 Wage Champion</h2>
            <h3>{wageRankingData.highest.industry}</h3>
            <div className="rate success">€{wageRankingData.highest.hourlyWage}/hour</div>
            <p>{wageRankingData.gapRatio}x vs lowest industry</p>
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