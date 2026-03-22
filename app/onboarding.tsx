import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, space, radius } from '@/constants/tokens'
import { useStore } from '@/store'
import { requestPermission, scheduleNotifications } from '@/utils/notifications'
import { isMiui, showMiuiGuide } from '@/utils/deviceCompat'

export default function OnboardingScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { completeOnboarding, activeStart, activeEnd, interval } = useStore()

  async function handleAllow() {
    await requestPermission()
    await scheduleNotifications(activeStart, activeEnd, interval)
    await completeOnboarding()
    if (isMiui()) showMiuiGuide()
    router.replace('/')
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.xl, paddingBottom: insets.bottom + space.lg }]}>
      <View style={styles.center}>
        <Text style={styles.emoji}>🧍</Text>
        <Text style={styles.headline}>Stand up.{'\n'}Every hour.</Text>
        <Text style={styles.sub}>One nudge. One tap.{'\n'}That's the whole app.</Text>
      </View>
      <View style={styles.bottom}>
        <Pressable
          style={({ pressed }) => [styles.cta, { opacity: pressed ? 0.85 : 1 }]}
          onPress={handleAllow}
        >
          <Text style={styles.ctaText}>Allow notifications</Text>
        </Pressable>
        <Text style={styles.caption}>Default: 9am – 6pm · Change anytime</Text>
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  emoji: {
    fontSize: 72,
    marginBottom: space.md,
  },
  headline: {
    fontSize: 34,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 42,
  },
  sub: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: space.sm,
  },
  bottom: {
    gap: space.sm,
  },
  cta: {
    backgroundColor: colors.primaryAction,
    borderRadius: radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  caption: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
})
