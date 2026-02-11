'use client';

import { useEffect, useState } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  className?: string;
  suffix?: string;
  delay?: number;
  decimals?: number;
}

export function CountUp({
  end,
  duration = 2000,
  className = '',
  suffix = '',
  delay = 0,
  decimals = 0,
}: CountUpProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;
    let animationFrameId: number | undefined;
    let delayTimerId: number | undefined;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // 使用 easeOutExpo 緩動函數
      const easeOutExpo = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
      const currentCount = easeOutExpo * (end - startValue) + startValue;

      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    delayTimerId = window.setTimeout(
      () => {
        animationFrameId = requestAnimationFrame(animate);
      },
      Math.max(0, delay * 1000),
    );

    return () => {
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
      }
      if (delayTimerId !== undefined) {
        clearTimeout(delayTimerId);
      }
    };
  }, [end, duration, delay]);

  const displayValue = Number.isFinite(count) ? count.toFixed(decimals) : '0';

  return (
    <span className={className}>
      {displayValue}
      {suffix}
    </span>
  );
}
