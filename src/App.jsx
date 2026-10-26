import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HeroGauge from './components/HeroGauge';
import QuickLogActions from './components/QuickLogActions';
import DecayChart from './components/DecayChart';
import LogFeed from './components/LogFeed';
import CustomDrinkModal from './components/CustomDrinkModal';
import InfoModal from './components/InfoModal';
import { calculateTotalActive } from './utils/caffeine';

const STORAGE_KEY = 'caffeine_tracker_entries_v1';

export default function App() {
  const [drinks, setDrinks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    const now = Date.now();
    return [
      {
        id: 'init-1',
        name: 'Morning Coffee',
        mg: 80,
        timestamp: now - 3 * 3600 * 1000,
        type: 'coffee'
      }
    ];
  });

  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drinks));
    } catch (e) {
      console.error(e);
    }
  }, [drinks]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handlePrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  }, []);

  const handleQuickLog = (name, mg, type = 'coffee') => {
    const newEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      mg,
      timestamp: Date.now(),
      type
    };
    setDrinks((prev) => [newEntry, ...prev]);
    setCurrentTime(Date.now());
    showToast(`+${mg} mg logged`);
  };

  const handleAddCustomDrink = (drink) => {
    const newEntry = {
      ...drink,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    };
    setDrinks((prev) => [newEntry, ...prev]);
    setCurrentTime(Date.now());
    showToast(`+${Math.round(newEntry.mg)} mg logged`);
  };

  const handleDeleteDrink = (id) => {
    setDrinks((prev) => prev.filter((d) => d.id !== id));
    showToast('Entry removed');
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all logs?')) {
      setDrinks([]);
      showToast('Cleared');
    }
  };

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  const activeCaffeine = calculateTotalActive(drinks, currentTime);

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between selection:bg-zinc-800">
      <main className="w-full max-w-sm mx-auto px-4 flex-1 flex flex-col">
        <Header
          onOpenInfo={() => setIsInfoModalOpen(true)}
          installPrompt={installPrompt}
          onInstallApp={handleInstallApp}
        />

        <HeroGauge
          drinks={drinks}
          currentTime={currentTime}
          activeCaffeine={activeCaffeine}
        />

        <QuickLogActions
          onQuickLog={handleQuickLog}
          onOpenCustomModal={() => setIsCustomModalOpen(true)}
        />

        <DecayChart
          drinks={drinks}
          currentTime={currentTime}
        />

        <LogFeed
          drinks={drinks}
          currentTime={currentTime}
          onDeleteDrink={handleDeleteDrink}
          onClearAll={handleClearAll}
        />
      </main>

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono shadow-lg transition">
          {toastMessage}
        </div>
      )}

      <CustomDrinkModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddDrink={handleAddCustomDrink}
      />

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}
