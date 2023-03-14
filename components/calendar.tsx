import { format } from 'date-fns'
import { SplashScreen } from 'expo-router'
import { createContext, useContext, useEffect, useState } from 'react'
import RomCal, { LiturgicalCalendar, LiturgicalDay } from 'romcal'
import { Canada_En } from '@romcal/calendar.canada'

export const RomanCalendarContext = createContext<LiturgicalCalendar>(null)

export function RomanCalendarProvider({ children }) {
  const romcal = new RomCal({
    scope: 'liturgical',
    localizedCalendar: Canada_En,
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

  function getLiturgicalDay(date = new Date()): LiturgicalDay {
    const dateString = format(date, 'yyyy-MM-dd')

    return Object.values(calendar)
      .flat()
      .find((d) => d.date === dateString)
  }

  return { calendar, getLiturgicalDay }
}
