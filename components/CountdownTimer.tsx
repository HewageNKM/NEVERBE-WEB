"use client";

import React, { useState, useEffect } from "react";
import { intervalToDuration } from "date-fns";

interface Props {
  targetDate: string; // ISO String
  onExpire?: () => void;
  className?: string;
  labels?: boolean;
  compact?: boolean;
}

const CountdownTimer: React.FC<Props> = ({
  targetDate,
  onExpire,
  className = "",
  labels = true,
  compact = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<Duration | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(targetDate);
      const now = new Date();

      if (now >= end) {
        setIsExpired(true);
        if (onExpire) onExpire();
        return;
      }

      const duration = intervalToDuration({ start: now, end });
      setTimeLeft(duration);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  if (isExpired || !timeLeft) return null;

  const { days, hours, minutes, seconds } = timeLeft;

  // Compact format: Bold and branded for high-urgency spots (e.g., Top Banners)
  if (compact) {
    const parts: string[] = [];
    if (Number(days) > 0) parts.push(`${days}d`);
    parts.push(`${String(hours || 0).padStart(2, "0")}h`);
    parts.push(`${String(minutes || 0).padStart(2, "0")}m`);
    parts.push(`${String(seconds || 0).padStart(2, "0")}s`);

    return (
      <span
        className={`font-display font-black italic text-accent tracking-tighter ${className}`}
      >
        {parts.join(" ")}
      </span>
    );
  }

  const TimeBlock = ({
    value,
    label,
  }: {
    value: number | undefined;
    label: string;
  }) => (
    <div className="flex flex-col items-center min-w-[32px]">
      {/* Numbers using Brand Display font for a premium look */}
      <span className="font-display font-black text-xl md:text-2xl leading-none text-primary italic tracking-tighter">
        {String(value || 0).padStart(2, "0")}
      </span>
      {labels && (
        <span className="text-[9px] uppercase font-bold tracking-[0.15em] text-muted mt-1">
          {label}
        </span>
      )}
    </div>
  );

  return (
    <div
      className={`flex items-center gap-2 md:gap-3 animate-fade ${className}`}
    >
      {Number(days) > 0 && (
        <>
          <TimeBlock value={days} label="Days" />
          <span className="font-black text-lg md:text-xl text-accent pb-4">
            :
          </span>
        </>
      )}
      <TimeBlock value={hours} label="Hrs" />
      <span className="font-black text-lg md:text-xl text-accent pb-4">:</span>
      <TimeBlock value={minutes} label="Mins" />
      <span className="font-black text-lg md:text-xl text-accent pb-4">:</span>
      <TimeBlock value={seconds} label="Secs" />
    </div>
  );
};

export default CountdownTimer;
