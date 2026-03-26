# StandUp

A single-purpose mobile app that reminds you to stand up on a regular interval and tracks your daily streak. No dashboards, no health sync — just one gentle nudge and one tap to confirm.

## What it does

- **Hourly nudge** — push notification fires at the start of each slot in your active window ("Time to stand.")
- **One-tap confirm** — tap the notification to open the app, tap once to log the stand. 10-minute window per slot.
- **Daily streak** — consecutive days with ≥3 confirmed stands. Warm, non-shaming when broken.
- **Today's ring** — circular progress showing confirmed vs. total slots for today.

Default active window: 9am–6pm. Default interval: 60 min (configurable: 15/20/30/45/60/90/120 min).

## Stack

| | |
|---|---|
| Framework | React Native + Expo SDK 55 |
| Navigation | Expo Router |
| Notifications | expo-notifications (local only, no server) |
| Storage | AsyncStorage (fully local, no backend) |
| Animations | Reanimated 4 |
| Platforms | iOS + Android (EAS build) |

## Getting started

```bash
npm install
npx expo start
```

Run on device or simulator:

```bash
npx expo run:ios
npx expo run:android
```

> Notifications require a physical device or a simulator with push notification support.

## Project structure

```
app/          # Expo Router screens
components/   # UI components
store/        # State and AsyncStorage logic
utils/        # Helpers (device compat, notification scheduling)
docs/         # PRD, design tokens, notification system docs
```

## Docs

- [`docs/PRD.md`](docs/PRD.md) — full product requirements
- [`docs/notifications.md`](docs/notifications.md) — notification scheduling system
- [`docs/design-tokens.md`](docs/design-tokens.md) — colours, typography, spacing
- [`docs/screen-flow.md`](docs/screen-flow.md) — screen transitions and navigation
- [`docs/design-rationale.md`](docs/design-rationale.md) — design decisions and rationale
