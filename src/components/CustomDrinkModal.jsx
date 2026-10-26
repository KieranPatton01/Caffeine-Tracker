import React, { useState, useEffect } from 'react';
import { X, Clock, Coffee, Sparkles, Check } from 'lucide-react';

const PRESETS = [
  { name: 'Espresso', mg: 65, category: 'coffee' },
  { name: 'Double Espresso', mg: 130, category: 'coffee' },
  { name: 'Cold Brew', mg: 150, category: 'coffee' },
  { name: 'Drip Coffee (Mug)', mg: 95, category: 'coffee' },
  { name: 'Matcha Latte', mg: 70, category: 'tea' },
  { name: 'Black Tea', mg: 47, category: 'tea' },
  { name: 'Green Tea', mg: 28, category: 'tea' },
  { name: 'Pre-workout', mg: 250, category: 'fitness' },
  { name: 'Monster / Rockstar', mg: 160, category: 'energy' },
  { name: 'Red Bull (250ml)', mg: 80, category: 'energy' },
  { name: 'Diet Coke / Pepsi Max', mg: 46, category: 'soda' },
  { name: 'Decaf Coffee', mg: 4, category: 'coffee' },
];

export default function CustomDrinkModal({ isOpen, onClose, onAddDrink }) {
  const [name, setName] = useState('');
  const [mg, setMg] = useState('100');
  const [timeMode, setTimeMode] = useState('now'); // 'now', 'custom'
  const [customDateTime, setCustomDateTime] = useState('');

  // Reset or update default custom datetime whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setMg('100');
      setTimeMode('now');
      // Set default input string to current local YYYY-MM-DDTHH:mm
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
    setTimeMode('custom');
    const pastTime = new Date(Date.now() - minsAgo * 60 * 1000);
    const localIso = new Date(pastTime.getTime() - pastTime.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setCustomDateTime(localIso);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const caffeineMg = parseFloat(mg);
    if (isNaN(caffeineMg) || caffeineMg < 0) return;

    let timestamp = Date.now();
    if (timeMode === 'custom' && customDateTime) {
      const parsed = new Date(customDateTime).getTime();
      if (!isNaN(parsed)) {
        timestamp = parsed;
      }
    }

    onAddDrink({
      name: name.trim() || 'Custom Beverage',
      mg: caffeineMg,
      timestamp,
      type: 'custom'
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto"
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Log Custom Beverage</h2>
              <p className="text-xs text-slate-400">Specify exact caffeine dose and consumption time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition active-press"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Pills */}
        <div className="my-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Quick Presets
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition active-press ${
                  name === preset.name
                    ? 'bg-amber-500/30 text-amber-200 border-amber-500/50'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                }`}
              >
                {preset.name} <span className="opacity-70 font-mono">({preset.mg}mg)</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Beverage Name */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Beverage Name / Label
            </label>
            <input
              type="text"
              placeholder="e.g., Cold Brew, Pre-workout, Matcha"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:outline-none text-white text-sm placeholder:text-slate-500"
              required
            />
          </div>

          {/* Caffeine Amount */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">
                Caffeine Dose (mg)
              </label>
              <span className="text-xs font-mono font-bold text-amber-400">{mg || 0} mg</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="0"
                max="1000"
                step="1"
                value={mg}
                onChange={(e) => setMg(e.target.value)}
                className="w-28 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:outline-none text-white text-sm font-mono font-bold"
                required
              />
              <input
                type="range"
                min="0"
                max="400"
                step="5"
                value={Math.min(400, Number(mg) || 0)}
                onChange={(e) => setMg(e.target.value)}
                className="flex-1 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Consumption Time */}
          <div className="pt-2 border-t border-slate-800">
            <label className="text-xs font-medium text-slate-300 block mb-2">
              Time Consumed
            </label>
            
            {/* Quick offset buttons */}
            <div className="grid grid-cols-4 gap-1.5 mb-2.5">
              <button
                type="button"
                onClick={() => setTimeMode('now')}
                className={`py-1.5 rounded-lg text-xs font-medium border transition active-press ${
                  timeMode === 'now'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Just Now
              </button>
              <button
                type="button"
                onClick={() => handleOffsetMinutes(30)}
                className="py-1.5 rounded-lg text-xs font-medium border bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500 active-press transition"
              >
                -30m ago
              </button>
              <button
                type="button"
                onClick={() => handleOffsetMinutes(60)}
                className="py-1.5 rounded-lg text-xs font-medium border bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500 active-press transition"
              >
                -1h ago
              </button>
              <button
                type="button"
                onClick={() => handleOffsetMinutes(120)}
                className="py-1.5 rounded-lg text-xs font-medium border bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500 active-press transition"
              >
                -2h ago
              </button>
            </div>

            {/* Custom Datetime Input */}
            <div className="flex items-center gap-2">
              <input
                type="datetime-local"
                value={customDateTime}
                onChange={(e) => {
                  setCustomDateTime(e.target.value);
                  setTimeMode('custom');
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:outline-none text-white text-xs font-mono"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold active-press transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-sm font-bold active-press transition shadow-lg shadow-amber-500/20"
            >
              Log Caffeine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
