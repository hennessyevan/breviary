import { Asset } from 'expo-asset'
import * as FileSystem from 'expo-file-system'
import * as SQLite from 'expo-sqlite'
import { createContext, useContext, useEffect, useState } from 'react'

const DataContext = createContext<SQLite.WebSQLDatabase>(null)

export function DBProvider({ children }) {
  const [db, setDb] = useState<SQLite.WebSQLDatabase>(null)
  async function openDatabase(): Promise<SQLite.WebSQLDatabase> {
    if (
      !(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite'))
        .exists
    ) {
      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + 'SQLite'
      )
    }

    const databaseExists = (
      await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + 'SQLite/dev.db'
      )
    ).exists

    if (!databaseExists) {
      await FileSystem.downloadAsync(
        Asset.fromModule(require('../data/dev.db')).uri,
        FileSystem.documentDirectory + 'SQLite/dev.db'
      )
    }

    const db = SQLite.openDatabase('dev.db')

    globalThis.db = db

    return db
  }

  useEffect(() => {
    openDatabase().then((database) => {
      setDb(database)
    })
  }, [])

  return <DataContext.Provider value={db}>{children}</DataContext.Provider>
}

export function useDB() {
  return useContext(DataContext)
}
