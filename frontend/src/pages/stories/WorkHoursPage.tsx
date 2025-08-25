// Work Hours Analysis Page - Story 2 Detail Page
// 工时分析详情页 - 故事2详情页面，完全CSS模块化实现

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../types/routes";
import { useWorkHoursData } from "../../hooks/useWorkHoursData";
import styles from "./WorkHoursPage.module.css";

// 数字动画计数器组件 (Number Animation Counter Component)
interface NumberCounterProps {
  targetValue: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}

function NumberCounter({ 
  targetValue, 
  suffix = "", 
  prefix = "", 
  duration = 1500, 
  decimals = 1 
}: NumberCounterProps) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isVisible || targetValue === 0) return;

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOut缓动效果 (easeOut easing effect)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = targetValue * easeOut;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [targetValue, duration, isVisible]);

  // Intersection Observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formattedValue = decimals > 0 
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toString();

  return (
    <span 
      ref={counterRef}
      className={`${styles.WorkHoursPage_numberCounter} ${isVisible ? styles.WorkHoursPage_numberAnimate : ''}`}
    >
      {prefix}{formattedValue}{suffix}
    </span>
  );
}

// 洞察卡片组件 (Insight Card Component)
interface InsightCardProps {
  icon: string;
  title: string;
  description: React.ReactNode;
  numberValue: number;
  numberPrefix?: string;
  numberSuffix?: string;
  numberColor: string;
  decimals?: number;
}

function InsightCard({
  icon,
  title,
  description,
  numberValue,
  numberPrefix = "",
  numberSuffix = "",
  numberColor,
  decimals = 1
}: InsightCardProps) {
  return (
    <div className={styles.WorkHoursPage_insightCard}>
      <div className={styles.WorkHoursPage_cardIcon}>{icon}</div>
      <div className={`${styles.WorkHoursPage_bigNumber} ${styles[numberColor]}`}>
        <NumberCounter
          targetValue={numberValue}
          prefix={numberPrefix}
          suffix={numberSuffix}
          decimals={decimals}
        />
      </div>
      <h3 className={styles.WorkHoursPage_cardTitle}>{title}</h3>
      <p className={styles.WorkHoursPage_cardDescription}>{description}</p>
    </div>
  );
}

