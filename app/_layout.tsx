import { ThemeProvider, useTheme } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { PlatformColor, useColorScheme } from 'react-native'
import { QueryClient, QueryClientProvider } from 'react-query'
import { TamaguiProvider, Theme } from 'tamagui'
import { RomanCalendarProvider, useRomanCalendar } from '../components/calendar'
import { darkTheme, lightTheme } from '../components/theme'
import { LITURGY_COLORS } from '../constants/colors'
import { DBProvider, useDB } from '../data/dataContext'
import config from '../tamagui.config'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

export default function Layout() {
  const colorScheme = useColorScheme()
  const [fontsLoaded] = useFonts({
    'New York': require('../assets/fonts/NewYork.ttf'),
    'New York Semibold': require('../assets/fonts/NewYorkMedium-Semibold.otf'),
    'New York Bold': require('../assets/fonts/NewYorkMedium-Bold.otf'),
    'New York Italic': require('../assets/fonts/NewYorkItalic.ttf'),
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <TamaguiProvider config={config} key={colorScheme}>
      <Theme name={colorScheme}>
        <DBProvider>
          <QueryClientProvider client={queryClient}>
            <RomanCalendarProvider>
              <InnerLayout />
            </RomanCalendarProvider>
          </QueryClientProvider>
        </DBProvider>
      </Theme>
    </TamaguiProvider>
  )
}

function InnerLayout() {
  const { dark } = useTheme()
  const db = useDB()
  const { calendar, getLiturgicalDay } = useRomanCalendar()

  if (!db || !calendar) {
    return null
  }

  const currentDay = getLiturgicalDay()
  const theme = dark ? darkTheme : lightTheme

  const liturgical = LITURGY_COLORS[currentDay?.colors[0]] as unknown as string

  return (
    <ThemeProvider
      value={{ ...theme, colors: { ...theme.colors, primary: liturgical } }}
    >
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerLargeTitle: true,
          headerShadowVisible: true,
          headerLargeTitleShadowVisible: false,
          headerBlurEffect: 'regular',
          headerLargeTitleStyle: {
            fontFamily: 'New York Semibold',
            color: PlatformColor('label') as unknown as string,
          },
          presentation: 'fullScreenModal',
          headerTintColor: LITURGY_COLORS[
            currentDay?.colors[0]
          ] as unknown as string,
          headerTitleStyle: {
            fontFamily: 'New York Semibold',
            color: PlatformColor('label') as unknown as string,
          },
          headerLargeStyle: {
            backgroundColor: PlatformColor(
              'systemBackground'
            ) as unknown as string,
          },
          contentStyle: {
            backgroundColor: PlatformColor('systemBackground'),
          },
        }}
      >
        <Stack.Screen name="hour/[time]" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  )
}
