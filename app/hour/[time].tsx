import { Stack, useSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  PlatformColor,
  ProgressViewIOSBase,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { Text } from '../../components'
import { useRomanCalendar } from '../../components/calendar'
import { Hour, useGetHour } from '../../data'
import { useDB } from '../../data/dataContext'

export default function Today() {
  const { time } = useSearchParams<{ time: Hour['time'] }>()
  const { t } = useTranslation()
  const db = useDB()
  const { getLiturgicalDay } = useRomanCalendar()
  const currentDay = getLiturgicalDay()

  const { data } = useGetHour(time)

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Stack.Screen options={{ title: t(time) }} />
      <View style={styles.main}>
        <Text style={styles.title}>{data?.hymn?.title}</Text>
        <Text style={styles.text}>{data?.hymn?.text}</Text>
        <View style={{ height: 16 }} />
        <Text style={styles.title}>{t('Invitatory')}</Text>
        <Text style={styles.text}>{data?.invitatory?.text}</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    color: PlatformColor('systemRed'),
    fontFamily: 'New York',
  },
  text: {
    paddingVertical: 8,
    fontFamily: 'New York',
  },
  subtitle: {
    fontSize: 36,
    color: '#38434D',
  },
})
