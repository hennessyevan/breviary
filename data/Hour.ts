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

type Relation = {
  tableName: string
  foreignKey: string
  relation: string
}

export function useGetHour({
  id,
  week,
  time,
}: Partial<Pick<Hour, 'time' | 'id' | 'week' | 'weekday'>>) {
  const db = useDB()

  return useQuery('hour', async () => {
    const hourPromise = await new Promise<Hour>((resolve, reject) => {
      db.readTransaction((tx) =>
        tx.executeSql(
          `--sql
          select * from Hour
          where time = ?
          and week = ?
          limit 1;`,
          [time, week],
          (_, { rows: { _array } }) => {
            resolve(_array[0] as Hour)
          },
          (_, error) => {
            reject(error)
            return true
          }
        )
      )
    })

    const relationsConfig = [
      {
        tableName: 'Hymn',
        foreignKey: 'hymnId',
        relation: 'hymn',
      },
      {
        tableName: 'Invitatory',
        foreignKey: 'invitatoryId',
        relation: 'invitatory',
      },
    ]

    const relationPromises = relationsConfig.map(
      async ({ tableName, foreignKey, relation }) => {
        return new Promise((resolve, reject) => {
          db.readTransaction((tx) => {
            tx.executeSql(
              `--sql
            select * from ${tableName}
            where id = ?
            limit 1;`,
              [hourPromise[foreignKey]],
              (_, { rows: { _array } }) => {
                resolve(_array[0])
              },
              (_, error) => {
                reject(error)
                return true
              }
            )
          })
        })
      }
    )

    await Promise.all(relationPromises).then((relations) => {
      relations.forEach((relation, index) => {
        hourPromise[relationsConfig[index].relation] = relation
      })
    })

    return hourPromise
  })
}
