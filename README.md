# RunTogether

A shared running app for two, built around a 5K → 10K progression:

1. **Run a 5K without walking** — a 9-week run/walk interval build-up
2. **Improve your 5K time** — 8 weeks of intervals, tempo runs and long runs, ending in a time trial
3. **Run a 10K without walking** — 8 weeks extending your long run out to 10K
4. **Improve your 10K time** — 8 weeks of speed work, ending in a time trial

Each week's workouts are pre-loaded — see `lib/programme.ts`. Log a run against
today's workout (or freeform) and the app tracks completed workouts, personal
bests, and full run history, per runner.

## Getting started

```bash
npm install --legacy-peer-deps
npm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR
code with Expo Go on your phone.

> `--legacy-peer-deps` is needed because of an optional `react-dom` peer
> conflict from Expo's web support — it doesn't affect the native app.

## How it works

- Each phone sets up its own runner profile on first launch (or add a second
  profile from the Profile tab if you're sharing one device).
- All data (runs, completed workouts, current phase) is stored locally on
  device with `AsyncStorage` — there's no backend or account system.
- The **Today** tab shows your next scheduled workout and lets you log it in
  one tap.
- The **Programme** tab shows the full plan across all four phases.
- The **Progress** tab shows totals, personal bests for 5K/10K, and full run
  history.
