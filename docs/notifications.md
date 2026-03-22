# Notification system — StandUp v1

## Overview

All notifications are **local only** — no server, no push token, no network required. Scheduling happens entirely on-device via `expo-notifications`.

## Slot model

The active window is divided into slots based on the user's chosen interval:

```
slots = [startHour×60, startHour×60 + interval, startHour×60 + 2×interval, ...]
```

Each slot is stored as **minutes-since-midnight** (e.g. 570 = 9:30am). This is the canonical unit throughout the codebase — in `standsLog`, in notification data payloads, and in the confirm screen params.

Helper: `utils/slots.ts` — `getSlots()`, `formatSlotMinute()`, `getCurrentConfirmSlot()`

## Scheduling

`utils/notifications.ts` → `scheduleNotifications(startHour, endHour, intervalMins)`

- Cancels all existing scheduled notifications first
- Generates all slots for the active window
- Schedules notifications for `floor(64 / slotsPerDay)` days ahead — respects iOS's 64-notification hard limit
- Each notification payload carries `{ slotMinute, firedAt }` — `firedAt` is the exact scheduled fire timestamp (ms), used for the 10-minute confirm window check

**Rescheduling triggers:** changing active window, changing interval, toggling notifications on/off, completing onboarding.

## Notification payload

```ts
{
  title: 'Time to stand.',
  body: 'Tap to confirm →',
  data: {
    slotMinute: number,  // minutes-since-midnight for this slot
    firedAt: number,     // unix ms — scheduled fire time
  }
}
```

## Confirm window

The confirm screen is valid for **10 minutes** after `firedAt`:

```ts
const isExpired = Date.now() > firedAt + 10 * 60 * 1000
```

If expired, the screen shows "This hour has passed." with a back-home link.

## Notification tap handling

Handled in `app/_layout.tsx` via `Notifications.useLastNotificationResponse()`. On tap, routes to:

```
/confirm?slotMinute=570&firedAt=1234567890000
```

Works identically whether the app was killed, backgrounded, or in the foreground.

## Foreground behaviour

`Notifications.setNotificationHandler` in `_layout.tsx` sets `shouldShowAlert: true` — the system banner appears even when the app is open. Tapping it also fires `useLastNotificationResponse`.

---

## Android

### Notification channel

Android 8+ requires a notification channel or notifications are silently dropped.

Set up in `utils/notifications.ts` → `setupAndroidChannel()`, called on app launch in `_layout.tsx`.

```ts
channel id:    'standup'
name:          'Stand reminders'
importance:    HIGH
vibration:     [0, 250ms]
light colour:  #EF9F27 (amber)
```

All scheduled notifications are tagged with `channelId: 'standup'` (Android only, via `Platform.OS` check).

### Exact alarms

The `expo-notifications` plugin in `app.json` automatically adds the `SCHEDULE_EXACT_ALARM` / `USE_EXACT_ALARM` manifest permissions required for Android 12+.

---

## MIUI (Xiaomi / Redmi / POCO)

MIUI has three layers of restrictions that block notifications even after the user grants permission:

| Issue | Effect | Fix |
|---|---|---|
| Autostart disabled | App process killed when screen off — scheduled alarms never fire | Enable in Security app → Permissions → Autostart |
| Battery optimization | System terminates background processes aggressively | Whitelist app in battery optimization settings |
| Notification priority | MIUI's own manager can downgrade banners to silent | Set to "Floating notifications" in app notification settings |

### Detection

`utils/deviceCompat.ts` → `isMiui()` — checks `Platform.constants.Brand` and `Platform.constants.Manufacturer` against `['xiaomi', 'redmi', 'poco']`.

### Guided fix

- **On onboarding:** after notification permission is granted, `showMiuiGuide()` fires automatically on detected MIUI devices. Alert presents 3 action buttons that deep-link directly into the relevant MIUI settings screens.
- **In Settings:** a "Fix MIUI notifications" row is shown (only on MIUI devices) that re-opens the same guide.

```
Autostart    → miui.intent.action.APP_PERM_EDITOR (falls back to Security Center)
Battery      → android.settings.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS
Notifications → android.settings.APP_NOTIFICATION_SETTINGS
```

All deep links fall back gracefully if the intent isn't handled by the device.

---

## iOS

No special configuration beyond `expo-notifications` permission request. `requestPermissionsAsync()` triggers the system dialog. If denied, notifications simply won't fire — no silent failure path.

---

## Interval → notification count reference

| Interval | Slots/day (9hr window) | Days scheduled |
|---|---|---|
| 15 min | 36 | 1 |
| 20 min | 27 | 2 |
| 30 min | 18 | 3 |
| 45 min | 12 | 5 |
| 60 min | 9 | 7 |
| 90 min | 6 | 10 |
| 120 min | 4 | 16 |
