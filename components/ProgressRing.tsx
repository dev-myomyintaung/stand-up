import React, { useEffect } from 'react'
import Svg, { Circle, Text as SvgText } from 'react-native-svg'
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated'
import { colors } from '@/constants/tokens'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface Props {
  confirmed: number
  total: number
  size?: number
  animate?: boolean
  fromConfirmed?: number
}

export function ProgressRing({ confirmed, total, size = 120, animate = false, fromConfirmed = 0 }: Props) {
  const strokeWidth = 7
  const r = (size - strokeWidth) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r

  const progress = useSharedValue(total > 0 ? (animate ? fromConfirmed / total : confirmed / total) : 0)

  useEffect(() => {
    if (animate && total > 0) {
      progress.value = withTiming(confirmed / total, { duration: 500 })
    }
  }, [animate, confirmed, total])

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }))

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={cx} cy={cy} r={r}
        stroke={colors.ringTrack}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <AnimatedCircle
        cx={cx} cy={cy} r={r}
        stroke={colors.ringFill}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeLinecap="round"
        rotation="-90"
        origin={`${cx}, ${cy}`}
        animatedProps={animatedProps}
      />
      <SvgText
        x={cx} y={cy - 2}
        textAnchor="middle"
        fontSize={size * 0.18}
        fontWeight="600"
        fill={colors.textPrimary}
      >
        {confirmed}
      </SvgText>
      <SvgText
        x={cx} y={cy + size * 0.14}
        textAnchor="middle"
        fontSize={size * 0.1}
        fill={colors.textSecondary}
      >
        of {total}
      </SvgText>
    </Svg>
  )
}
