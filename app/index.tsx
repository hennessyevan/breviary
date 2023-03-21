import { useTheme } from '@react-navigation/native'
import { format, set, setMonth } from 'date-fns'
import { Link, Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
import {
  PlatformColor,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { Text } from '../components'
import { useRomanCalendar } from '../components/calendar'
import { HourTile } from '../components/HourTile'
import { LITURGY_COLORS } from '../constants/colors'
import { Hour } from '../data'
import { Time } from '../data/Hour'

export default function Page() {
  const { colors } = useTheme()
  const { t } = useTranslation()
  const { getLiturgicalDay } = useRomanCalendar()

  const currentDay = getLiturgicalDay()

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      <Stack.Screen
        options={{
          title: 'Liturgy of the Hours',
          orientation: 'portrait_up',
          headerTintColor: colors.primary,
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
          <Text color={LITURGY_COLORS[currentDay?.colors[0]]} fontWeight="600">
            {t(currentDay?.seasonNames[0])}
            {' － '}
            {format(new Date(), 'EEEE')} {t(currentDay?.cycles.psalterWeekName)}
          </Text>
        </View>
        <View style={styles.tileList}>
          {[
            // Time.OFFICE_OF_READINGS,
            Time.MORNING_PRAYER,
          ].map((time) => (
            <HourTile key={time} time={time as Hour['time']} />
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  tileList: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 16,
  },
})