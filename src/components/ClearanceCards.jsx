import React from 'react';
import { Moon, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { 
  calculateClearanceTimestamp, 
  formatClockTime, 
  formatRelativeDuration,
  SLEEP_SAFE_THRESHOLD_MG,
  FULL_CLEARANCE_THRESHOLD_MG
} from '../utils/caffeine';

export default function ClearanceCards({ drinks, currentTime }) {
  const sleepClearance = calculateClearanceTimestamp(drinks, SLEEP_SAFE_THRESHOLD_MG, currentTime);
  const fullClearance = calculateClearanceTimestamp(drinks, FULL_CLEARANCE_THRESHOLD_MG, currentTime);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
      {/* Bedtime / Sleep Safe Card */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/90 p-4 transition-all hover:border-slate-700/80">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Sleep-Ready Target
              </h3>
              <p className="text-[11px] text-slate-500">&lt; 25 mg for restful REM</p>
            </div>
          </div>
        </div>

        <div className="mt-3">
          {sleepClearance ? (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-white">
                  {formatClockTime(sleepClearance.timestamp, new Date(currentTime))}
                </span>
                <span className="text-xs font-medium text-indigo-400 font-mono">
                  ({formatRelativeDuration(sleepClearance.hoursRemaining)})
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-400 inline" />
                Caffeine will be low enough to prevent sleep disruption.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-400 py-1">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div>
                <span className="text-sm font-semibold text-white">Sleep-Ready Now</span>
                <p className="text-[11px] text-slate-400">Current levels won't disrupt deep sleep.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Clearance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/90 p-4 transition-all hover:border-slate-700/80">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Zero Clearance
              </h3>
              <p className="text-[11px] text-slate-500">&lt; 5 mg baseline clearance</p>
            </div>
          </div>
        </div>

        <div className="mt-3">
          {fullClearance ? (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-white">
                  {formatClockTime(fullClearance.timestamp, new Date(currentTime))}
                </span>
                <span className="text-xs font-medium text-emerald-400 font-mono">
                  ({formatRelativeDuration(fullClearance.hoursRemaining)})
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400 inline" />
                Complete systemic metabolic elimination.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-400 py-1">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div>
                <span className="text-sm font-semibold text-white">Zero Active Caffeine</span>
                <p className="text-[11px] text-slate-400">System is fully at baseline.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
