import { View, Text, StyleSheet, Pressable, Switch, Alert, ScrollView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, space } from '@/constants/tokens'
import { useStore } from '@/store'
import { scheduleNotifications, cancelAllNotifications } from '@/utils/notifications'
import { getSlots } from '@/utils/slots'
import { isMiui, showMiuiGuide } from '@/utils/deviceCompat'
import { useState } from 'react'

const INTERVAL_OPTIONS = [15, 20, 30, 45, 60, 90, 120]

function formatInterval(mins: number) {
  if (mins < 60) return `${mins} min`
  if (mins === 60) return '1 hr'
  return `${mins / 60} hr`
}

function formatHour(h: number) {
  if (h === 0) return '12:00 AM'
  if (h < 12) return `${h}:00 AM`
  if (h === 12) return '12:00 PM'
  return `${h - 12}:00 PM`
}

function HourRow({ label, value, onDecrement, onIncrement }: {
  label: string
  value: number
  onDecrement: () => void
  onIncrement: () => void
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.stepper}>
        <Pressable onPress={onDecrement} hitSlop={8} style={({ pressed }) => [styles.stepBtn, { opacity: pressed ? 0.5 : 1 }]}>
          <Text style={styles.stepText}>−</Text>
        </Pressable>
        <Text style={styles.rowValue}>{formatHour(value)}</Text>
        <Pressable onPress={onIncrement} hitSlop={8} style={({ pressed }) => [styles.stepBtn, { opacity: pressed ? 0.5 : 1 }]}>
          <Text style={styles.stepText}>+</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default function SettingsScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { activeStart, activeEnd, interval, setActiveWindow, setInterval, resetStreak, streak } = useStore()
  const [notificationsOn, setNotificationsOn] = useState(true)

  async function reschedule(start = activeStart, end = activeEnd, mins = interval) {
    if (notificationsOn) await scheduleNotifications(start, end, mins)
  }

  async function handleStartChange(delta: number) {
    const next = activeStart + delta
    if (next < 0 || next >= activeEnd) return
    await setActiveWindow(next, activeEnd)
    await reschedule(next, activeEnd)
  }

  async function handleEndChange(delta: number) {
    const next = activeEnd + delta
    if (next <= activeStart || next > 23) return
    await setActiveWindow(activeStart, next)
    await reschedule(activeStart, next)
  }

  async function handleIntervalChange(mins: number) {
    await setInterval(mins)
    await reschedule(activeStart, activeEnd, mins)
  }

  async function handleNotificationsToggle(value: boolean) {
    setNotificationsOn(value)
    if (value) {
      await scheduleNotifications(activeStart, activeEnd, interval)
    } else {
      await cancelAllNotifications()
    }
  }

  function handleResetStreak() {
    Alert.alert(
      'Reset streak',
      `This will clear your ${streak}-day streak. This can't be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetStreak },
      ]
    )
  }

  const totalSlots = getSlots(activeStart, activeEnd, interval).length
  const maxDays = Math.floor(64 / totalSlots)

  return (
    <View style={[styles.root, { paddingTop: (Platform.OS === 'android' ? insets.top : 0) + space.lg, paddingBottom: insets.bottom + space.lg }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.done}>Done</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active window</Text>
          <View style={styles.card}>
            <HourRow
              label="Active from"
              value={activeStart}
              onDecrement={() => handleStartChange(-1)}
              onIncrement={() => handleStartChange(1)}
            />
            <View style={styles.divider} />
            <HourRow
              label="Active until"
              value={activeEnd}
              onDecrement={() => handleEndChange(-1)}
              onIncrement={() => handleEndChange(1)}
            />
          </View>
          <Text style={styles.hint}>Confirm 3+ stands in a day to keep your streak.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nudge interval</Text>
          <View style={styles.intervalRow}>
            {INTERVAL_OPTIONS.map(mins => (
              <Pressable
                key={mins}
                style={[styles.intervalChip, interval === mins && styles.intervalChipActive]}
                onPress={() => handleIntervalChange(mins)}
              >
                <Text style={[styles.intervalChipText, interval === mins && styles.intervalChipTextActive]}>
                  {formatInterval(mins)}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.hint}>
            {totalSlots} nudges/day · notifications scheduled {maxDays} days ahead
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Nudges</Text>
              <Switch
                value={notificationsOn}
                onValueChange={handleNotificationsToggle}
                trackColor={{ true: colors.primaryAction, false: colors.futureDot }}
                thumbColor="#fff"
              />
            </View>
            {isMiui() && (
              <>
                <View style={styles.divider} />
                <Pressable
                  style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}
                  onPress={showMiuiGuide}
                >
                  <Text style={styles.rowLabel}>Fix MIUI notifications</Text>
                  <Text style={styles.rowValue}>→</Text>
                </Pressable>
              </>
            )}
          </View>
          {isMiui() && (
            <Text style={styles.hint}>Xiaomi/Redmi detected — autostart and battery settings required for reliable nudges.</Text>
          )}
        </View>

<View style={styles.footer}>
          <Pressable onPress={handleResetStreak} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
            <Text style={styles.resetText}>Reset streak</Text>
          </Pressable>
          <Text style={styles.version}>v1.0</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: space.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  done: {
    fontSize: 16,
    color: colors.primaryAction,
    fontWeight: '500',
  },
  section: {
    marginBottom: space.lg,
    gap: space.xs,
  },
  sectionTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: space.xs,
    marginLeft: space.xs,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: space.md,
  },
  rowLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  rowValue: {
    fontSize: 15,
    color: colors.textSecondary,
    minWidth: 80,
    textAlign: 'center',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  stepBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 20,
    color: colors.primaryAction,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.futureDot,
    marginHorizontal: space.md,
  },
  intervalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  intervalChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.futureDot,
  },
  intervalChipActive: {
    backgroundColor: colors.primaryAction,
    borderColor: colors.primaryAction,
  },
  intervalChipText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  intervalChipTextActive: {
    color: '#fff',
  },
  hint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: space.xs,
    marginTop: 2,
  },
  footer: {
    paddingTop: space.lg,
    alignItems: 'center',
    gap: space.sm,
  },
  resetText: {
    fontSize: 15,
    color: colors.destructive,
  },
  version: {
    fontSize: 12,
    color: colors.futureDot,
  },
})
