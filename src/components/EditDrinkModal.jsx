import React, { useState, useEffect } from 'react';
import { X, Trash2, Clock } from 'lucide-react';
import { formatClockTime, normalizeTimestamp } from '../utils/caffeine';

export default function EditDrinkModal({ isOpen, drink, onClose, onSave, onDelete }) {
  const [name, setName] = useState('');
  const [mg, setMg] = useState('');
  const [timestamp, setTimestamp] = useState(Date.now());
  const [dateTimeStr, setDateTimeStr] = useState('');

  useEffect(() => {
    if (drink && isOpen) {
      setName(drink.name || '');
      setMg(drink.mg ? drink.mg.toString() : '');
      const ts = normalizeTimestamp(drink.timestamp);
      setTimestamp(ts);

      const d = new Date(ts);
      const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setDateTimeStr(localIso);
    }
  }, [drink, isOpen]);

  if (!isOpen || !drink) return null;

  const handleAdjustMinutes = (deltaMinutes) => {
    const newTs = timestamp + deltaMinutes * 60 * 1000;
    setTimestamp(newTs);
    const d = new Date(newTs);
    const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setDateTimeStr(localIso);
  };

  const handleSetToNow = () => {
    const now = Date.now();
    setTimestamp(now);
    const d = new Date(now);
    const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setDateTimeStr(localIso);
  };

  const handleDateTimeChange = (val) => {
    setDateTimeStr(val);
    if (val) {
      const parsed = new Date(val).getTime();
      if (!isNaN(parsed)) {
        setTimestamp(parsed);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedMg = parseFloat(mg);
    if (isNaN(parsedMg) || parsedMg <= 0) return;

    onSave({
      ...drink,
      name: name.trim() || drink.name,
      mg: parsedMg,
      timestamp
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
          <span className="text-sm font-semibold text-white">Edit Drink</span>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 my-3">
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Drink Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-zinc-500 focus:outline-none text-white text-sm"
              required
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-zinc-400 mb-1">
              <span>Caffeine Dose (mg)</span>
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
            <div className="flex justify-between items-center text-xs text-zinc-400 mb-1.5">
              <span>Time Consumed</span>
              <span className="font-mono text-zinc-300">
                {formatClockTime(timestamp)}
              </span>
            </div>

            {/* Quick offset buttons */}
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              <button
                type="button"
                onClick={() => handleAdjustMinutes(-60)}
                className="py-1 rounded bg-zinc-900 text-xs font-mono text-zinc-300 hover:bg-zinc-800"
              >
                -1h
              </button>
              <button
                type="button"
                onClick={() => handleAdjustMinutes(-15)}
                className="py-1 rounded bg-zinc-900 text-xs font-mono text-zinc-300 hover:bg-zinc-800"
              >
                -15m
              </button>
              <button
                type="button"
                onClick={() => handleAdjustMinutes(15)}
                className="py-1 rounded bg-zinc-900 text-xs font-mono text-zinc-300 hover:bg-zinc-800"
              >
                +15m
              </button>
              <button
                type="button"
                onClick={handleSetToNow}
                className="py-1 rounded bg-zinc-900 text-xs font-mono text-zinc-300 hover:bg-zinc-800"
              >
                Now
              </button>
            </div>

            {/* Exact datetime input */}
            <input
              type="datetime-local"
              value={dateTimeStr}
              onChange={(e) => handleDateTimeChange(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 focus:text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-zinc-900">
            <button
              type="button"
              onClick={() => {
                onDelete(drink.id);
                onClose();
              }}
              className="p-2.5 rounded-lg bg-zinc-900 hover:bg-rose-950/40 text-zinc-500 hover:text-rose-400 border border-zinc-800 active-press transition"
              title="Delete this entry"
            >
              <Trash2 className="w-4 h-4" />
            </button>

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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
