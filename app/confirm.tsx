import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, space, radius } from '@/constants/tokens'
import { useStore } from '@/store'
import { formatSlotMinute } from '@/utils/slots'

const CONFIRM_WINDOW_MS = 10 * 60 * 1000

export default function ConfirmScreen() {
  const { slotMinute: slotParam, firedAt: firedAtParam } = useLocalSearchParams<{
    slotMinute: string
    firedAt: string
  }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const store = useStore()
  const confirmStand = store?.confirmStand
  const standsLog = store?.standsLog

  const slotMinute = parseInt(slotParam ?? '0')
  const firedAt = parseInt(firedAtParam ?? '0')
  const isExpired = !firedAtParam || Date.now() > firedAt + CONFIRM_WINDOW_MS

  const today = new Date().toISOString().split('T')[0]
  const prevConfirmed = standsLog?.[today]?.length ?? 0

  async function handleConfirm() {
    await confirmStand?.(slotMinute)
    router.replace(`/celebration?prev=${prevConfirmed}`)
  }

  if (isExpired) {
    return (
      <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom + space.lg }]}>
        <View style={styles.center}>
          <Text style={styles.passedIcon}>⏰</Text>
          <Text style={styles.passedTitle}>This hour has passed.</Text>
          <Text style={styles.passedSub}>Next nudge coming soon.</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.secondaryBtn, { opacity: pressed ? 0.7 : 1 }]}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.secondaryText}>Back home</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.lg, paddingBottom: insets.bottom + space.lg }]}>
      <Text style={styles.slotLabel}>{formatSlotMinute(slotMinute)} nudge</Text>

      <View style={styles.center}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>🧍</Text>
        </View>
        <Text style={styles.title}>Stand up for 1 min</Text>
        <Text style={styles.sub}>Walk around, stretch, move.</Text>
      </View>

      <View style={styles.bottom}>
        <Pressable
          style={({ pressed }) => [styles.cta, { opacity: pressed ? 0.85 : 1 }]}
          onPress={handleConfirm}
        >
          <Text style={styles.ctaText}>I stood up ✓</Text>
        </Pressable>
        <Pressable onPress={() => router.replace('/')} hitSlop={16}>
          <Text style={styles.skipText}>skip this one</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: space.lg,
    justifyContent: 'space-between',
  },
  slotLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.md,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 44 },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  sub: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bottom: {
    gap: space.md,
    alignItems: 'center',
  },
  cta: {
    backgroundColor: colors.primaryAction,
    borderRadius: radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    width: '100%',
  },
  ctaText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#fff',
  },
  skipText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  passedIcon: {
    fontSize: 48,
    marginBottom: space.md,
    textAlign: 'center',
  },
  passedTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  passedSub: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: space.xs,
  },
  secondaryBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
})
