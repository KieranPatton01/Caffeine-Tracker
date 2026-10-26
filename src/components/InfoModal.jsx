import React from 'react';
import { X, Moon, Clock, Flame, ShieldCheck, Activity } from 'lucide-react';

export default function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto"
        style={{ overscrollBehavior: 'contain' }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Caffeine Half-Life Science</h2>
              <p className="text-xs text-slate-400">Biological decay & sleep clearance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition active-press"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 my-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Half-Life */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
              <Clock className="w-4 h-4" />
              <span>5.0-Hour Elimination Half-Life ($t_{1/2}$)</span>
            </div>
            <p className="text-slate-400 text-xs">
              In healthy adults, caffeine's mean elimination half-life is approximately 5 hours.
              Every 5 hours, your liver metabolizes 50% of the active caffeine in your bloodstream:
            </p>
            <div className="my-2 p-2 bg-slate-900 rounded-lg text-center font-mono text-xs text-amber-200">
              Remaining = Dose × 0.5^(Δt / 5)
            </div>
            <p className="text-slate-400 text-xs">
              For example, 160 mg at 12:00 PM leaves 80 mg at 5:00 PM, and 40 mg at 10:00 PM.
            </p>
          </div>

          {/* 25mg Sleep Threshold */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-indigo-300 font-bold mb-1">
              <Moon className="w-4 h-4" />
              <span>Sleep-Ready Threshold (25 mg)</span>
            </div>
            <p className="text-slate-400 text-xs">
              Caffeine blocks adenosine receptors. Even when you can fall asleep, residual caffeine above 25 mg significantly reduces deep stage 3 slow-wave sleep and REM cycles, causing grogginess the next morning.
            </p>
          </div>

          {/* 400mg Daily Limit */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-rose-300 font-bold mb-1">
              <Flame className="w-4 h-4" />
              <span>FDA 400 mg Daily Benchmark</span>
            </div>
            <p className="text-slate-400 text-xs">
              The FDA recommends a maximum safe daily caffeine intake of 400 mg (approx. 4 cups of brewed coffee) for healthy adults to avoid anxiety, tremors, tachycardia, and digestive distress.
            </p>
          </div>

          {/* Privacy & Offline */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-300 font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Offline & Private PWA</span>
            </div>
            <p className="text-slate-400 text-xs">
              All drink entries and logs are stored strictly inside your browser's local storage. No trackers, no accounts, and no data leaves your device.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold active-press transition"
        >
          Got It
        </button>
      </div>
    </div>
  );
}
