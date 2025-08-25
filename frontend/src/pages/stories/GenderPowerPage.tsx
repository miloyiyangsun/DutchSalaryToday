// Gender Power Page - Story 3 Detail Page
// 性别力量详情页 - 故事3详情页面，完全CSS模块化实现

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../types/routes";
import { useGenderPowerData } from "../../hooks/useGenderPowerData";
import styles from "./GenderPowerPage.module.css";

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
      className={`${styles.GenderPowerPage_numberCounter} ${isVisible ? styles.GenderPowerPage_numberAnimate : ""}`}
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
    <div className={styles.GenderPowerPage_insightCard}>
      <div className={styles.GenderPowerPage_cardIcon}>{icon}</div>
      <div
        className={`${styles.GenderPowerPage_bigNumber} ${styles[numberColor]}`}
      >
        <NumberCounter
          targetValue={numberValue}
          prefix={numberPrefix}
          suffix={numberSuffix}
          decimals={decimals}
        />
      </div>
      <h3 className={styles.GenderPowerPage_cardTitle}>{title}</h3>
      <p className={styles.GenderPowerPage_cardDescription}>{description}</p>
    </div>
  );
}

// 主组件 (Main Component)
function GenderPowerPage() {
  const navigate = useNavigate();
  const { data, loading, error } = useGenderPowerData();

  // 页面加载滚动恢复 (Page Load Scroll Restoration)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // 数据处理逻辑 (Data Processing Logic)
  const getInsightCardsData = () => {
    if (!data) {
      // 使用参考数据作为fallback (Use reference data as fallback)
      return {
        historicalBreakthrough: {
          value: 48.6,
          description:
            "Female workforce percentage in 2024\n+7.1 points increase from 41.5% (1995)",
        },
        newJobsContribution: {
          value: 60.1,
          description:
            "of all new jobs secured by women\n2010-2024 job creation dominance",
        },
        industryDominance: {
          value: 17,
          description:
            "industries with female majority\nLeadership across diverse sectors",
        },
      };
    }

    return {
      historicalBreakthrough: {
        value: data.historicalBreakthrough.percentage2024,
        description: `Female workforce percentage in ${data.analysisYears.current}\n+${data.historicalBreakthrough.changePoints} points increase from ${data.historicalBreakthrough.percentage1995}% (1995)`,
      },
      newJobsContribution: {
        value: data.newJobsContribution.contributionRate,
        description: `of all new jobs secured by women\n${data.newJobsContribution.femaleNewJobs}/${data.newJobsContribution.totalNewJobs} new positions (${data.analysisYears.growth})`,
      },
      industryDominance: {
        value: data.industryDominance.dominantIndustryCount,
        description: `industries with female majority\nTop: ${data.industryDominance.topFemaleIndustry.industry} (${data.industryDominance.topFemaleIndustry.femalePercentage}%)`,
      },
    };
  };

  const insightData = getInsightCardsData();

  return (
    <div className={styles.GenderPowerPage_genderPowerContainer}>
      <div className={styles.GenderPowerPage_container}>
        {/* 面包屑导航 (Breadcrumb Navigation) */}
        <nav className={styles.GenderPowerPage_breadcrumb}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(ROUTES.HOME);
            }}
            className={styles.GenderPowerPage_breadcrumbLink}
          >
            ← Back to Dashboard
          </a>
        </nav>

        {/* 页面标题 (Page Header) */}
        <header className={styles.GenderPowerPage_pageHeader}>
          <h1 className={styles.GenderPowerPage_mainTitle}>
            🚺 Gender Power Rise
          </h1>
          <p className={styles.GenderPowerPage_subtitle}>
            Story 3: Female Workforce Breakthrough in Netherlands (1995-2024)
          </p>
        </header>

        {/* 核心洞察卡片 (Core Insight Cards) */}
        <section className={styles.GenderPowerPage_insightCardsSection}>
          {error ? (
            <div className={styles.GenderPowerPage_errorState}>
              <p>⚠️ Error loading data: {error}</p>
              <p>Showing reference values below.</p>
            </div>
          ) : loading ? (
            <div className={styles.GenderPowerPage_loadingState}>
              <div className={styles.GenderPowerPage_spinner}></div>
              <p>Loading gender power analysis...</p>
            </div>
          ) : null}

          <div className={styles.GenderPowerPage_insightCardsGrid}>
            {/* 历史突破卡片 (Historical Breakthrough Card) */}
            <InsightCard
              icon="🚺"
              title="Historical Breakthrough"
              description={
                <>
                  {
                    insightData.historicalBreakthrough.description.split(
                      "\n",
                    )[0]
                  }
                  <br />
                  <span className={styles.GenderPowerPage_cardHighlight}>
                    {
                      insightData.historicalBreakthrough.description.split(
                        "\n",
                      )[1]
                    }
                  </span>
                </>
              }
              numberValue={insightData.historicalBreakthrough.value}
              numberSuffix="%"
              numberColor="GenderPowerPage_numberPink"
            />

            {/* 新岗位贡献卡片 (New Jobs Contribution Card) */}
            <InsightCard
              icon="💼"
              title="New Jobs Power"
              description={
                <>
                  {insightData.newJobsContribution.description.split("\n")[0]}
                  <br />
                  <span className={styles.GenderPowerPage_cardHighlight}>
                    {insightData.newJobsContribution.description.split("\n")[1]}
                  </span>
                </>
              }
              numberValue={insightData.newJobsContribution.value}
              numberSuffix="%"
              numberColor="GenderPowerPage_numberPurple"
            />

            {/* 行业主导卡片 (Industry Dominance Card) */}
            <InsightCard
              icon="👑"
              title="Industry Dominance"
              description={
                <>
                  {insightData.industryDominance.description.split("\n")[0]}
                  <br />
                  <span className={styles.GenderPowerPage_cardHighlight}>
                    {insightData.industryDominance.description.split("\n")[1]}
                  </span>
                </>
              }
              numberValue={insightData.industryDominance.value}
              numberColor="GenderPowerPage_numberRose"
              decimals={0}
            />
          </div>
        </section>

        {/* 开发中通知 (Development Notice) */}
        <section className={styles.GenderPowerPage_developmentNotice}>
          <h2 className={styles.GenderPowerPage_noticeTitle}>
            🚧 Under Development
          </h2>
          <p className={styles.GenderPowerPage_noticeDescription}>
            This detailed analysis page is currently under development.
            <br />
            <strong>Three Big Numbers</strong> are available above.
          </p>

          <p className={styles.GenderPowerPage_noticeAdditional}>
            For now, explore our <strong>completed Story 1</strong> with full
            interactive charts.
          </p>

          <div className={styles.GenderPowerPage_buttonGroup}>
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className={styles.GenderPowerPage_btnPrimary}
            >
              ← Back to Homepage
            </button>
            <button
              onClick={() => navigate(ROUTES.ICE_AND_FIRE)}
              className={styles.GenderPowerPage_btnSecondary}
            >
              🔥 Explore Story 1 (Complete)
            </button>
          </div>
        </section>

        {/* 页脚 (Footer) */}
        <footer className={styles.GenderPowerPage_pageFooter}>
          <p>
            Story 3 Data Source: CBS Netherlands Statistics | Gender Power
            Analysis (1995-2024)
          </p>
        </footer>
      </div>
    </div>
  );
}

export default GenderPowerPage;
