# Design rationale — StandUp v1

## Emotional target

"I feel good about showing up." Warmth, not urgency.

StandUp is a habit app, not a health tracker. Every design decision should reinforce that distinction. Nothing should feel clinical, productivity-tool-like, or high-pressure.

## Colour direction

Blue is out. Blue reads as clinical and productivity-adjacent — the wrong register for an app whose job is to feel rewarding and gentle.

The primary ramp is **amber + coral**. Amber for action (the confirm button), coral as the supporting warm tone. This palette feels encouraging rather than demanding.

**Green is reserved exclusively for streak and success moments.** It signals "you did it" — not navigation, not structure, not neutral UI. Overusing green dilutes that payoff.

The surface is a **warm off-white** (`#F1EFE8`), not stark white or grey. This keeps the whole app feeling warm at rest, before any interaction happens.

## Deliberate decisions

### Background: warm gray `#F1EFE8`, not white
Pure white feels clinical. The warm off-white makes the white cards feel elevated and the whole app feel softer — like paper rather than a hospital form. The warmth is present at rest, before any interaction happens.

### Primary action: amber, not blue
Blue reads as "productivity app" (Notion, Linear, Slack). Amber reads as warmth and energy without being aggressive. It's the colour of morning light, which fits a 9am nudge well.

### Ring fill: green, not amber
There needs to be a clear visual distinction between "action you can take" (amber CTA) and "progress you've made" (green ring). If both were amber, the home screen would lose its visual hierarchy. Green also carries the universal meaning of "good" — it rewards at a glance.

### Missed dot: soft red `#F09595`, not `#E24B4A`
Full red feels punishing. Soft red says "you missed one" — not "you failed." That's the right emotional register for a habit app that wants to keep users coming back, not shame them into quitting.

### Illustrations: undraw.co SVGs
Use SVG illustrations from [undraw.co](https://undraw.co) where a visual is needed (e.g. onboarding, empty states, streak broken screen). Undraw illustrations are open-source, customisable by colour, and match the warm/friendly tone. Set the undraw accent colour to the amber primary (`#EF9F27`) when downloading to keep illustrations on-palette.

## The two emotionally loaded elements

### Confirm button — "I stood up"
The most important tap in the app. It needs to feel like a small reward, not a form submission. Amber (`#EF9F27`) does this — it's warm, inviting, slightly indulgent. The bounce animation on tap reinforces the reward loop.

### Streak counter
The primary retention mechanic. It needs to feel like something worth protecting — personal, not gamified-corporate. Warm type on warm background, with green reserved for the moment the streak increments. Never shown in a way that creates anxiety about breaking it.
