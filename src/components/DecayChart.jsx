import React from 'react';
import { calculateTotalActive, SLEEP_SAFE_THRESHOLD_MG } from '../utils/caffeine';

export default function DecayChart({ drinks, currentTime }) {
  const currentActive = calculateTotalActive(drinks, currentTime);
  
  if (drinks.length === 0 || currentActive < 5) {
    return null;
  }

  const hoursAhead = 16;
  const points = [];
  const maxMg = Math.max(currentActive * 1.05, 80);

  for (let h = 0; h <= hoursAhead; h += 0.5) {
    const t = currentTime + h * 3600 * 1000;
    const mg = calculateTotalActive(drinks, t);
    points.push({ h, mg, t });
  }

  const width = 360;
  const height = 80;
  const paddingX = 4;
  const paddingY = 8;
  const innerW = width - paddingX * 2;
  const innerH = height - paddingY * 2;

  const getX = (h) => paddingX + (h / hoursAhead) * innerW;
  const getY = (mg) => paddingY + (1 - Math.min(mg, maxMg) / maxMg) * innerH;

  const pathD = points.reduce((acc, pt, idx) => {
    const x = getX(pt.h).toFixed(1);
    const y = getY(pt.mg).toFixed(1);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const sleepLineY = getY(SLEEP_SAFE_THRESHOLD_MG);

  return (
    <div className="py-4 border-t border-zinc-900">
      <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
        <span>16-Hour Projection</span>
        <span className="font-mono text-[11px] text-zinc-600">25 mg sleep limit</span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20 overflow-visible">
        {/* 25mg threshold dashed line */}
        {sleepLineY <= height - paddingY && sleepLineY >= paddingY && (
          <line
            x1={paddingX}
            y1={sleepLineY}
            x2={width - paddingX}
            y2={sleepLineY}
            stroke="#27272a"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        )}

        {/* Decay curve */}
        <path
          d={pathD}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Current position */}
        <circle
          cx={getX(0)}
          cy={getY(currentActive)}
          r="3"
          fill="#f59e0b"
        />
      </svg>

      <div className="flex justify-between text-[10px] text-zinc-600 font-mono mt-1">
        <span>Now</span>
        <span>+4h</span>
        <span>+8h</span>
        <span>+12h</span>
        <span>+16h</span>
      </div>
    </div>
  );
}
