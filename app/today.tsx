import { format } from 'date-fns'
import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Text } from '../components'
import { useRomanCalendar } from '../components/calendar'
import { useEffect, useState } from 'react'
import { useDB } from '../data/dataContext'

export default function Today() {
  const { t } = useTranslation()
  const db = useDB()
  const { getLiturgicalDay } = useRomanCalendar()
  const currentDay = getLiturgicalDay()

  const [hour, setHour] = useState(null)

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from Hour where time = ? limit 1;`,
        ['dt'],
        (_, { rows: { _array } }) => {
          setHour(_array[0])
        }
      )
    })
  }, [])

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `${format(new Date(), 'EEEE')} ${t(
            currentDay?.cycles.psalterWeek
          )}`,
        }}
      />
      <View style={styles.main}>
        {/* <Text style={styles.title}>
          {t(currentDay?.seasons[0])} {format(new Date(), 'EEEE')}{' '}
          {t(currentDay?.cycles.psalterWeek)}
        </Text> */}
        <Text>{t(hour?.time)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 960,
    marginHorizontal: 'auto',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 36,
    color: '#38434D',
  },
})
