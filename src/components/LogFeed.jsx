import React from 'react';
import { Coffee, Zap, Trash2, Clock, Sparkles } from 'lucide-react';
import { calculateRemaining, formatClockTime } from '../utils/caffeine';

export default function LogFeed({ drinks, currentTime, onDeleteDrink, onClearAll }) {
  // Sort reverse chronological (newest first)
  const sortedDrinks = [...drinks].sort((a, b) => b.timestamp - a.timestamp);

  const getDrinkIcon = (type) => {
    switch (type) {
      case 'energy':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'coffee':
      default:
        return <Coffee className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="mt-6 mb-12">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <span>Intake History</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono">
            {drinks.length}
          </span>
        </h3>

        {drinks.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-[11px] text-slate-500 hover:text-rose-400 transition"
          >
            Clear All
          </button>
        )}
      </div>

      {sortedDrinks.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-slate-500">
          <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Coffee className="w-6 h-6 stroke-[1.5]" />
          </div>
          <p className="text-sm font-medium text-slate-300">No caffeine logged yet</p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Use the Coffee, Energy Drink, or Custom buttons above to start tracking your metabolic half-life.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedDrinks.map((drink) => {
            const remaining = calculateRemaining(drink.mg, drink.timestamp, currentTime);
            const remainingPct = Math.round((remaining / drink.mg) * 100);

            return (
              <div
                key={drink.id}
                className="group flex items-center justify-between p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800/90 flex-shrink-0">
                    {getDrinkIcon(drink.type)}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">
                      {drink.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {formatClockTime(drink.timestamp, new Date(currentTime))}
                      </span>
                      <span>•</span>
                      <span>Initial: {Math.round(drink.mg)} mg</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-bold font-mono text-amber-300">
                      {Math.round(remaining)} mg
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {remainingPct}% active
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteDrink(drink.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 active-press transition opacity-70 group-hover:opacity-100"
                    title="Remove drink entry"
                    aria-label={`Delete ${drink.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
