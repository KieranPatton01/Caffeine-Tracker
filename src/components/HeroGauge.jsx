import React from 'react';
import { 
  getAlertnessStatus, 
  calculateClearanceTimestamp, 
  formatClockTime, 
  formatRelativeDuration,
  get24HourIntake,
  getDecayRate,
  DAILY_MAX_MG,
  SLEEP_SAFE_THRESHOLD_MG,
  FULL_CLEARANCE_THRESHOLD_MG
} from '../utils/caffeine';

export default function HeroGauge({ drinks, currentTime, activeCaffeine }) {
  const status = getAlertnessStatus(activeCaffeine);
  const decayRate = getDecayRate(activeCaffeine);

  const sleepClearance = calculateClearanceTimestamp(drinks, SLEEP_SAFE_THRESHOLD_MG, currentTime);
  const fullClearance = calculateClearanceTimestamp(drinks, FULL_CLEARANCE_THRESHOLD_MG, currentTime);

  const intake24h = Math.round(get24HourIntake(drinks, currentTime));
  const intakePercent = Math.min(100, Math.round((intake24h / DAILY_MAX_MG) * 100));

  // Split integer and single decimal for crisp typography
  const intPart = Math.floor(activeCaffeine);
  const decPart = (activeCaffeine % 1).toFixed(1).slice(1); // e.g. ".2"

  return (
    <div className="py-6">
      {/* Status indicator and elimination speed */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status.dotClass}`} />
          <span className="text-xs font-medium tracking-wide uppercase text-zinc-400">
            {status.label}
          </span>
        </div>

        {activeCaffeine > 5 && (
          <span className="text-[11px] font-mono text-zinc-500">
            -{decayRate.hourly.toFixed(1)} mg/h
          </span>
        )}
      </div>

      {/* Main active caffeine stat with decimal precision */}
      <div className="flex items-baseline gap-0.5">
        <span className="text-7xl font-light tracking-tight text-white font-mono">
          {intPart}
        </span>
        <span className="text-3xl font-light text-zinc-500 font-mono">
          {decPart}
        </span>
        <span className="text-2xl font-light text-zinc-600 ml-1.5 font-sans">mg</span>
      </div>

      {/* Sleep & Clearance metrics */}
      <div className="mt-4 space-y-1.5 text-sm">
        <div className="flex items-center justify-between text-zinc-300">
          <span className="text-zinc-500">Sleep-ready (&lt;25mg)</span>
          <span className="font-mono font-medium">
            {sleepClearance ? (
              <>
                {formatClockTime(sleepClearance.timestamp, new Date(currentTime))}
                <span className="text-zinc-500 ml-1.5">
                  ({formatRelativeDuration(sleepClearance.hoursRemaining)})
                </span>
              </>
            ) : (
              <span className="text-emerald-400 font-sans">Ready now</span>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="text-zinc-600">Zero caffeine (&lt;5mg)</span>
          <span className="font-mono">
            {fullClearance ? (
              formatClockTime(fullClearance.timestamp, new Date(currentTime))
            ) : (
              <span className="text-zinc-500">Cleared</span>
            )}
          </span>
        </div>
      </div>

      {/* Daily intake hairline bar */}
      <div className="mt-5 pt-4 border-t border-zinc-900">
        <div className="flex justify-between text-xs mb-1.5 font-mono">
          <span className="text-zinc-500">24h intake</span>
          <span className={intake24h > DAILY_MAX_MG ? 'text-rose-400 font-bold' : 'text-zinc-400'}>
            {intake24h} / {DAILY_MAX_MG} mg
          </span>
        </div>
        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              intake24h > DAILY_MAX_MG
                ? 'bg-rose-500'
                : intake24h >= 300
                ? 'bg-amber-500'
                : 'bg-zinc-600'
            }`}
            style={{ width: `${intakePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
