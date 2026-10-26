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

  // High resolution points for smooth curve
  for (let h = 0; h <= hoursAhead; h += 0.25) {
    const t = currentTime + h * 3600 * 1000;
    const mg = calculateTotalActive(drinks, t);
    points.push({ h, mg, t });
  }

  const width = 360;
  const height = 95;
  const paddingX = 16;
  const paddingY = 10;
  const innerW = width - paddingX * 2;
  const innerH = height - paddingY - 26; // Leave space at bottom for hour axis

  const getX = (h) => paddingX + (h / hoursAhead) * innerW;
  const getY = (mg) => paddingY + (1 - Math.min(mg, maxMg) / maxMg) * innerH;

  const pathD = points.reduce((acc, pt, idx) => {
    const x = getX(pt.h).toFixed(1);
    const y = getY(pt.mg).toFixed(1);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const sleepLineY = getY(SLEEP_SAFE_THRESHOLD_MG);
  const axisY = paddingY + innerH;

  // Array of hours 0 to 16
  const hours = Array.from({ length: hoursAhead + 1 }, (_, i) => i);

  return (
    <div className="py-4 border-t border-zinc-900">
      <div className="text-xs text-zinc-500 mb-2">
        <span>16-Hour Projection</span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
        {/* 25mg threshold dashed line */}
        {sleepLineY <= axisY && sleepLineY >= paddingY && (
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

        {/* Baseline axis line */}
        <line
          x1={paddingX}
          y1={axisY}
          x2={width - paddingX}
          y2={axisY}
          stroke="#18181b"
          strokeWidth="1"
        />

        {/* Each individual hour tick mark and label */}
        {hours.map((h) => {
          const x = getX(h);
          const isMajor = h % 4 === 0;
          const tickHeight = isMajor ? 5 : 3;

          return (
            <g key={h}>
              {/* Vertical ruler tick */}
              <line
                x1={x}
                y1={axisY}
                x2={x}
                y2={axisY + tickHeight}
                stroke={isMajor ? '#52525b' : '#27272a'}
                strokeWidth={isMajor ? 1.2 : 0.8}
              />

              {/* Hour number label */}
              <text
                x={x}
                y={axisY + 15}
                textAnchor="middle"
                className={`font-mono text-[9px] select-none ${
                  h === 0
                    ? 'fill-amber-400 font-semibold'
                    : isMajor
                    ? 'fill-zinc-400 font-medium'
                    : 'fill-zinc-600'
                }`}
              >
                {h === 0 ? 'Now' : h === 16 ? '16h' : h}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
