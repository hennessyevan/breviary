import { format, parse } from 'date-fns'
import { SplashScreen } from 'expo-router'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import RomCal, { LiturgicalCalendar, LiturgicalDay } from 'romcal'
import {} from '@romcal/calendar.canada'
import { UnitedStates_En } from '@romcal/calendar.united-states'

export const RomanCalendarContext = createContext<LiturgicalCalendar>(null)

export function RomanCalendarProvider({ children }) {
  const romcal = new RomCal({
    scope: 'liturgical',
    localizedCalendar: UnitedStates_En,
  })
  const [calendar, setCalendar] = useState<LiturgicalCalendar>({})

  useEffect(() => {
    async function fetchCalendar() {
      const calendar = await romcal.generateCalendar()
      setCalendar(calendar)
      SplashScreen.hideAsync()
    }

    fetchCalendar()
  }, [])

  return (
    <RomanCalendarContext.Provider value={calendar}>
      {children}
    </RomanCalendarContext.Provider>
  )
}

export function useRomanCalendar() {
  const calendar = useContext(RomanCalendarContext)

  function getStartOfLiturgicalYear() {
    return parse(
      Object.values(calendar).flat()[0].date,
      'yyyy-MM-dd',
      new Date()
    )
  }

  function getWeekOfLiturgicalYear(date = new Date()) {
    const startOfLiturgicalYear = getStartOfLiturgicalYear()
    const daysSinceStart = Math.floor(
      (date.getTime() - startOfLiturgicalYear.getTime()) / (1000 * 3600 * 24)
    )

    return Math.floor(daysSinceStart / 7)
  }

  function getLiturgicalDay(date = new Date()): LiturgicalDay {
    const dateString = format(date, 'yyyy-MM-dd')

    return Object.values(calendar)
      .flat()
      .find((d) => d.date === dateString)
  }

  const currentDay = useMemo(() => getLiturgicalDay(), [])

  return {
    calendar,
    currentDay,
    getLiturgicalDay,
    getStartOfLiturgicalYear,
    getWeekOfLiturgicalYear,
  }
}
