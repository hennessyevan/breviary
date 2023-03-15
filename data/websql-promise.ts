import { SQLResultSet, SQLTransaction, WebSQLDatabase } from 'expo-sqlite'

export default function PromisedSQLite(db: WebSQLDatabase) {
  if (!is_valid_db(db)) {
    throw new Error('Expected a valid DB object. ')
  }

  return {
    sql: do_sql(db),
    sqls: do_sqls(db),
  }
}

const do_sql =
  <T extends any>(db: WebSQLDatabase) =>
  (sql_query: string, parameters?: (string | number)[]) => {
    if (!is_valid_sql_query(sql_query)) {
      throw new Error('Expected a valid SQL query')
    }
    if (!are_valid_sql_parameters(parameters)) {
      throw new Error('Expected valid SQL parameters')
    }
    return new Promise<T[]>((resolve, reject) =>
      db.transaction(
        (tx) =>
          tx.executeSql(
            sql_query,
            parameters,
            (_, resultSet) => {
              resolve(resultSet.rows._array)
            },
            (_, error) => {
              reject(error)
              return true
            }
          ),
        (error) => reject(error)
      )
    )
  }

const do_sqls =
  <T extends any>(db: WebSQLDatabase) =>
  (sql_queries: unknown[]) => {
    if (!are_valid_sql_queries(sql_queries)) {
      throw new Error('Expected valid SQL queries')
    }
    return new Promise<T[][]>((resolve, reject) =>
      db.transaction(
        (tx) =>
          Promise.all(
            sql_queries.map(([sql_query, ...parameters]) => {
              if (!is_valid_sql_query(sql_query)) {
                reject([sql_query, 'Expected valid SQL query'])
              }
              if (!are_valid_sql_parameters(parameters)) {
                reject([sql_query, 'Expected valid parameters'])
              }
              return new Promise<T[]>((inner_resolve, inner_reject) =>
                tx.executeSql(
                  sql_query,
                  parameters,
                  (_, resultSet) => inner_resolve(resultSet.rows._array),
                  (transaction, error) => {
                    inner_reject([transaction, error])
                    return true
                  }
                )
              )
            })
          )
            .then(resolve)
            .catch(reject),
        (error) => [sql_queries, error]
      )
    )
  }

function is_valid_db(db: unknown): db is WebSQLDatabase {
  return (
    db !== null &&
    typeof db === 'object' &&
    'transaction' in db &&
    typeof db.transaction === 'function'
  )
}

const is_valid_sql_query = (sql_query: unknown): sql_query is string =>
  sql_query !== null && typeof sql_query === 'string' && sql_query.length > 0

const are_valid_sql_parameters = (
  parameters: unknown
): parameters is (string | number)[] =>
  !parameters ||
  (Array.isArray(parameters) &&
    parameters.every(
      (parameter) =>
        typeof parameter === 'string' || typeof parameter === 'number'
    ))

const are_valid_sql_queries = (queries: unknown): queries is string[] =>
  queries &&
  Array.isArray(queries) &&
  queries.length > 0 &&
  queries.every(
    (query) =>
      Array.isArray(query) &&
      query.length > 0 &&
      query.every(
        ([sql, ...params]) =>
          is_valid_sql_query(sql) && are_valid_sql_parameters(params)
      )
  )
