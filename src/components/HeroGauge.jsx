import React from 'react';
import { Activity, Clock, Zap } from 'lucide-react';
import { getAlertnessStatus, HALF_LIFE_HOURS } from '../utils/caffeine';

export default function HeroGauge({ activeCaffeine, lastUpdated }) {
  const roundedActive = Math.round(activeCaffeine);
  const status = getAlertnessStatus(activeCaffeine);

  // Hourly decay amount right now: dC/dt = -ln(2)/5 * C
  const currentHourlyDecay = (activeCaffeine * (Math.LN2 / HALF_LIFE_HOURS)).toFixed(1);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 p-6 shadow-2xl backdrop-blur-md">
      {/* Background ambient glow according to status level */}
      <div 
        className={`absolute -top-24 -left-24 w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-700 ${
          status.level === 'peak' ? 'bg-rose-500' :
          status.level === 'high' ? 'bg-amber-500' :
          status.level === 'moderate' ? 'bg-yellow-500' :
          status.level === 'sleep-safe' ? 'bg-emerald-500' : 'bg-cyan-500'
        }`}
      />
      <div 
        className={`absolute -bottom-24 -right-24 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700 ${
          status.level === 'peak' ? 'bg-orange-500' :
          status.level === 'high' ? 'bg-amber-400' :
          status.level === 'moderate' ? 'bg-emerald-500' : 'bg-indigo-500'
        }`}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Real-time Status Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm backdrop-blur-md mb-4 transition-all duration-300 ${status.badgeClass}`}>
          <span className={`w-2 h-2 rounded-full ${status.dotClass}`}></span>
          <span>{status.label}</span>
        </div>

        {/* Hero Number */}
        <div className="flex items-baseline justify-center gap-1.5 my-1">
          <span className="text-6xl sm:text-7xl font-extrabold tracking-tight text-white font-mono drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            {roundedActive}
          </span>
          <span className="text-xl sm:text-2xl font-bold text-slate-400 font-sans">
            mg
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 max-w-xs mt-1">
          {status.description}
        </p>

        {/* Live Metrics bar */}
        <div className="w-full grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-800/60 text-xs">
          <div className="flex items-center justify-center gap-1.5 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Decaying: </span>
            <span className="font-mono font-medium text-slate-200">
              ~{currentHourlyDecay} mg/h
            </span>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Refreshes: </span>
            <span className="font-mono text-slate-300">
              {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
