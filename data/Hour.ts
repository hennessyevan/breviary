import { useQuery } from 'react-query'
import { useDB } from './dataContext'
import { Hymn } from './Hymn'
import { Invitatory } from './Invitatory'

export interface Hour {
  id: number
  time: 'or' | 'dt' | 'mp' | 'ep' | 'com' | 'ep1'
  hymnId: number | null
  hymn?: Hymn
  day: number | null
  weekday: number | null
  week: number | null
  invitatoryId: number | null
  invitatory: Invitatory | null
  canticleId: number | null
  intercessionId: number | null
  feastId: number | null
  properId: number | null
}

export function useGetHour(time: Hour['time']) {
  const db = useDB()

  return useQuery('hour', async () => {
    return new Promise<Hour>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `--sql
          select * from Hour
          where time = ?
          limit 1
          ;`,
          [time],
          (tx, { rows: { _array } }) => {
            let hour = _array[0]

            tx.executeSql(
              `--sql
              select * from Hymn
              where id = ?
              limit 1
              ;`,
              [hour.hymnId],
              (tx, { rows: { _array } }) => {
                hour.hymn = _array[0]

                tx.executeSql(
                  `--sql
                  select * from Invitatory
                  where id = ?
                  limit 1
                  ;`,
                  [hour.invitatoryId],
                  (_, { rows: { _array } }) => {
                    hour.invitatory = _array[0]
                    resolve(hour)
                  }
                )
              }
            )
          },
          (_, error) => {
            reject(error)
            return true
          }
        )
      })
    })
  })
}
