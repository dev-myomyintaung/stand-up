/** Returns all slot start times (minutes-since-midnight) for the active window. */
export function getSlots(startHour: number, endHour: number, intervalMins: number): number[] {
  const slots: number[] = []
  for (let m = startHour * 60; m < endHour * 60; m += intervalMins) {
    slots.push(m)
  }
  return slots
}

/** "10:30 AM" */
export function formatSlotMinute(m: number): string {
  const h = Math.floor(m / 60)
  const min = m % 60
  const suffix = h >= 12 ? 'PM' : 'AM'
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
  return min === 0
    ? `${displayH}:00 ${suffix}`
    : `${displayH}:${String(min).padStart(2, '0')} ${suffix}`
}

/** Returns the current slot minute if within the 10-min confirm window, else null. */
export function getCurrentConfirmSlot(
  startHour: number,
  endHour: number,
  intervalMins: number
): number | null {
  const now = new Date()
  const nowMins = now.getHours() * 60 + now.getMinutes()
  for (const slot of getSlots(startHour, endHour, intervalMins)) {
    if (nowMins >= slot && nowMins < slot + 10) return slot
  }
  return null
}