// 主组件 (Main Component)
function WorkHoursPage() {
  const navigate = useNavigate();
  const { data, loading, error } = useWorkHoursData();

  // 数据处理逻辑 (Data Processing Logic)
  const getInsightCardsData = () => {
    if (!data) {
      // 使用参考HTML的默认值作为fallback (Use reference HTML default values as fallback)
      return {
        averageHours: { value: 32.4, description: "hours/week (1686 hours annually)\nNetherlands 2024 Average" },
        longestHours: { value: 57.7, industry: "fishing industry", description: "hours/week in fishing industry\n2x More Than Shortest" },
        topWage: { value: 77.2, industry: "petroleum industry", description: "/hour petroleum industry\n3x Gap vs Lowest Sector" }
      };
    }

    return {
      averageHours: { 
        value: data.averageHours.weeklyHours,
        description: `hours/week (${data.averageHours.annualHours} hours annually)\n${data.averageHours.description || 'Netherlands Average'}`
      },
      longestHours: { 
        value: data.hoursRanking.highest.weeklyHours,
        industry: data.hoursRanking.highest.industry,
        description: `hours/week in ${data.hoursRanking.highest.industry.toLowerCase()}\n${data.hoursRanking.gapRatio.toFixed(1)}x More Than Shortest`
      },
      topWage: { 
        value: data.wageRanking.highest.hourlyWage,
        industry: data.wageRanking.highest.industry,
        description: `/hour ${data.wageRanking.highest.industry.toLowerCase()}\n${data.wageRanking.gapRatio.toFixed(1)}x Gap vs Lowest Sector`
      }
    };
  };

  const insightData = getInsightCardsData();

  return (
    <div className={styles.WorkHoursPage_workHoursContainer}>
      <div className={styles.WorkHoursPage_container}>
        {/* 面包屑导航 (Breadcrumb Navigation) */}
        <nav className={styles.WorkHoursPage_breadcrumb}>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              navigate(ROUTES.HOME);
            }}
            className={styles.WorkHoursPage_breadcrumbLink}
          >
            ← Back to Dashboard
          </a>
        </nav>

        {/* 页面标题 (Page Header) */}
        <header className={styles.WorkHoursPage_pageHeader}>
          <h1 className={styles.WorkHoursPage_mainTitle}>
            🕒 Work Hours Analysis
          </h1>
          <p className={styles.WorkHoursPage_subtitle}>
            Story 2: Dutch Working Hours and Wage Reality (2010-2024)
          </p>
        </header>

        {/* 核心洞察卡片 (Core Insight Cards) */}
        <section className={styles.WorkHoursPage_insightCardsSection}>
          {error ? (
            <div className={styles.WorkHoursPage_errorState}>
              <p>⚠️ Error loading data: {error}</p>
              <p>Showing reference values below.</p>
            </div>
          ) : loading ? (
            <div className={styles.WorkHoursPage_loadingState}>
              <div className={styles.WorkHoursPage_spinner}></div>
              <p>Loading work hours analysis...</p>
            </div>
          ) : null}

          <div className={styles.WorkHoursPage_insightCardsGrid}>
            {/* 平均工时卡片 (Average Work Hours Card) */}
            <InsightCard
              icon="🕒"
              title="Average Work Hours"
              description={
                <>
                  {insightData.averageHours.description.split('\n')[0]}<br/>
                  <span className={styles.WorkHoursPage_cardHighlight}>
                    {insightData.averageHours.description.split('\n')[1]}
                  </span>
                </>
              }
              numberValue={insightData.averageHours.value}
              numberColor="WorkHoursPage_numberBlue"
            />

            {/* 最长工时卡片 (Longest Hours Card) */}
            <InsightCard
              icon="⚠️"
              title="Longest Hours"
              description={
                <>
                  {insightData.longestHours.description.split('\n')[0]}<br/>
                  <span className={styles.WorkHoursPage_cardHighlight}>
                    {insightData.longestHours.description.split('\n')[1]}
                  </span>
                </>
              }
              numberValue={insightData.longestHours.value}
              numberColor="WorkHoursPage_numberYellow"
            />

            {/* 时薪差距卡片 (Top Hourly Wage Card) */}
            <InsightCard
              icon="💰"
              title="Top Hourly Wage"
              description={
                <>
                  {insightData.topWage.description.split('\n')[0]}<br/>
                  <span className={styles.WorkHoursPage_cardHighlight}>
                    {insightData.topWage.description.split('\n')[1]}
                  </span>
                </>
              }
              numberValue={insightData.topWage.value}
              numberPrefix="€"
              numberColor="WorkHoursPage_numberGreen"
            />
          </div>
        </section>

        {/* 开发中通知 (Development Notice) */}
        <section className={styles.WorkHoursPage_developmentNotice}>
          <h2 className={styles.WorkHoursPage_noticeTitle}>
            🚧 Under Development
          </h2>
          <p className={styles.WorkHoursPage_noticeDescription}>
            This detailed analysis page is currently under development.<br/>
            <strong>Three Big Numbers</strong> are available above.
          </p>
          
          <p className={styles.WorkHoursPage_noticeAdditional}>
            For now, explore our <strong>completed Story 1</strong> with full interactive charts.
          </p>

          <div className={styles.WorkHoursPage_buttonGroup}>
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className={styles.WorkHoursPage_btnPrimary}
            >
              ← Back to Homepage
            </button>
            <button
              onClick={() => navigate(ROUTES.ICE_AND_FIRE)}
              className={styles.WorkHoursPage_btnSecondary}
            >
              🔥 Explore Story 1 (Complete)
            </button>
          </div>
        </section>

        {/* 页脚 (Footer) */}
        <footer className={styles.WorkHoursPage_pageFooter}>
          <p>
            Story 2 Data Source: CBS Netherlands Statistics | Work Hours Analysis (2010-2024)
          </p>
        </footer>
      </div>
    </div>
  );
}

export default WorkHoursPage;
