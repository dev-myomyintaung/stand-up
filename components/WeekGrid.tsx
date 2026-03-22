import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, space } from '@/constants/tokens'
import { StandsLog } from '@/store'
import { getSlots } from '@/utils/slots'

interface Props {
  standsLog: StandsLog
  activeStart: number
  activeEnd: number
  interval: number
}

type DotStatus = 'confirmed' | 'missed' | 'future'

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function getWeekDates(): string[] {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))
  monday.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toISOString().split('T')[0]
  })
}

export function WeekGrid({ standsLog, activeStart, activeEnd, interval }: Props) {
  const weekDates = getWeekDates()
  const todayStr = new Date().toISOString().split('T')[0]
  const nowMins = new Date().getHours() * 60 + new Date().getMinutes()
  const slots = getSlots(activeStart, activeEnd, interval)

  // Dot size scales down for dense grids
  const dotSize = slots.length <= 9 ? 9 : slots.length <= 18 ? 7 : 5
  const dotGap = slots.length <= 9 ? 3 : 2

  return (
    <View style={styles.card}>
      <View style={styles.grid}>
        {weekDates.map((date, di) => {
          const isToday = date === todayStr
          const isPast = date < todayStr
          const confirmedSlots = standsLog[date] ?? []
          const dateNum = parseInt(date.split('-')[2])

          return (
            <View key={date} style={[styles.col, isToday && styles.colToday]}>
              <Text style={[styles.dayLetter, isToday && styles.dayLetterToday]}>
                {DAY_LETTERS[di]}
              </Text>
              <Text style={[styles.dateNum, isToday && styles.dateNumToday]}>
                {dateNum}
              </Text>
              <View style={[styles.dots, { gap: dotGap }]}>
                {slots.map(slotMin => {
                  let status: DotStatus
                  if (confirmedSlots.includes(slotMin)) {
                    status = 'confirmed'
                  } else if (isPast || (isToday && slotMin + interval <= nowMins)) {
                    status = 'missed'
                  } else {
                    status = 'future'
                  }
                  return (
                    <View
                      key={slotMin}
                      style={[
                        styles.dot,
                        { width: dotSize, height: dotSize, borderRadius: dotSize / 2 },
                        styles[status],
                      ]}
                    />
                  )
                })}
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: space.md,
    paddingHorizontal: space.sm,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: space.xs,
    borderRadius: 10,
  },
  colToday: {
    backgroundColor: '#FAF3E4',
  },
  dayLetter: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  dayLetterToday: {
    color: colors.primaryAction,
    fontWeight: '700',
  },
  dateNum: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  dateNumToday: {
    color: colors.primaryAction,
    fontWeight: '600',
  },
  dots: {
    alignItems: 'center',
  },
  dot: {},
  confirmed: { backgroundColor: colors.confirmedDot },
  missed: { backgroundColor: colors.missedDot },
  future: { backgroundColor: colors.futureDot },
})
