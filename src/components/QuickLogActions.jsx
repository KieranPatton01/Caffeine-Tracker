import React from 'react';

export default function QuickLogActions({ onQuickLog, onOpenCustomModal }) {
  return (
    <div className="grid grid-cols-2 gap-2 py-3 border-t border-zinc-900">
      <button
        onClick={() => onQuickLog('Coffee', 80, 'coffee')}
        className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 active-press transition"
      >
        <span className="text-xs font-medium text-white">Coffee</span>
        <span className="text-[11px] font-mono text-amber-400 font-semibold">+80 mg</span>
      </button>

      <button
        onClick={() => onQuickLog('Red Bull', 80, 'redbull')}
        className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 active-press transition"
      >
        <span className="text-xs font-medium text-white">Red Bull</span>
        <span className="text-[11px] font-mono text-cyan-400 font-semibold">+80 mg</span>
      </button>

      <button
        onClick={() => onQuickLog('White Monster', 160, 'monster')}
        className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 active-press transition"
      >
        <span className="text-xs font-medium text-white">White Monster</span>
        <span className="text-[11px] font-mono text-zinc-300 font-semibold">+160 mg</span>
      </button>

      <button
        onClick={onOpenCustomModal}
        className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 active-press transition text-zinc-400 hover:text-zinc-200"
      >
        <span className="text-xs font-medium">Custom</span>
        <span className="text-[11px] font-mono text-zinc-500 font-semibold">+ mg</span>
      </button>
    </div>
  );
}
