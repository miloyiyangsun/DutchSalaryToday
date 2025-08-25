// NumberCounter.tsx
// 通用数字动画计数器组件 - 可复用的数字计数动画
// Universal Number Animation Counter Component - Reusable count-up animation

import { useEffect, useRef, useState } from "react";
import styles from "./NumberCounter.module.css";

// 数字计数器属性接口 (Number Counter Props Interface)
interface NumberCounterProps {
  targetValue: number;        // 目标数值 (Target value to count to)
  suffix?: string;           // 后缀 (Suffix like %, €, x, pp)
  prefix?: string;           // 前缀 (Prefix like +, -, €)
  duration?: number;         // 动画时长ms (Animation duration in ms)
  decimals?: number;         // 小数位数 (Number of decimal places)
  className?: string;        // 自定义CSS类名 (Custom CSS class name)
  threshold?: number;        // IntersectionObserver阈值 (Intersection threshold)
}

// 数字动画计数器组件 (Number Animation Counter Component)
function NumberCounter({ 
  targetValue, 
  suffix = "", 
  prefix = "", 
  duration = 1500, 
  decimals = 1,
  className = "",
  threshold = 0.3  // 优化从0.1到0.3，减少意外触发
}: NumberCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  // 数字计数动画效果 (Number count-up animation effect)
  useEffect(() => {
    if (!isVisible || targetValue === 0) return;

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOut三次缓动效果 (easeOut cubic easing effect)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = targetValue * easeOut;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [targetValue, duration, isVisible]);

  // IntersectionObserver视口检测触发动画 (Intersection Observer for viewport-triggered animation)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold } // 可配置的触发阈值
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  // 格式化显示数值 (Format display value)
  const formattedValue = decimals > 0 
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toString();

  return (
    <span 
      ref={counterRef}
      className={`${styles.numberCounter} ${isVisible ? styles.numberAnimate : ''} ${className}`}
    >
      {prefix}{formattedValue}{suffix}
    </span>
  );
}

export default NumberCounter;
export type { NumberCounterProps };