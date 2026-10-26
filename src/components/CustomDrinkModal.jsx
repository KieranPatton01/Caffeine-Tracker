import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PRESETS = [
  { name: 'Espresso', mg: 65 },
  { name: 'Double Espresso', mg: 130 },
  { name: 'Cold Brew', mg: 150 },
  { name: 'Drip Coffee', mg: 95 },
  { name: 'Matcha', mg: 70 },
  { name: 'Black Tea', mg: 47 },
  { name: 'Pre-workout', mg: 200 },
  { name: 'Diet Soda', mg: 46 }
];

export default function CustomDrinkModal({ isOpen, onClose, onAddDrink }) {
  const [name, setName] = useState('');
  const [mg, setMg] = useState('100');
  const [customDateTime, setCustomDateTime] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setMg('100');
      const now = new Date();
      const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setCustomDateTime(localIso);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApplyPreset = (preset) => {
    setName(preset.name);
    setMg(preset.mg.toString());
  };

  const handleOffsetMinutes = (minsAgo) => {
    const past = new Date(Date.now() - minsAgo * 60 * 1000);
    const localIso = new Date(past.getTime() - past.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setCustomDateTime(localIso);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const caffeineMg = parseFloat(mg);
    if (isNaN(caffeineMg) || caffeineMg <= 0) return;

    let timestamp = Date.now();
    if (customDateTime) {
      const parsed = new Date(customDateTime).getTime();
      if (!isNaN(parsed)) timestamp = parsed;
    }

    onAddDrink({
      name: name.trim() || 'Custom Drink',
      mg: caffeineMg,
      timestamp,
      type: 'custom'
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-t-2xl sm:rounded-2xl p-5 text-zinc-100"
        style={{ overscrollBehavior: 'contain' }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
          <span className="text-sm font-semibold text-white">Log Drink</span>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="text-xs px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium active-press"
            >
              {p.name}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Name</label>
            <input
              type="text"
              placeholder="e.g. Espresso"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-zinc-500 focus:outline-none text-white text-sm"
              required
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-zinc-400 mb-1">
              <span>Caffeine (mg)</span>
              <span className="font-mono text-amber-400">{mg || 0} mg</span>
            </div>
            <input
              type="number"
              min="1"
              max="1000"
              value={mg}
              onChange={(e) => setMg(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-zinc-500 focus:outline-none text-white text-sm font-mono"
              required
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1">Time</label>
            <div className="flex gap-1.5 mb-2">
              <button
                type="button"
                onClick={() => handleOffsetMinutes(0)}
                className="flex-1 py-1 rounded bg-zinc-900 text-xs text-zinc-300 hover:bg-zinc-800"
              >
                Now
              </button>
              <button
                type="button"
                onClick={() => handleOffsetMinutes(30)}
                className="flex-1 py-1 rounded bg-zinc-900 text-xs text-zinc-300 hover:bg-zinc-800"
              >
                -30m
              </button>
              <button
                type="button"
                onClick={() => handleOffsetMinutes(60)}
                className="flex-1 py-1 rounded bg-zinc-900 text-xs text-zinc-300 hover:bg-zinc-800"
              >
                -1h
              </button>
            </div>
            <input
              type="datetime-local"
              value={customDateTime}
              onChange={(e) => setCustomDateTime(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-semibold active-press"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
