import { format } from 'date-fns'
import { Link, Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { PlatformColor, SafeAreaView, ScrollView, View } from 'react-native'
import { Button, Text } from '../components'
import { useRomanCalendar } from '../components/calendar'
import { LITURGY_COLORS } from '../constants/colors'

export default function Page() {
  const { t } = useTranslation()
  const { getLiturgicalDay } = useRomanCalendar()

  const currentDay = getLiturgicalDay()

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
      <Stack.Screen
        options={{
          title: 'Breviary',
          orientation: 'portrait_up',
          headerTintColor: LITURGY_COLORS[currentDay?.colors[0]],
        }}
      />
      <SafeAreaView>
        <View
          style={{
            borderBottomColor: PlatformColor('systemGray5'),
            borderBottomWidth: 0.5,
            paddingBottom: 16,
            paddingTop: 8,
          }}
        >
          <Text
            style={{
              fontWeight: '600',
              fontSize: 13,
              color: LITURGY_COLORS[currentDay?.colors[0]],
              textTransform: 'capitalize',
            }}
          >
            {t(currentDay?.seasons[0])} {format(new Date(), 'EEEE')}{' '}
            {t(currentDay?.cycles.psalterWeek)}
          </Text>
        </View>
        <Link asChild href="/today">
          <Button title="Today" />
        </Link>
      </SafeAreaView>
    </ScrollView>
  )
}
