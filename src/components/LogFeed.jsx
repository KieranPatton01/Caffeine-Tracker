import React from 'react';
import { X, Edit3 } from 'lucide-react';
import { calculateRemaining, formatClockTime } from '../utils/caffeine';

export default function LogFeed({ drinks, currentTime, onEditDrink, onDeleteDrink, onClearAll }) {
  const sortedDrinks = [...drinks].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="py-4 border-t border-zinc-900 pb-16">
      <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
        <span>History ({drinks.length})</span>
        {drinks.length > 0 && (
          <button
            onClick={onClearAll}
            className="hover:text-zinc-300 transition"
          >
            Clear
          </button>
        )}
      </div>

      {sortedDrinks.length === 0 ? (
        <div className="py-8 text-center text-xs text-zinc-600">
          No drinks logged yet
        </div>
      ) : (
        <div className="divide-y divide-zinc-900">
          {sortedDrinks.map((drink) => {
            const remaining = calculateRemaining(drink.mg, drink.timestamp, currentTime);

            return (
              <div
                key={drink.id}
                className="flex items-center justify-between py-2.5 group hover:bg-zinc-950/60 -mx-2 px-2 rounded-xl transition cursor-pointer"
                onClick={() => onEditDrink(drink)}
                title="Click to edit time or dose"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-1.5 text-sm text-zinc-200 font-medium">
                    <span className="truncate">{drink.name}</span>
                    <Edit3 className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">
                    {formatClockTime(drink.timestamp, new Date(currentTime))} · {Math.round(drink.mg)} mg
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <span className="text-sm text-zinc-300">
                      {remaining >= 10 ? remaining.toFixed(1) : remaining.toFixed(1)}
                    </span>
                    <span className="text-xs text-zinc-600 ml-1">mg</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Don't trigger edit modal when deleting
                      onDeleteDrink(drink.id);
                    }}
                    className="p-1 rounded text-zinc-600 hover:text-zinc-300 active-press transition"
                    title="Delete log"
                    aria-label={`Delete ${drink.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
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
