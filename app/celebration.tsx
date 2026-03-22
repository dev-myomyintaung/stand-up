import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, space, radius } from '@/constants/tokens'
import { useStore } from '@/store'
import { ProgressRing } from '@/components/ProgressRing'

export default function CelebrationScreen() {
  const { prev: prevParam } = useLocalSearchParams<{ prev: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { streak, standsLog, activeStart, activeEnd } = useStore()

  const scale = useSharedValue(0)

  useEffect(() => {
    scale.value = withDelay(80, withSpring(1, { damping: 7, stiffness: 220 }))
    const timer = setTimeout(() => router.replace('/'), 2000)
    return () => clearTimeout(timer)
  }, [])

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const today = new Date().toISOString().split('T')[0]
  const confirmed = standsLog[today]?.length ?? 0
  const total = activeEnd - activeStart
  const fromConfirmed = parseInt(prevParam ?? '0')
  const remaining = Math.max(0, total - confirmed)

  return (
    <Pressable
      style={[styles.root, { paddingTop: insets.top + space.xl }]}
      onPress={() => router.replace('/')}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.checkWrap, animStyle]}>
          <Text style={styles.check}>✓</Text>
        </Animated.View>

        <Text style={styles.count}>{confirmed} of {total} today</Text>
        <Text style={styles.streakLine}>Streak: {streak} {streak === 1 ? 'day' : 'days'} 🔥</Text>

        <View style={styles.ringWrap}>
          <ProgressRing
            confirmed={confirmed}
            total={total}
            size={110}
            animate
            fromConfirmed={fromConfirmed}
          />
        </View>

        <Text style={styles.remaining}>
          {remaining === 0 ? 'All done today 🎉' : `${remaining} more ${remaining === 1 ? 'hour' : 'hours'} to go`}
        </Text>

        <Text style={styles.hint}>Tap anywhere to dismiss</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.lg,
  },
  checkWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.celebrationBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.sm,
  },
  check: {
    fontSize: 34,
  },
  count: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  streakLine: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  ringWrap: {
    marginVertical: space.sm,
  },
  remaining: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  hint: {
    fontSize: 12,
    color: colors.futureDot,
    marginTop: space.lg,
  },
})
