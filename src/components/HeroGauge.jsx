import React from 'react';
import { 
  getAlertnessStatus, 
  get24HourIntake, 
  getDecayRate, 
  DAILY_MAX_MG 
} from '../utils/caffeine';

export default function HeroGauge({ drinks, currentTime, activeCaffeine }) {
  const status = getAlertnessStatus(activeCaffeine);
  const decayRate = getDecayRate(activeCaffeine);

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
