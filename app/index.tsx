import { ProgressRing } from '@/components/ProgressRing'
import { WeekGrid } from '@/components/WeekGrid'
import { colors, space } from '@/constants/tokens'
import { useStore } from '@/store'
import { getCurrentConfirmSlot, getSlots } from '@/utils/slots'
import * as Notifications from 'expo-notifications'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function formatHour(h: number) {
  if (h === 0) return '12am'
  if (h < 12) return `${h}am`
  if (h === 12) return '12pm'
  return `${h - 12}pm`
}

export default function HomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const store = useStore()
  const loaded = store?.loaded ?? false
  const onboarded = store?.onboarded ?? false
  const streak = store?.streak ?? 0
  const standsLog = store?.standsLog ?? {}
  const activeStart = store?.activeStart ?? 9
  const activeEnd = store?.activeEnd ?? 18
  const interval = store?.interval ?? 60
  const lastStreakDate = store?.lastStreakDate ?? null

  useEffect(() => {
    if (loaded && !onboarded) {
      router.replace('/onboarding')
    }
  }, [loaded, onboarded])

  if (!loaded || !onboarded) return null

  const today = new Date().toISOString().split('T')[0]
  const totalSlots = getSlots(activeStart, activeEnd, interval).length
  const confirmedToday = standsLog[today]?.length ?? 0

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]
  const streakBroken = streak === 0 && lastStreakDate !== null && lastStreakDate !== today && lastStreakDate !== yesterdayStr

  // Confirm shortcut — show when within a slot's 10-min window and not yet confirmed
  const currentSlot = getCurrentConfirmSlot(activeStart, activeEnd, interval)
  const alreadyConfirmed = currentSlot !== null && (standsLog[today]?.includes(currentSlot) ?? false)
  const canConfirmNow = currentSlot !== null && !alreadyConfirmed

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.sm }]}>
      <View style={styles.header}>
        <Text style={styles.appName}>StandUp</Text>
        <Pressable onPress={() => router.push('/settings')} hitSlop={12}>
          <Text style={styles.gear}>⚙</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.streakBlock}>
          <Text style={styles.streakNum}>{streak}</Text>
          <Text style={styles.streakLabel}>day streak 🔥</Text>
        </View>

        {streakBroken && (
          <Text style={styles.brokenMsg}>Your streak ended — start a new one today.</Text>
        )}

        <View style={styles.ringWrap}>
          <ProgressRing confirmed={confirmedToday} total={totalSlots} size={140} />
        </View>

        {canConfirmNow && (
          <Pressable
            style={({ pressed }) => [styles.confirmShortcut, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => router.push(`/confirm?slotMinute=${currentSlot}&firedAt=${Date.now()}`)}
          >
            <Text style={styles.confirmShortcutText}>I stood up ✓</Text>
          </Pressable>
        )}

        <Text style={styles.windowLabel}>
          {formatHour(activeStart)} – {formatHour(activeEnd)} · every {interval < 60 ? `${interval}m` : interval === 60 ? '1hr' : `${interval / 60}hr`}
        </Text>

        <View style={styles.gridWrap}>
          <WeekGrid standsLog={standsLog} activeStart={activeStart} activeEnd={activeEnd} interval={interval} />
        </View>

        <Pressable
          style={({ pressed }) => [styles.devBtn, { opacity: pressed ? 0.6 : 1 }]}
          onPress={async () => {
            const slotMinute = new Date().getHours() * 60 + new Date().getMinutes()
            const firedAt = Date.now() + 3000
            await Notifications.scheduleNotificationAsync({
              content: {
                title: 'Time to stand.',
                body: 'Tap to confirm →',
                data: { slotMinute, firedAt },
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 3,
                ...Platform.OS === 'android' && { channelId: 'standup' }
              },
            })
          }}
        >
          <Text style={styles.devBtnText}>⚡ Trigger nudge in 3s</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    paddingBottom: space.sm,
  },
  appName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  gear: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    gap: space.md,
  },
  streakBlock: {
    alignItems: 'center',
  },
  streakNum: {
    fontSize: 64,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 72,
  },
  streakLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  brokenMsg: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  ringWrap: {
    marginVertical: space.sm,
  },
  confirmShortcut: {
    backgroundColor: colors.primaryAction,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 48,
  },
  confirmShortcutText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  windowLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  gridWrap: {
    width: '100%',
    marginTop: space.sm,
  },
  devBtn: {
    marginTop: space.sm,
    paddingVertical: space.sm,
  },
  devBtnText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
})
