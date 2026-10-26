export const HALF_LIFE_HOURS = 5.0;
export const DAILY_MAX_MG = 400;
export const SLEEP_SAFE_THRESHOLD_MG = 25;
export const FULL_CLEARANCE_THRESHOLD_MG = 5;

/**
 * Calculates remaining caffeine from a single dose at a specific target time.
 * Formula: Dose * 0.5 ^ (elapsedHours / 5.0)
 */
export function calculateRemaining(doseMg, consumedAtTimestamp, targetTimestamp = Date.now()) {
  const elapsedMs = targetTimestamp - consumedAtTimestamp;
  if (elapsedMs <= 0) return doseMg;
  const elapsedHours = elapsedMs / (1000 * 60 * 60);
  const remaining = doseMg * Math.pow(0.5, elapsedHours / HALF_LIFE_HOURS);
  return Math.max(0, remaining);
}

/**
 * Calculates total active caffeine from all recorded drinks at target time.
 */
export function calculateTotalActive(drinks, targetTimestamp = Date.now()) {
  if (!drinks || drinks.length === 0) return 0;
  return drinks.reduce((total, drink) => {
    return total + calculateRemaining(drink.mg, drink.timestamp, targetTimestamp);
  }, 0);
}

/**
 * Calculates the exact timestamp when total active caffeine will reach a threshold.
 * Returns null if current caffeine is already at or below the threshold, or if 0 active caffeine.
 */
export function calculateClearanceTimestamp(drinks, thresholdMg, fromTimestamp = Date.now()) {
  const currentActive = calculateTotalActive(drinks, fromTimestamp);
  if (currentActive <= thresholdMg) {
    return null; // Already cleared / below threshold
  }
  // Formula: Delta Hours = 5.0 * log2(currentActive / thresholdMg)
  const hoursUntilClearance = HALF_LIFE_HOURS * (Math.log(currentActive / thresholdMg) / Math.LN2);
  const clearanceTimestamp = fromTimestamp + hoursUntilClearance * 3600 * 1000;
  return {
    timestamp: clearanceTimestamp,
    hoursRemaining: hoursUntilClearance
  };
}

/**
 * Formats relative hours/minutes (e.g., "in 6h 15m" or "45m")
 */
export function formatRelativeDuration(hours) {
  if (hours <= 0) return 'now';
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) {
    return `in ${m}m`;
  }
  if (m === 0) {
    return `in ${h}h`;
  }
  return `in ${h}h ${m}m`;
}

/**
 * Formats a timestamp into friendly clock time (e.g. "10:30 PM" or "Tomorrow 1:15 AM")
 */
export function formatClockTime(timestamp, referenceDate = new Date()) {
  if (!timestamp) return '--:--';
  const targetDate = new Date(timestamp);
  const isSameDay = targetDate.toDateString() === referenceDate.toDateString();
  
  const timeStr = targetDate.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });

  if (isSameDay) {
    return timeStr;
  }

  // Check if tomorrow
  const tomorrow = new Date(referenceDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (targetDate.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow ${timeStr}`;
  }

  return `${targetDate.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${timeStr}`;
}

/**
 * Get visual alertness status details
 */
export function getAlertnessStatus(activeMg) {
  if (activeMg >= 200) {
    return {
      label: 'Peak Stimulated',
      description: 'High central nervous system stimulation',
      badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-rose-500/10',
      dotClass: 'bg-rose-400 animate-pulse',
      iconColor: 'text-rose-400',
      level: 'peak'
    };
  }
  if (activeMg >= 120) {
    return {
      label: 'High Alertness',
      description: 'Elevated focus, reaction time & energy',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10',
      dotClass: 'bg-amber-400 animate-pulse',
      iconColor: 'text-amber-400',
      level: 'high'
    };
  }
  if (activeMg >= 60) {
    return {
      label: 'Moderate Buzz',
      description: 'Mild productivity boost, gradual decay',
      badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 shadow-yellow-500/10',
      dotClass: 'bg-yellow-400',
      iconColor: 'text-yellow-400',
      level: 'moderate'
    };
  }
  if (activeMg >= SLEEP_SAFE_THRESHOLD_MG) {
    return {
      label: 'Decaying / Lingering',
      description: 'Subtle presence, will still impair sleep depth',
      badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 shadow-cyan-500/10',
      dotClass: 'bg-cyan-400',
      iconColor: 'text-cyan-400',
      level: 'decaying'
    };
  }
  if (activeMg > FULL_CLEARANCE_THRESHOLD_MG) {
    return {
      label: 'Sleep Safe',
      description: 'Below 25 mg threshold for restful REM sleep',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-emerald-500/10',
      dotClass: 'bg-emerald-400',
      iconColor: 'text-emerald-400',
      level: 'sleep-safe'
    };
  }
  return {
    label: 'Cleared / Baseline',
    description: 'Effectively 0 mg caffeine in bloodstream',
    badgeClass: 'bg-slate-700/40 text-slate-400 border-slate-600/30',
    dotClass: 'bg-slate-500',
    iconColor: 'text-slate-400',
    level: 'cleared'
  };
}

/**
 * Calculates total mg consumed in the trailing 24 hours.
 */
export function get24HourIntake(drinks, nowTimestamp = Date.now()) {
  const window24h = 24 * 60 * 60 * 1000;
  return drinks
    .filter(d => d.timestamp >= nowTimestamp - window24h)
    .reduce((sum, d) => sum + d.mg, 0);
}
