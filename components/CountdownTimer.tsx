"use client";

import React, { useState, useEffect } from "react";
import { intervalToDuration } from "date-fns";

interface Props {
  targetDate: string; // ISO String
  onExpire?: () => void;
  className?: string;
  labels?: boolean;
  compact?: boolean; // Simple inline text format for tight spaces
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

  // Compact inline format for tight spaces
  if (compact) {
    const parts: string[] = [];
    if (Number(days) > 0) parts.push(`${days}d`);
    parts.push(`${String(hours || 0).padStart(2, "0")}h`);
    parts.push(`${String(minutes || 0).padStart(2, "0")}m`);
    parts.push(`${String(seconds || 0).padStart(2, "0")}s`);

    return <span className={className}>{parts.join(" ")}</span>;
  }

  const TimeBlock = ({
    value,
    label,
  }: {
    value: number | undefined;
    label: string;
  }) => (
    <div className="flex flex-col items-center">
      <span className="font-mono font-bold text-lg leading-none">
        {String(value || 0).padStart(2, "0")}
      </span>
      {labels && (
        <span className="text-[8px] uppercase tracking-wider text-gray-500">
          {label}
        </span>
      )}
    </div>
  );

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {Number(days) > 0 && (
        <>
          <TimeBlock value={days} label="Days" />
          <span className="font-bold text-gray-300">:</span>
        </>
      )}
      <TimeBlock value={hours} label="Hrs" />
      <span className="font-bold text-gray-300">:</span>
      <TimeBlock value={minutes} label="Mins" />
      <span className="font-bold text-gray-300">:</span>
      <TimeBlock value={seconds} label="Secs" />
    </div>
  );
};

export default CountdownTimer;
