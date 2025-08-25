// Work Intensification Page - Story 4 Detail Page
// 工作密集化详情页 - 故事4详情页面，完全CSS模块化实现

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../types/routes";
import { useWorkIntensificationData } from "../../hooks/useWorkIntensificationData";
import styles from "./WorkIntensificationPage.module.css";

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
      className={`${styles.WorkIntensificationPage_numberCounter} ${isVisible ? styles.WorkIntensificationPage_numberAnimate : ""}`}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}

// 洞察卡片现在直接在JSX中实现，支持完整的无障碍特性 (Insight Cards now implemented directly in JSX with full accessibility support)

// 主组件 (Main Component)
function WorkIntensificationPage() {
  const navigate = useNavigate();
  const { data, loading, error } = useWorkIntensificationData();

  // 页面加载滚动恢复 (Page Load Scroll Restoration)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // 数据处理逻辑 (Data Processing Logic)
  const getInsightCardsData = () => {
    if (!data) {
      // 使用默认值作为fallback (Use default values as fallback)
      return {
        workDistribution: {
          value: 23.5,
          description:
            "non-standard work arrangements\nNetherlands 2024 Analysis",
        },
        intensificationTrend: {
          value: 1.1,
          description:
            "percentage points work intensification\n2010-2024 Trend Analysis",
        },
        industryAnalysis: {
          value: 98,
          description:
            "industries analyzed for workload\nComprehensive Coverage 2024",
        },
      };
    }

    return {
      workDistribution: {
        value: data.workloadDistribution.parttimeRatio,
        description: `non-standard work arrangements\n${data.workloadDistribution.description || "Netherlands Analysis"}`,
      },
      intensificationTrend: {
        value: data.intensificationIndex.intensificationIndex,
        description: `${data.intensificationIndex.unit || "percentage points"} work intensification\n${data.analysisYears || "2010-2024"} Trend`,
      },
      industryAnalysis: {
        value: data.industryWorkloadRanking.totalIndustries,
        description: `industries analyzed for workload\nComprehensive Coverage ${data.industryWorkloadRanking.analysisYear || "2024"}`,
      },
    };
  };

  const insightData = getInsightCardsData();

  return (
    <div
      className={styles.WorkIntensificationPage_workIntensificationContainer}
    >
      <div className={styles.WorkIntensificationPage_container}>
        {/* 面包屑导航 (Breadcrumb Navigation) */}
        <nav
          className={styles.WorkIntensificationPage_breadcrumb}
          aria-label="页面导航路径"
          role="navigation"
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(ROUTES.HOME);
            }}
            className={styles.WorkIntensificationPage_breadcrumbLink}
            aria-label="返回首页仪表板"
          >
            ← Back to Dashboard
          </a>
        </nav>

        {/* 页面标题 (Page Header) */}
        <header
          className={styles.WorkIntensificationPage_pageHeader}
          role="banner"
        >
          <h1
            className={styles.WorkIntensificationPage_mainTitle}
            id="main-heading"
          >
            🏭 Work Intensification Revolution
          </h1>
          <p
            className={styles.WorkIntensificationPage_subtitle}
            aria-describedby="main-heading"
          >
            Story 4: Dutch Work Arrangements & Intensification Trends
            (2010-2024)
          </p>
        </header>

        {/* 核心洞察卡片 (Core Insight Cards) */}
        <section
          className={styles.WorkIntensificationPage_insightCardsSection}
          aria-labelledby="insights-heading"
          role="region"
        >
          <h2 id="insights-heading" className="sr-only">
            工作密集化核心洞察数据
          </h2>
          {error ? (
            <div
              className={styles.WorkIntensificationPage_errorState}
              role="alert"
              aria-live="polite"
            >
              <p>⚠️ Error loading data: {error}</p>
              <p>Showing reference values below.</p>
            </div>
          ) : loading ? (
            <div
              className={styles.WorkIntensificationPage_loadingState}
              role="status"
              aria-live="polite"
              aria-label="正在加载工作密集化分析数据"
            >
              <div className={styles.WorkIntensificationPage_spinner}></div>
              <p>Loading work intensification analysis...</p>
            </div>
          ) : null}

          <div
            className={styles.WorkIntensificationPage_insightCardsGrid}
            role="group"
            aria-label="工作密集化数据洞察卡片组"
          >
            {/* 工作分配卡片 (Work Distribution Card) */}
            <div
              className={styles.WorkIntensificationPage_insightCard}
              role="article"
              aria-labelledby="work-distribution-title"
              tabIndex={0}
            >
              <div
                className={styles.WorkIntensificationPage_cardIcon}
                aria-hidden="true"
              >
                ⚖️
              </div>
              <div
                className={`${styles.WorkIntensificationPage_bigNumber} ${styles.WorkIntensificationPage_numberPurple}`}
              >
                <NumberCounter
                  targetValue={insightData.workDistribution.value}
                  suffix="%"
                  decimals={1}
                />
              </div>
              <h3
                id="work-distribution-title"
                className={styles.WorkIntensificationPage_cardTitle}
              >
                Work Distribution
              </h3>
              <p className={styles.WorkIntensificationPage_cardDescription}>
                {insightData.workDistribution.description.split("\n")[0]}
                <br />
                <span className={styles.WorkIntensificationPage_cardHighlight}>
                  {insightData.workDistribution.description.split("\n")[1]}
                </span>
              </p>
            </div>

            {/* 强化指数卡片 (Intensification Index Card) */}
            <div
              className={styles.WorkIntensificationPage_insightCard}
              role="article"
              aria-labelledby="intensification-index-title"
              tabIndex={0}
            >
              <div
                className={styles.WorkIntensificationPage_cardIcon}
                aria-hidden="true"
              >
                📈
              </div>
              <div
                className={`${styles.WorkIntensificationPage_bigNumber} ${styles.WorkIntensificationPage_numberYellow}`}
              >
                <NumberCounter
                  targetValue={insightData.intensificationTrend.value}
                  prefix="+"
                  suffix="pp"
                  decimals={1}
                />
              </div>
              <h3
                id="intensification-index-title"
                className={styles.WorkIntensificationPage_cardTitle}
              >
                Intensification Index
              </h3>
              <p className={styles.WorkIntensificationPage_cardDescription}>
                {insightData.intensificationTrend.description.split("\n")[0]}
                <br />
                <span className={styles.WorkIntensificationPage_cardHighlight}>
                  {insightData.intensificationTrend.description.split("\n")[1]}
                </span>
              </p>
            </div>

            {/* 行业分析卡片 (Industry Analysis Card) */}
            <div
              className={styles.WorkIntensificationPage_insightCard}
              role="article"
              aria-labelledby="industry-coverage-title"
              tabIndex={0}
            >
              <div
                className={styles.WorkIntensificationPage_cardIcon}
                aria-hidden="true"
              >
                🏭
              </div>
              <div
                className={`${styles.WorkIntensificationPage_bigNumber} ${styles.WorkIntensificationPage_numberBlue}`}
              >
                <NumberCounter
                  targetValue={insightData.industryAnalysis.value}
                  decimals={0}
                />
              </div>
              <h3
                id="industry-coverage-title"
                className={styles.WorkIntensificationPage_cardTitle}
              >
                Industry Coverage
              </h3>
              <p className={styles.WorkIntensificationPage_cardDescription}>
                {insightData.industryAnalysis.description.split("\n")[0]}
                <br />
                <span className={styles.WorkIntensificationPage_cardHighlight}>
                  {insightData.industryAnalysis.description.split("\n")[1]}
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* 开发中通知 (Development Notice) */}
        <section
          className={styles.WorkIntensificationPage_developmentNotice}
          aria-labelledby="development-notice-title"
          role="complementary"
        >
          <h2
            id="development-notice-title"
            className={styles.WorkIntensificationPage_noticeTitle}
          >
            🚧 Under Development
          </h2>
          <p className={styles.WorkIntensificationPage_noticeDescription}>
            This detailed analysis page is currently under development.
            <br />
            <strong>Three Big Numbers</strong> are available above.
          </p>

          <p className={styles.WorkIntensificationPage_noticeAdditional}>
            For now, explore our <strong>completed Story 1</strong> with full
            interactive charts.
          </p>

          <div
            className={styles.WorkIntensificationPage_buttonGroup}
            role="group"
            aria-label="页面导航操作"
          >
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className={styles.WorkIntensificationPage_btnPrimary}
              aria-label="返回首页仪表板"
              type="button"
            >
              ← Back to Homepage
            </button>
            <button
              onClick={() => navigate(ROUTES.ICE_AND_FIRE)}
              className={styles.WorkIntensificationPage_btnSecondary}
              aria-label="探索已完成的故事1：行业冰火分析"
              type="button"
            >
              🔥 Explore Story 1 (Complete)
            </button>
          </div>
        </section>

        {/* 页脚 (Footer) */}
        <footer
          className={styles.WorkIntensificationPage_pageFooter}
          role="contentinfo"
        >
          <p>
            <span aria-label="数据来源信息">
              Story 4 Data Source: CBS Netherlands Statistics | Work
              Intensification Analysis (2010-2024)
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default WorkIntensificationPage;
