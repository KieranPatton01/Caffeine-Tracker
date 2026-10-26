import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HeroGauge from './components/HeroGauge';
import QuickLogActions from './components/QuickLogActions';
import ClearanceCards from './components/ClearanceCards';
import DailyLimitBar from './components/DailyLimitBar';
import DecayChart from './components/DecayChart';
import LogFeed from './components/LogFeed';
import CustomDrinkModal from './components/CustomDrinkModal';
import InfoModal from './components/InfoModal';
import { calculateTotalActive } from './utils/caffeine';

const STORAGE_KEY = 'caffeine_tracker_entries_v1';

export default function App() {
  // Load drinks from localStorage
  const [drinks, setDrinks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
    }
    // Default initial demonstration logs if completely first time
    const now = Date.now();
    return [
      {
        id: 'init-1',
        name: 'Morning Coffee',
        mg: 80,
        timestamp: now - 3.5 * 3600 * 1000, // 3.5 hours ago
        type: 'coffee'
      }
    ];
  });

  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drinks));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  }, [drinks]);

  // Real-time ticking every 30 seconds for decay calculations
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000); // 30s auto-refresh
    return () => clearInterval(timer);
  }, []);

  // Listen for PWA beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  }, []);

  const handleQuickLog = (name, mg, type = 'coffee') => {
    const newEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      mg,
      timestamp: Date.now(),
      type
    };
    setDrinks((prev) => [newEntry, ...prev]);
    setCurrentTime(Date.now());
    showToast(`Logged ${name} (+${mg} mg)`);
  };

  const handleAddCustomDrink = (drink) => {
    const newEntry = {
      ...drink,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setDrinks((prev) => [newEntry, ...prev]);
    setCurrentTime(Date.now());
    showToast(`Logged ${newEntry.name} (+${Math.round(newEntry.mg)} mg)`);
  };

  const handleDeleteDrink = (id) => {
    setDrinks((prev) => prev.filter((d) => d.id !== id));
    showToast('Entry removed');
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all caffeine logs? This cannot be undone.')) {
      setDrinks([]);
      showToast('All logs cleared');
    }
  };

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const activeCaffeine = calculateTotalActive(drinks, currentTime);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-amber-500/20 selection:text-amber-300">
      <main className="w-full max-w-md mx-auto px-4 py-2 sm:py-6 flex-1 flex flex-col">
        {/* App Header */}
        <Header
          onOpenInfo={() => setIsInfoModalOpen(true)}
          installPrompt={installPrompt}
          onInstallApp={handleInstallApp}
        />

        {/* Hero Active Caffeine Display */}
        <HeroGauge
          activeCaffeine={activeCaffeine}
          lastUpdated={new Date(currentTime)}
        />

        {/* Quick Logging Buttons */}
        <QuickLogActions
          onQuickLog={handleQuickLog}
          onOpenCustomModal={() => setIsCustomModalOpen(true)}
        />

        {/* Clearance Projections (Sleep Safe & Full Clearance) */}
        <ClearanceCards
          drinks={drinks}
          currentTime={currentTime}
        />

        {/* 24-Hour Limit Gauge */}
        <DailyLimitBar
          drinks={drinks}
          currentTime={currentTime}
        />

        {/* 16h Dynamic Decay Curve */}
        <DecayChart
          drinks={drinks}
          currentTime={currentTime}
        />

        {/* History / Logs Feed */}
        <LogFeed
          drinks={drinks}
          currentTime={currentTime}
          onDeleteDrink={handleDeleteDrink}
          onClearAll={handleClearAll}
        />
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-800/95 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-xl backdrop-blur-md transition-all animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Custom Drink Logger Modal */}
      <CustomDrinkModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddDrink={handleAddCustomDrink}
      />

      {/* Science & Info Modal */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      <footer className="text-center py-4 text-[11px] text-slate-600 border-t border-slate-900">
        Caffeine Tracker • PWA Offline • Half-Life $t_{'{1/2}'} = 5.0\text{h}$
      </footer>
    </div>
  );
}
