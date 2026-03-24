import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { getSlots } from './slots'

export async function setupAndroidChannel() {
  if (Platform.OS !== 'android') return
  await Notifications.setNotificationChannelAsync('standup', {
    name: 'Stand reminders',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250],
    lightColor: '#EF9F27',
  })
}

export async function requestPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export async function scheduleNotifications(
  startHour: number,
  endHour: number,
  intervalMins: number
) {
  await Notifications.cancelAllScheduledNotificationsAsync()

  const slots = getSlots(startHour, endHour, intervalMins)
  if (slots.length === 0) return

  const maxDays = Math.floor(64 / slots.length)
  const now = new Date()

  for (let day = 0; day < maxDays; day++) {
    for (const slotMin of slots) {
      const trigger = new Date(now)
      trigger.setDate(now.getDate() + day)
      trigger.setHours(Math.floor(slotMin / 60), slotMin % 60, 0, 0)
      if (trigger > now) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Time to stand.',
            body: 'Tap to confirm →',
            data: { slotMinute: slotMin, firedAt: trigger.getTime() },
            ...(Platform.OS === 'android' && { channelId: 'standup' }),
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: trigger },
        })
      }
    }
  }
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync()
}
