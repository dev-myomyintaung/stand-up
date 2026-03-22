import { Stack, useRouter } from 'expo-router'
import { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import * as Notifications from 'expo-notifications'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import 'react-native-reanimated'
import { StoreProvider } from '@/store'
import { setupAndroidChannel } from '@/utils/notifications'

SplashScreen.preventAutoHideAsync()

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export { ErrorBoundary } from 'expo-router'

export default function RootLayout() {
  useEffect(() => {
    setupAndroidChannel()
    SplashScreen.hideAsync()
  }, [])

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <RootStack />
      </StoreProvider>
    </SafeAreaProvider>
  )
}

function RootStack() {
  const router = useRouter()
  const lastResponse = Notifications.useLastNotificationResponse()

  useEffect(() => {
    if (lastResponse) {
      const { slotMinute, firedAt } = lastResponse.notification.request.content.data ?? {}
      if (typeof slotMinute === 'number' && typeof firedAt === 'number') {
        router.push(`/confirm?slotMinute=${slotMinute}&firedAt=${firedAt}`)
      }
    }
  }, [lastResponse])

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F1EFE8' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="confirm" />
      <Stack.Screen name="celebration" />
      <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
    </Stack>
  )
}
