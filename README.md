# ☕ Caffeine Tracker (PWA)

A clean, responsive, mobile-first Progressive Web App (PWA) built with **React**, **Tailwind CSS**, and **Lucide icons** that calculates real-time caffeine levels in your body using biological half-life decay kinetics ($t_{1/2} = 5.0\text{ hours}$) and projects exact sleep clearance times.

100% private, runs entirely client-side, offline-capable, and ready for deployment on **GitHub Pages**.

---

## ⚡ Core Features

1. **Quick Logging Actions:**
   - ☕ **Coffee:** Quick log standard coffee (+80 mg).
   - ⚡ **Energy Drink:** Quick log standard energy drink (+160 mg).
   - ➕ **Custom Beverage Modal:**
     - Select from 12+ pre-configured presets (Espresso, Cold Brew, Monster, Diet Coke, Matcha, Pre-workout, etc.).
     - Custom caffeine slider & numeric input.
     - Flexible consumption time (current time, past shortcuts like -30m, -1h, -2h, or exact datetime picker).

2. **Caffeine Decay & Half-Life Engine:**
   - Standard metabolic elimination half-life: **5.0 hours** ($t_{1/2} = 5\text{ h}$).
   - Exact remaining dose formula:
     $$\text{Remaining} = \text{Dose} \times 0.5^{(\Delta t / 5.0)}$$
   - Real-time sum of all active caffeine doses currently in circulation.
   - **Bedtime Sleep-Ready Target:** Calculates the exact clock time and relative hours remaining until blood caffeine drops below **25 mg** (the clinical threshold below which caffeine ceases to disrupt slow-wave deep sleep and REM cycles).
   - **Zero Baseline Target:** Calculates the exact time until blood caffeine drops below **5 mg** (fully metabolically cleared).

3. **Dashboard & UI:**
   - **Hero Stat Display:** Large live caffeine readout (mg) with auto-decay ticks and hourly metabolic elimination speed (~mg/h).
   - **Alertness Status Indicator:** Real-time badge adapting between *Peak Stimulated*, *High Alertness*, *Moderate Buzz*, *Decaying / Lingering*, *Sleep Safe*, and *Cleared*.
   - **Clearance Cards:** Live projections for Sleep-Ready and Zero Clearance with dual clock time and relative durations (e.g. `10:30 PM (in 6h 15m)`).
   - **24-Hour Intake vs FDA 400 mg Limit:** Dynamic progress bar showing trailing 24h intake against the FDA recommended upper limit.
   - **16-Hour Projected Decay Curve:** Visual SVG curve forecasting caffeine elimination over the upcoming 16 hours.
   - **Log Feed:** Chronological drink history showing timestamp, original dose, currently remaining mg, and delete buttons.

4. **Offline PWA & Local Storage:**
   - Full Service Worker (`sw.js`) and Web App Manifest (`manifest.json`) support.
   - Installable on iOS (Safari Add to Home Screen) and Android / Desktop Chrome.
   - All entries persist in `localStorage` — completely offline, with zero data tracking.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local dev server
npm run dev

# 3. Build for production
npm run build
```

---

## 🌐 Deploying to GitHub Pages

This app is configured with relative base paths (`base: './'`), so it works out-of-the-box on GitHub Pages repositories (`https://<username>.github.io/<repo-name>/`).

### Automated Deployment (GitHub Actions)
1. Push this repository to GitHub on `main` or `master`.
2. In your GitHub repository:
   - Go to **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Every push to `main` will automatically build and deploy via the included `.github/workflows/deploy.yml` workflow!
