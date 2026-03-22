# StandUp — Product Requirements Document

A single-feature mobile app that reminds you to stand on a regular interval, tracks your daily streak, and does nothing else. The whole product is one repeating action.

## Problem statement

Knowledge workers sit for 8–10 hours a day without moving. Existing solutions (Apple Health, Google Fit, fitness apps) bury standing reminders inside bloated dashboards. The user doesn't want a fitness tracker — they want one thing: a gentle, guilt-free nudge to stand up, with visible proof that they're showing up consistently.

## Target user

**The desk worker who means well**

Works 6–10hr days at a desk. Has tried fitness apps but finds them overwhelming. Wants a habit without the pressure. Responds well to streaks (Duolingo model). Doesn't want to think — just wants the nudge to arrive and an easy tap to confirm.

## Goals

**User goal**
Stand up at least once per nudge interval during work hours, and see that habit visualised over time.

**Product goal**
Achieve 40%+ Day-7 retention. The app wins if users come back daily without thinking about it.

## Success metrics

| Metric | Target |
|---|---|
| Day-7 retention | ≥40% |
| Daily nudge response rate | ≥70% |
| Time-to-confirm interaction | <5s |

## Core features — MVP

### 1. Nudge `P0`
Push notification fires at the start of each slot in the active window (user-defined window, default 9am–6pm, default interval 60 min). Notification reads: "Time to stand." Tapping it opens the app to the confirm screen. Notification dismissed without tapping = nudge missed. No second reminder. No guilt copy.

### 2. One-tap confirm `P0`
App opens to a single large CTA: "I stood up." Tapping it logs the slot, triggers a micro-celebration animation (scale bounce + ring fill), and returns to home. Logging is only available within a 10-minute window after each nudge fires — no retroactive logging.

### 3. Daily streak `P0`
A streak counts consecutive days where the user confirmed at least 3 stands, regardless of how many nudges fired. Streak displayed prominently on the home screen. Breaking streak shows a warm, non-shaming message ("Your streak ended — start a new one today"). No streak freeze mechanic in v1.

### 4. Today's ring `P0`
A circular progress ring on the home screen shows confirmed stands vs. total nudge slots for today. Fills incrementally. Completed ring triggers a small celebratory moment. The ring is the only data visualisation in v1.

### 5. Active window config `P1`
User sets start and end time for their active window. Default: 9am–6pm. Notifications only fire within this window. Setting is in the settings screen — not surfaced on home. No per-day customisation in v1 (same schedule every day).

### 6. Nudge interval config `P1`
User can set the interval between nudges: 15, 20, 30, 45, 60, 90, or 120 minutes. Default: 60 min. Changing the interval reschedules all notifications immediately. The week grid adjusts dot density accordingly.

### 7. Week history view `P1`
A 7-column grid showing each day of the current week. Each column has one dot per nudge slot — filled dot = confirmed stand, red = missed, grey = future. Today's column is highlighted. Gives users a sense of their pattern without complex charts. No scrollable history in v1.

## Out of scope — v1

Step counting / movement tracking · Calories or health data · Streak freeze · Social features / sharing · Apple Health / Google Fit sync · Widgets · iPad / tablet layout

## Technical constraints

| | |
|---|---|
| Framework | React Native + Expo SDK 55 |
| Notifications | expo-notifications (local only, no server) |
| Storage | AsyncStorage (local, no backend in v1) |
| Animations | Reanimated 4 for confirm bounce + ring fill animation |
| Target platform | iOS + Android (EAS build) |
| Auth | None in v1 — fully local app |
| State | React Context + AsyncStorage (no Redux/Zustand) |

## Emotional design direction

Playbook: Duolingo model. Every confirmed stand feels rewarding — not just logged. The streak creates investment. The ring creates daily completion drive. Nothing in the app should feel medical, clinical, or high-pressure. Tone is warm, light, and brief. Copy is always 5 words or fewer. Animations are fast (200–350ms), purposeful, and celebrate the user for just showing up.
