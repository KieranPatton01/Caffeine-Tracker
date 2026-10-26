export const HALF_LIFE_HOURS = 5.0;
export const DAILY_MAX_MG = 400;
export const SLEEP_SAFE_THRESHOLD_MG = 25;
export const FULL_CLEARANCE_THRESHOLD_MG = 5;

/**
 * Normalizes any timestamp into a valid millisecond number.
 */
export function normalizeTimestamp(ts) {
  if (typeof ts === 'number') return ts;
  if (!ts) return Date.now();
  const parsed = new Date(ts).getTime();
  return isNaN(parsed) ? Date.now() : parsed;
}

/**
 * Calculates remaining caffeine from a single dose at target time.
 * Formula: Dose * 0.5 ^ (elapsedHours / 5.0)
 */
export function calculateRemaining(doseMg, consumedAtTimestamp, targetTimestamp = Date.now()) {
  const dose = Number(doseMg) || 0;
  if (dose <= 0) return 0;

  const consumedMs = normalizeTimestamp(consumedAtTimestamp);
  const targetMs = normalizeTimestamp(targetTimestamp);
  
  const elapsedMs = targetMs - consumedMs;
  if (elapsedMs <= 0) return dose; // Just consumed or recorded for current time

  const elapsedHours = elapsedMs / (1000 * 60 * 60);
  const remaining = dose * Math.pow(0.5, elapsedHours / HALF_LIFE_HOURS);
  return Math.max(0, remaining);
}

/**
 * Calculates total active caffeine from all recorded drinks.
 */
export function calculateTotalActive(drinks, targetTimestamp = Date.now()) {
  if (!drinks || drinks.length === 0) return 0;
  return drinks.reduce((total, drink) => {
    return total + calculateRemaining(drink.mg, drink.timestamp, targetTimestamp);
  }, 0);
}

/**
 * Calculates current hourly elimination speed (mg/hour) and per-minute rate.
 */
export function getDecayRate(activeMg) {
  const hourlyDecay = activeMg * (Math.LN2 / HALF_LIFE_HOURS); // dC/dt = k * C
  const perMinuteDecay = hourlyDecay / 60;
  return {
    hourly: hourlyDecay,
    perMinute: perMinuteDecay
  };
}

/**
 * Calculates the exact timestamp when total active caffeine reaches threshold.
 */
export function calculateClearanceTimestamp(drinks, thresholdMg, fromTimestamp = Date.now()) {
  const currentActive = calculateTotalActive(drinks, fromTimestamp);
  if (currentActive <= thresholdMg) {
    return null; // Already cleared / below threshold
  }
  const hoursUntilClearance = HALF_LIFE_HOURS * (Math.log(currentActive / thresholdMg) / Math.LN2);
  const clearanceTimestamp = fromTimestamp + hoursUntilClearance * 3600 * 1000;
  return {
    timestamp: clearanceTimestamp,
    hoursRemaining: hoursUntilClearance
  };
}

/**
 * Formats relative duration (e.g., "in 6h 15m", "in 45m")
 */
export function formatRelativeDuration(hours) {
  if (hours <= 0) return 'now';
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `in ${m}m`;
  if (m === 0) return `in ${h}h`;
  return `in ${h}h ${m}m`;
}

/**
 * Formats a timestamp into friendly clock time.
 */
export function formatClockTime(timestamp, referenceDate = new Date()) {
  if (!timestamp) return '--:--';
  const targetDate = new Date(normalizeTimestamp(timestamp));
  const isSameDay = targetDate.toDateString() === referenceDate.toDateString();
  
  const timeStr = targetDate.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });

  if (isSameDay) return timeStr;

  const tomorrow = new Date(referenceDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (targetDate.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow ${timeStr}`;
  }

  return `${targetDate.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${timeStr}`;
}

/**
 * Visual alertness status
 */
export function getAlertnessStatus(activeMg) {
  if (activeMg >= 200) {
    return {
      label: 'Peak Stimulated',
      dotClass: 'bg-rose-400 animate-pulse',
      level: 'peak'
    };
  }
  if (activeMg >= 120) {
    return {
      label: 'High Alertness',
      dotClass: 'bg-amber-400 animate-pulse',
      level: 'high'
    };
  }
  if (activeMg >= 60) {
    return {
      label: 'Active / Moderate',
      dotClass: 'bg-amber-400',
      level: 'moderate'
    };
  }
  if (activeMg >= SLEEP_SAFE_THRESHOLD_MG) {
    return {
      label: 'Decaying',
      dotClass: 'bg-zinc-400',
      level: 'decaying'
    };
  }
  if (activeMg > FULL_CLEARANCE_THRESHOLD_MG) {
    return {
      label: 'Sleep Safe',
      dotClass: 'bg-emerald-400',
      level: 'sleep-safe'
    };
  }
  return {
    label: 'Cleared',
    dotClass: 'bg-zinc-600',
    level: 'cleared'
  };
}

/**
 * Total mg consumed in trailing 24 hours.
 */
export function get24HourIntake(drinks, nowTimestamp = Date.now()) {
  const window24h = 24 * 60 * 60 * 1000;
  const nowMs = normalizeTimestamp(nowTimestamp);
  return drinks
    .filter(d => normalizeTimestamp(d.timestamp) >= nowMs - window24h)
    .reduce((sum, d) => sum + (Number(d.mg) || 0), 0);
}
