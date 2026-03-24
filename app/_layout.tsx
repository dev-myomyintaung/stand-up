import { StoreProvider } from '@/store'
import { setupAndroidChannel } from '@/utils/notifications'
import * as Notifications from 'expo-notifications'
import { Stack, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'

SplashScreen.preventAutoHideAsync()

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
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
      {Platform.OS === 'android' && <StatusBar style="dark" />}
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
