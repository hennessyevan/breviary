import { intersection, uniq } from 'lodash'
import { useQuery } from 'react-query'
import { useDB } from './dataContext'
import index from './index.json'

function safelyParseJSON<T extends {} = any>(
  json: string,
  defaultValue?: T
): T {
  try {
    return JSON.parse(json)
  } catch (e) {
    return defaultValue ?? ({} as T)
  }
}

export const Weekday = {
  sunday: 'sunday',
  monday: 'monday',
  tuesday: 'tuesday',
  wednesday: 'wednesday',
  thursday: 'thursday',
  friday: 'friday',
  saturday: 'saturday',
} as const

export type HourWeekday = typeof Weekday[keyof typeof Weekday]
export type HourSeason =
  | 'ADVENT'
  | 'LENT'
  | 'ORDINARY_TIME'
  | 'ORDINARY_TIME'
  | 'CHRISTMAS_TIME'
  | 'EASTER_TIME'

export const Time = {
  OFFICE_OF_READINGS: 'OFFICE_OF_READINGS',
  MORNING_PRAYER: 'MORNING_PRAYER',
  EVENING_PRAYER: 'EVENING_PRAYER',
  INVITATORY: 'INVITATORY',
  DAYTIME_PRAYER: 'DAYTIME_PRAYER',
  MID_MORNING_PRAYER: 'MID_MORNING_PRAYER',
  MIDDAY_PRAYER: 'MIDDAY_PRAYER',
  MID_AFTERNOON_PRAYER: 'MID_AFTERNOON_PRAYER',
  NIGHT_PRAYER: 'NIGHT_PRAYER',
  EVENING_PRAYER_2: 'EVENING_PRAYER_2',
  EVENING_PRAYER_1: 'EVENING_PRAYER_1',
  NIGHT_PRAYER_1: 'NIGHT_PRAYER_1',
  NIGHT_PRAYER_2: 'NIGHT_PRAYER_2',
  NONE: 'NONE',
  TERCE: 'TERCE',
  SEXT: 'SEXT',
} as const

type HourTime = typeof Time[keyof typeof Time]

type HourVariables = {
  date: `${number}-${number}`
  week: string
  weekday: HourWeekday
  time: HourTime
  season: HourSeason
  // rank?: Rank
  // common?: string[]
  // period: string[]
  // psalm: string[]
  martyrology: string[]
}

export interface Hour {
  hymn: Hymn
  reading: Reading
  canticle: Canticle
  intercessions: Intercessions
  concludingPrayer: string
  dismissal: string
  ourFather: string
  responsory: string[]
  psalms: Psalm[]
  id: number
  week: string[]
  weekday: HourWeekday[]
  season: string[]
  time: string[]
  date: string[]
  rank: string[]
  common: string[]
  period: string[]
  psalm: string[]
  martyrology: string[]
}

export interface Canticle {
  antiphon: string
  passage: string
  note: string
  text: string[]
}

export interface Hymn {
  title: string
  text: string[]
}

export interface Intercessions {
  prayer: string
  response: string
  text: string[]
}

export interface Psalm {
  antiphon: string
  passage: string
  description: string
  noteAuthor: string
  note: string
  psalmPrayer?: string
  text: string[]
}

export interface Reading {
  passage: string
  text: string[]
}

export function useGetHours({ week, weekday, season, date, time }: HourVariables) {
  const db = useDB()
  return useQuery(['hour', { week, weekday, season, date, time }], () => {
    return new Promise<Hour[]>((resolve, reject) => {
      const targetIds = uniq(
        [
          intersection(
            ...[
              index.week[week],
              index.weekday[weekday],
              index.time[time],
              index.season[season],
            ].filter(Boolean)
          ),
          index.date[date],
        ]
          .flat()
          .filter(Boolean)
      )

      if (targetIds.length) {
        db.readTransaction((tx) => {
          tx.executeSql(
            `SELECT * FROM hours WHERE id IN (${targetIds.join(',')})`,
            [],
            (_, { rows: { _array } }) => {
              const hours = _array.map((hour) =>
                safelyParseJSON<Hour>(hour?.json)
              )

              resolve(hours)
            },
            (_, error) => {
              reject(error)
              return true
            }
          )
        })
      } else {
        resolve([])
      }
    })
  })
}
