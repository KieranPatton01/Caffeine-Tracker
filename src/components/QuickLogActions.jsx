import React from 'react';
import { Coffee, Zap, Plus } from 'lucide-react';

export default function QuickLogActions({ onQuickLog, onOpenCustomModal }) {
  return (
    <div className="grid grid-cols-3 gap-2.5 mt-4">
      {/* Quick Coffee */}
      <button
        onClick={() => onQuickLog('Coffee', 80, 'coffee')}
        className="group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-900 border border-amber-500/30 hover:border-amber-500/60 active-press transition-all shadow-lg shadow-black/40"
      >
        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 group-hover:scale-110 transition-transform mb-2">
          <Coffee className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className="text-xs font-bold text-white tracking-wide">Coffee</span>
        <span className="text-[11px] font-mono text-amber-400 font-semibold mt-0.5">
          +80 mg
        </span>
      </button>

      {/* Quick Energy Drink */}
      <button
        onClick={() => onQuickLog('Energy Drink', 160, 'energy')}
        className="group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-cyan-950/40 to-slate-900 border border-cyan-500/30 hover:border-cyan-500/60 active-press transition-all shadow-lg shadow-black/40"
      >
        <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 group-hover:scale-110 transition-transform mb-2">
          <Zap className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className="text-xs font-bold text-white tracking-wide">Energy</span>
        <span className="text-[11px] font-mono text-cyan-400 font-semibold mt-0.5">
          +160 mg
        </span>
      </button>

      {/* Custom Drink */}
      <button
        onClick={onOpenCustomModal}
        className="group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-slate-800/60 to-slate-900 border border-slate-700/60 hover:border-slate-500 active-press transition-all shadow-lg shadow-black/40"
      >
        <div className="p-2.5 rounded-xl bg-slate-800 text-slate-200 group-hover:scale-110 transition-transform mb-2">
          <Plus className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className="text-xs font-bold text-white tracking-wide">Custom</span>
        <span className="text-[11px] font-mono text-slate-400 font-semibold mt-0.5">
          Specific mg
        </span>
      </button>
    </div>
  );
}
