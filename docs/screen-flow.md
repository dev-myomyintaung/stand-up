# Screen flow — StandUp v1

## Screen 1 — Onboarding
Single screen. Minimal copy. Triggers notification permission immediately. No account, no sign-up.

**Copy:**
- Headline: "Stand up. Every hour."
- Subtext: "One nudge. One tap. That's the whole app."
- CTA: "Allow notifications"
- Caption: "Default: 9am – 6pm · Change anytime"

---

## Screen 2 — Home
Streak counter + today's ring as primary content. Week grid below. Settings gear top-right. Only screen accessible without a nudge.

**Elements:**
- Streak number (large) + "day streak 🔥" label
- Circular progress ring showing confirmed hours / total active hours today (e.g. 5/9)
- 7-column week grid — each column has a day letter + dot per active hour
- Settings gear icon (top-right)

**Dot states:**
| State | Colour |
|---|---|
| Confirmed stand | Blue `#3B8BD4` |
| Future / inactive | Muted border colour |
| Missed hour | Red `#E24B4A` at 60% opacity |

---

## Screen 3 — Nudge
Lock screen push notification. No in-app UI.

**Notification content:**
- App label: `STANDUP`
- Title: "Time to stand."
- Subtitle: "Tap to confirm →"

**Behaviour:**
- Fires at the top of each active hour
- Tapping opens directly to Screen 4 (Confirm)
- Dismissing without tapping = hour marked missed
- Window: 10 minutes from notification fire time

---

## Screen 4 — Confirm
One big button. One skip link (no guilt). Opens from notification tap or from home within the active window.

**Elements:**
- Screen label: "[HH:MM] nudge"
- Standing figure icon
- Body copy: "Stand up for 1 min" / "Walk around, stretch, move."
- Primary CTA: "I stood up ✓"
- Secondary: "skip this hour" (small, no emphasis)

**Edge case:** After the 10-minute window expires, screen shows a 404-style message: "This hour has passed."

---

## Screen 5 — Celebration
Shown immediately after tapping "I stood up."

**Elements:**
- Animated checkmark in green circle (scale bounce, 200–350ms)
- Updated ring animates fill
- Text: "[N] of [total] today" + "Streak: [N] days 🔥"
- Remaining hours caption: "[N] more hours to go today"

**Behaviour:**
- Streak number increments if it's a new day record
- Auto-dismisses after 2s, or tap anywhere to dismiss

---

## Screen 6 — Settings
Accessible via gear icon on Home.

**Settings rows:**
| Setting | Default |
|---|---|
| Active from | 9:00 AM |
| Active until | 6:00 PM |
| Streak threshold | 50% of hours |
| Notifications | On |

**Footer:** Reset streak · Privacy · v1.0

**Notes:**
- No dark mode toggle — follows system appearance
- Reset streak is destructive: requires confirmation alert before executing
- No per-day schedule customisation in v1
