import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { PlatformColor } from 'react-native'
import { RomanCalendarProvider, useRomanCalendar } from '../components/calendar'
import { LITURGY_COLORS } from '../constants/colors'
import { DBProvider, useDB } from '../data/dataContext'

SplashScreen.preventAutoHideAsync()

export default function Layout() {
  const [fontsLoaded] = useFonts({
    'New York': require('../assets/fonts/NewYork.ttf'),
    'New York Bold': require('../assets/fonts/NewYorkMedium-Semibold.otf'),
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <DBProvider>
      <RomanCalendarProvider>
        <InnerLayout />
      </RomanCalendarProvider>
    </DBProvider>
  )
}

function InnerLayout() {
  const db = useDB()
  const { calendar, getLiturgicalDay } = useRomanCalendar()

  if (!db || !calendar) {
    return null
  }

  const currentDay = getLiturgicalDay()

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerLargeTitle: true,
        headerBlurEffect: 'regular',
        headerLargeStyle: {
          backgroundColor: PlatformColor(
            'systemBackground'
          ) as unknown as string,
        },
        headerLargeTitleStyle: {
          fontFamily: 'New York Bold',
          color: PlatformColor('label') as unknown as string,
        },
        headerTintColor: LITURGY_COLORS[
          currentDay?.colors[0]
        ] as unknown as string,
        headerTitleStyle: {
          fontFamily: 'New York Bold',
          color: PlatformColor('label') as unknown as string,
        },
        contentStyle: {
          backgroundColor: PlatformColor('systemBackground'),
        },
      }}
    />
  )
}
