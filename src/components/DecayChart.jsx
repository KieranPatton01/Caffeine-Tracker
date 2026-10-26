import React from 'react';
import { HALF_LIFE_HOURS, calculateTotalActive, SLEEP_SAFE_THRESHOLD_MG } from '../utils/caffeine';

export default function DecayChart({ drinks, currentTime }) {
  const currentActive = calculateTotalActive(drinks, currentTime);
  
  if (drinks.length === 0 || currentActive < 1) {
    return null;
  }

  // Generate 17 points for next 16 hours (every 1 hour)
  const hoursAhead = 16;
  const points = [];
  const maxMg = Math.max(currentActive * 1.1, 100);

  for (let h = 0; h <= hoursAhead; h += 0.5) {
    const t = currentTime + h * 3600 * 1000;
    const mg = calculateTotalActive(drinks, t);
    points.push({ h, mg, t });
  }

  // Chart dimensions
  const width = 320;
  const height = 90;
  const paddingX = 16;
  const paddingY = 12;
  const innerW = width - paddingX * 2;
  const innerH = height - paddingY * 2;

  const getX = (h) => paddingX + (h / hoursAhead) * innerW;
  const getY = (mg) => paddingY + (1 - Math.min(mg, maxMg) / maxMg) * innerH;

  const pathD = points.reduce((acc, pt, idx) => {
    const x = getX(pt.h).toFixed(1);
    const y = getY(pt.mg).toFixed(1);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Fill area under curve
  const areaD = `${pathD} L ${getX(hoursAhead).toFixed(1)} ${getY(0).toFixed(1)} L ${getX(0).toFixed(1)} ${getY(0).toFixed(1)} Z`;

  // 25mg threshold line
  const sleepLineY = getY(SLEEP_SAFE_THRESHOLD_MG);

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 mt-4 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          Projected 16h Decay Curve
        </span>
        <span className="text-[11px] text-emerald-400 font-mono">
          -- 25 mg Bedtime Target
        </span>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
          <defs>
            <linearGradient id="decayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.35" />
              <stop offset="70%" stop-color="#f59e0b" stop-opacity="0.05" />
              <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#f59e0b" />
              <stop offset="50%" stop-color="#fbbf24" />
              <stop offset="100%" stop-color="#34d399" />
            </linearGradient>
          </defs>

          {/* Sleep safe threshold dashed line */}
          {sleepLineY <= height - paddingY && sleepLineY >= paddingY && (
            <g>
              <line
                x1={paddingX}
                y1={sleepLineY}
                x2={width - paddingX}
                y2={sleepLineY}
                stroke="#34d399"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                strokeOpacity="0.6"
              />
              <text
                x={width - paddingX}
                y={sleepLineY - 4}
                textAnchor="end"
                className="text-[9px] fill-emerald-400 font-mono font-medium"
              >
                25 mg
              </text>
            </g>
          )}

          {/* Gradient area */}
          <path d={areaD} fill="url(#decayGrad)" />

          {/* Curve stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Now point */}
          <circle
            cx={getX(0)}
            cy={getY(currentActive)}
            r="4.5"
            fill="#fbbf24"
            className="drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]"
          />
        </svg>

        {/* Time markers */}
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
          <span>Now</span>
          <span>+4h</span>
          <span>+8h</span>
          <span>+12h</span>
          <span>+16h</span>
        </div>
      </div>
    </div>
  );
}
