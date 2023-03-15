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
import { Button, Text } from '../components'
import { useRomanCalendar } from '../components/calendar'
import { HourTile } from '../components/HourTile'
import { LITURGY_COLORS } from '../constants/colors'
import { Hour } from '../data'

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
          title: 'Breviary',
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
          <Text
            style={{
              fontWeight: '600',
              fontSize: 13,
              color: LITURGY_COLORS[currentDay?.colors[0]],
            }}
          >
            {t(currentDay?.seasonNames[0])}
            {' － '}
            {format(new Date(), 'EEEE')} {t(currentDay?.cycles.psalterWeekName)}
          </Text>
        </View>
        <View style={styles.tileList}>
          {['or', 'mp', 'dt', 'ep', 'com'].map((time) => (
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
  },
})