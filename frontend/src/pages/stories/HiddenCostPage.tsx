// Hidden Labor Cost Page - Story 5 Detail Page
// 隐形人力成本详情页 - 故事5详情页面，完全CSS模块化实现

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../types/routes";
import { useHiddenCostData } from "../../hooks/useHiddenCostData";
import styles from "./HiddenCostPage.module.css";

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
  decimals = 1,
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
      { threshold: 0.1 },
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formattedValue =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toString();

  return (
    <span
      ref={counterRef}
      className={`${styles.HiddenCostPage_numberCounter} ${isVisible ? styles.HiddenCostPage_numberAnimate : ""}`}
    >
      {prefix}
      {formattedValue}
      {suffix}
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
  decimals = 1,
}: InsightCardProps) {
  return (
    <div className={styles.HiddenCostPage_insightCard}>
      <div className={styles.HiddenCostPage_cardIcon}>{icon}</div>
      <div
        className={`${styles.HiddenCostPage_bigNumber} ${styles[numberColor]}`}
      >
        <NumberCounter
          targetValue={numberValue}
          prefix={numberPrefix}
          suffix={numberSuffix}
          decimals={decimals}
        />
      </div>
      <h3 className={styles.HiddenCostPage_cardTitle}>{title}</h3>
      <p className={styles.HiddenCostPage_cardDescription}>{description}</p>
    </div>
  );
}

// 主组件 (Main Component)
function HiddenCostPage() {
  const navigate = useNavigate();
  const { data, loading, error } = useHiddenCostData();

  // 页面加载滚动恢复 (Page Load Scroll Restoration)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // 数据处理逻辑 (Data Processing Logic)
  const getInsightCardsData = () => {
    if (!data) {
      // 使用默认值作为fallback (Use default values as fallback)
      return {
        benefitBurden: {
          value: 22.8,
          description:
            "% employer social contribution\nNetherlands 2024 Average",
        },
        industryGap: {
          value: 6.6,
          description: "x industry gap multiple\nHighest vs Lowest Sectors",
        },
        costGrowth: {
          value: 85.8,
          description: "% absolute cost growth\n€256B → €476B (2010-2024)",
        },
      };
    }

    return {
      benefitBurden: {
        value: data.benefitBurdenLevel.benefitRatio,
        description: `% employer social contribution\n${data.benefitBurdenLevel.description || "Netherlands Average"}`,
      },
      industryGap: {
        value: data.industryGapMultiple.gapMultiple,
        description: `x industry gap multiple\nHighest vs Lowest Sectors`,
      },
      costGrowth: {
        value: data.absoluteCostGrowth.growthRate,
        description: `% absolute cost growth\n€${(data.absoluteCostGrowth.startAmount / 1000000000).toFixed(0)}B → €${(data.absoluteCostGrowth.endAmount / 1000000000).toFixed(0)}B (${data.absoluteCostGrowth.startYear}-${data.absoluteCostGrowth.endYear})`,
      },
    };
  };

  const insightData = getInsightCardsData();

  return (
    <div className={styles.HiddenCostPage_hiddenCostContainer}>
      <div className={styles.HiddenCostPage_container}>
        {/* 面包屑导航 (Breadcrumb Navigation) */}
        <nav className={styles.HiddenCostPage_breadcrumb}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(ROUTES.HOME);
            }}
            className={styles.HiddenCostPage_breadcrumbLink}
          >
            ← Back to Dashboard
          </a>
        </nav>

        {/* 页面标题 (Page Header) */}
        <header className={styles.HiddenCostPage_pageHeader}>
          <h1 className={styles.HiddenCostPage_mainTitle}>
            💰 Hidden Labor Costs
          </h1>
          <p className={styles.HiddenCostPage_subtitle}>
            Story 5: Dutch Employer Social Contribution Reality (2010-2024)
          </p>
        </header>

        {/* 核心洞察卡片 (Core Insight Cards) */}
        <section className={styles.HiddenCostPage_insightCardsSection}>
          {error ? (
            <div className={styles.HiddenCostPage_errorState}>
              <p>⚠️ Error loading data: {error}</p>
              <p>Showing reference values below.</p>
            </div>
          ) : loading ? (
            <div className={styles.HiddenCostPage_loadingState}>
              <div className={styles.HiddenCostPage_spinner}></div>
              <p>Loading hidden cost analysis...</p>
            </div>
          ) : null}

          <div className={styles.HiddenCostPage_insightCardsGrid}>
            {/* 福利负担水平卡片 (Benefit Burden Level Card) */}
            <InsightCard
              icon="🧾"
              title="Benefit Burden Level"
              description={
                <>
                  {insightData.benefitBurden.description.split("\n")[0]}
                  <br />
                  <span className={styles.HiddenCostPage_cardHighlight}>
                    {insightData.benefitBurden.description.split("\n")[1]}
                  </span>
                </>
              }
              numberValue={insightData.benefitBurden.value}
              numberSuffix="%"
              numberColor="HiddenCostPage_numberOrange"
            />

            {/* 行业差距倍数卡片 (Industry Gap Multiple Card) */}
            <InsightCard
              icon="💸"
              title="Industry Gap"
              description={
                <>
                  {insightData.industryGap.description.split("\n")[0]}
                  <br />
                  <span className={styles.HiddenCostPage_cardHighlight}>
                    {insightData.industryGap.description.split("\n")[1]}
                  </span>
                </>
              }
              numberValue={insightData.industryGap.value}
              numberSuffix="x"
              numberColor="HiddenCostPage_numberPurple"
            />

            {/* 绝对成本增长卡片 (Absolute Cost Growth Card) */}
            <InsightCard
              icon="📈"
              title="Cost Growth"
              description={
                <>
                  {insightData.costGrowth.description.split("\n")[0]}
                  <br />
                  <span className={styles.HiddenCostPage_cardHighlight}>
                    {insightData.costGrowth.description.split("\n")[1]}
                  </span>
                </>
              }
              numberValue={insightData.costGrowth.value}
              numberPrefix="+"
              numberSuffix="%"
              numberColor="HiddenCostPage_numberTeal"
            />
          </div>
        </section>

        {/* 开发中通知 (Development Notice) */}
        <section className={styles.HiddenCostPage_developmentNotice}>
          <h2 className={styles.HiddenCostPage_noticeTitle}>
            🚧 Under Development
          </h2>
          <p className={styles.HiddenCostPage_noticeDescription}>
            This detailed analysis page is currently under development.
            <br />
            <strong>Three Big Numbers</strong> are available above.
          </p>

          <p className={styles.HiddenCostPage_noticeAdditional}>
            For now, explore our <strong>completed Story 1</strong> with full
            interactive charts.
          </p>

          <div className={styles.HiddenCostPage_buttonGroup}>
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className={styles.HiddenCostPage_btnPrimary}
            >
              ← Back to Homepage
            </button>
            <button
              onClick={() => navigate(ROUTES.ICE_AND_FIRE)}
              className={styles.HiddenCostPage_btnSecondary}
            >
              🔥 Explore Story 1 (Complete)
            </button>
          </div>
        </section>

        {/* 页脚 (Footer) */}
        <footer className={styles.HiddenCostPage_pageFooter}>
          <p>
            Story 5 Data Source: CBS Netherlands Statistics | Hidden Labor Cost
            Analysis (2010-2024)
          </p>
        </footer>
      </div>
    </div>
  );
}

export default HiddenCostPage;
