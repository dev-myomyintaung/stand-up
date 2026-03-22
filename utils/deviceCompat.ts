import { Platform, Alert } from 'react-native'
import * as IntentLauncher from 'expo-intent-launcher'
import * as Application from 'expo-application'

const MIUI_BRANDS = ['xiaomi', 'redmi', 'poco']

export function isMiui(): boolean {
  if (Platform.OS !== 'android') return false
  const brand = ((Platform.constants as any).Brand ?? '').toLowerCase()
  const manufacturer = ((Platform.constants as any).Manufacturer ?? '').toLowerCase()
  return MIUI_BRANDS.some(b => brand.includes(b) || manufacturer.includes(b))
}

/** Opens Android battery optimization exemption screen for this app. */
export async function requestBatteryOptimizationExemption() {
  try {
    await IntentLauncher.startActivityAsync(
      'android.settings.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS',
      { data: `package:${Application.applicationId}` }
    )
  } catch {
    // Fallback: open general battery optimization settings
    await IntentLauncher.startActivityAsync(
      'android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS'
    )
  }
}

/** Opens MIUI autostart manager for this app. */
export async function openMiuiAutostart() {
  try {
    await IntentLauncher.startActivityAsync(
      'miui.intent.action.APP_PERM_EDITOR',
      {
        className: 'com.miui.securitycenter.permission.AppPermissionsEditorActivity',
        extra: { extra_pkgname: Application.applicationId },
      }
    )
  } catch {
    // Fallback: open MIUI Security Center main screen
    try {
      await IntentLauncher.startActivityAsync('com.miui.securitycenter/.MainActivity')
    } catch {
      Alert.alert(
        'Enable autostart manually',
        'Open Security app → Permissions → Autostart → enable StandUp.'
      )
    }
  }
}

/** Opens MIUI notification management for this app. */
export async function openMiuiNotificationSettings() {
  try {
    await IntentLauncher.startActivityAsync(
      'android.settings.APP_NOTIFICATION_SETTINGS',
      { extra: { 'android.provider.extra.APP_PACKAGE': Application.applicationId } }
    )
  } catch {
    await IntentLauncher.startActivityAsync(
      'android.settings.APPLICATION_DETAILS_SETTINGS',
      { data: `package:${Application.applicationId}` }
    )
  }
}

export function showMiuiGuide() {
  Alert.alert(
    'Fix notifications on MIUI',
    'MIUI blocks background apps by default. You need to do 3 things:\n\n' +
    '1. Allow autostart\n' +
    '2. Remove from battery optimization\n' +
    '3. Set notification priority to "Floating notifications"\n\n' +
    'Tap each step below.',
    [
      {
        text: '1. Autostart',
        onPress: openMiuiAutostart,
      },
      {
        text: '2. Battery',
        onPress: requestBatteryOptimizationExemption,
      },
      {
        text: '3. Notifications',
        onPress: openMiuiNotificationSettings,
      },
      { text: 'Done', style: 'cancel' },
    ]
  )
}
