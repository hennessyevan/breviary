import { Stack, useRouter, useSearchParams } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  StyleSheet,
  View,
  PlatformIOSStatic,
  SafeAreaView,
  Pressable,
} from 'react-native'
import PagerView from 'react-native-pager-view'
import { Text } from '../../components'
import { useRomanCalendar } from '../../components/calendar'
import { Hour, useGetHour } from '../../data'
import { useDB } from '../../data/dataContext'

export default function Today() {
  const router = useRouter()
  const { time } = useSearchParams<{ time: Hour['time'] }>()
  const { t } = useTranslation()
  const db = useDB()
  const { getLiturgicalDay } = useRomanCalendar()
  const currentDay = getLiturgicalDay()
  const [chromeHidden, setChromeHidden] = useState(true)

  const { data } = useGetHour({
    time,
    weekday: currentDay.weekday,
    week: 11,
  })

  return (
    <>
      <Stack.Screen
        options={{
          title: t(time),
          headerLargeTitle: false,
          contentStyle: { backgroundColor: '#FFFBF4' },
        }}
      />
      <View style={styles.xButton}>
        <Pressable onPress={router.back}>
          <Icon name="x" size={16} color="rgba(255,255,255,0.75)" />
        </Pressable>
      </View>
      <PagerView
        style={styles.pager}
        initialPage={0}
        overScrollMode="always"
        overdrag
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.main}>
            <Text style={styles.title}>{data?.hymn?.title}</Text>
            <Text style={styles.text}>{data?.hymn?.text}</Text>
            <View style={{ height: 16 }} />
            {data?.invitatory?.text && (
              <>
                <Text style={styles.title}>{t('Invitatory')}</Text>
                <Text style={styles.text}>{data?.invitatory?.text}</Text>
              </>
            )}
          </View>
        </SafeAreaView>
        <View></View>
      </PagerView>
    </>
  )
}

const styles = StyleSheet.create({
  pager: {
    flex: 1,
  },
  xButton: {
    position: 'absolute',
    top: 60,
    right: 30,
    zIndex: 1,
    borderRadius: 100,
    padding: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    borderRadius: 47.33,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOpacity: 0.7,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowRadius: 25,
    backgroundColor: '#FFFBF4',
  },
  main: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 36,
    paddingVertical: 40,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
    color: '#c00',
    fontFamily: 'New York',
  },
  text: {
    paddingVertical: 8,
    fontFamily: 'New York',
  },
})
