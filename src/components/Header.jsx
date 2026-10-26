import React from 'react';
import { Coffee, Info, Sparkles, Download } from 'lucide-react';

export default function Header({ onOpenInfo, installPrompt, onInstallApp }) {
  return (
    <header className="flex items-center justify-between py-4 px-1 border-b border-slate-800/60 mb-5">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
          <Coffee className="w-5 h-5 text-slate-950 stroke-[2.2]" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
          </span>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            Caffeine Tracker
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              PWA
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">5h Biological Half-Life Engine</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {installPrompt && (
          <button
            onClick={onInstallApp}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium border border-amber-500/30 active-press transition"
            title="Install App to Homescreen"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Install</span>
          </button>
        )}
        <button
          onClick={onOpenInfo}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50 active-press transition-colors"
          title="How caffeine half-life & sleep clearance works"
          aria-label="Caffeine Info"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
