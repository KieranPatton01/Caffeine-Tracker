import React from 'react';

export default function QuickLogActions({ onQuickLog, onOpenCustomModal }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-3 border-t border-zinc-900">
      <button
        onClick={() => onQuickLog('Coffee', 80, 'coffee')}
        className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 active-press transition"
      >
        <span className="text-xs font-medium text-white">Coffee</span>
        <span className="text-[11px] font-mono text-amber-400 mt-0.5">+80 mg</span>
      </button>

      <button
        onClick={() => onQuickLog('Energy Drink', 160, 'energy')}
        className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 active-press transition"
      >
        <span className="text-xs font-medium text-white">Energy</span>
        <span className="text-[11px] font-mono text-cyan-400 mt-0.5">+160 mg</span>
      </button>

      <button
        onClick={onOpenCustomModal}
        className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 active-press transition text-zinc-400 hover:text-zinc-200"
      >
        <span className="text-xs font-medium">Custom</span>
        <span className="text-[11px] font-mono text-zinc-500 mt-0.5">+ mg</span>
      </button>
    </div>
  );
}
