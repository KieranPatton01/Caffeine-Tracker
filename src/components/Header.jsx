import React from 'react';
import { HelpCircle, Download } from 'lucide-react';

export default function Header({ onOpenInfo, installPrompt, onInstallApp }) {
  return (
    <header className="flex items-center justify-between pt-6 pb-4">
      <span className="text-sm font-semibold tracking-wide text-zinc-400 uppercase">
        Caffeine Tracker
      </span>

      <div className="flex items-center gap-2">
        {installPrompt && (
          <button
            onClick={onInstallApp}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-300 text-xs font-medium border border-zinc-800 active-press"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
        )}
        <button
          onClick={onOpenInfo}
          className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-300 active-press transition-colors"
          title="How caffeine half-life works"
          aria-label="Info"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
