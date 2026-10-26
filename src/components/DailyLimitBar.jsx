import React from 'react';
import { ShieldAlert, CheckCircle2, Flame } from 'lucide-react';
import { DAILY_MAX_MG, get24HourIntake } from '../utils/caffeine';

export default function DailyLimitBar({ drinks, currentTime }) {
  const intake24h = Math.round(get24HourIntake(drinks, currentTime));
  const percent = Math.min(100, Math.round((intake24h / DAILY_MAX_MG) * 100));
  const remainingAllowance = Math.max(0, DAILY_MAX_MG - intake24h);
  const isOverLimit = intake24h > DAILY_MAX_MG;

  let barColor = 'from-emerald-500 to-teal-400';
  let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

  if (intake24h >= DAILY_MAX_MG) {
    barColor = 'from-rose-500 to-red-600';
    badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  } else if (intake24h >= 300) {
    barColor = 'from-amber-500 to-orange-500';
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  }

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-4 mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isOverLimit ? (
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          ) : (
            <Flame className="w-4 h-4 text-amber-400" />
          )}
          <span className="text-xs font-semibold text-slate-300">
            24h Intake vs FDA Limit
          </span>
        </div>
        <div className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${badgeColor}`}>
          {intake24h} / {DAILY_MAX_MG} mg
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full h-2.5 bg-slate-800/90 rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
        <span>
          {isOverLimit ? (
            <span className="text-rose-400 font-medium font-mono">
              +{intake24h - DAILY_MAX_MG} mg above FDA 400 mg limit
            </span>
          ) : (
            <span>
              <strong className="text-slate-200 font-mono">{remainingAllowance} mg</strong> allowance left today
            </span>
          )}
        </span>
        <span className="text-slate-500 font-mono">{percent}%</span>
      </div>
    </div>
  );
}
