import React from 'react';
import { X } from 'lucide-react';

export default function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-zinc-300 text-xs leading-relaxed space-y-3"
        style={{ overscrollBehavior: 'contain' }}
      >
        <div className="flex items-center justify-between pb-2 border-b border-zinc-900 text-sm font-semibold text-white">
          <span>About Caffeine Half-Life</span>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <strong className="text-white block mb-0.5">5.0h Elimination Half-Life</strong>
          Your body clears approximately 50% of active caffeine every 5 hours:
          <div className="my-1.5 p-1.5 bg-zinc-900 rounded font-mono text-[11px] text-amber-400 text-center">
            Remaining = Dose × 0.5^(hours / 5)
          </div>
        </div>

        <div>
          <strong className="text-white block mb-0.5">25 mg Sleep Target</strong>
          Active caffeine above 25 mg can disrupt slow-wave deep sleep and REM cycles, even if you fall asleep easily.
        </div>

        <div>
          <strong className="text-white block mb-0.5">400 mg Daily Limit</strong>
          The FDA recommends a maximum of 400 mg caffeine per day for healthy adults.
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 mt-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}
