export interface SqlValue { type: "text" | "int" | "numeric" | "boolean" | "timestamp" | "null"; value: string | number | boolean | null; }
export interface SqlClient { query<T extends Record<string, unknown>>(sql: string, params?: readonly SqlValue[]): Promise<{ rows: T[] }>; }
export interface SqlTransaction extends SqlClient { commit(): Promise<void>; rollback(): Promise<void>; }
export interface SqlPool extends SqlClient { connect(): Promise<SqlTransaction>; }
export interface PostgreSqlAdapterOptions { pool: SqlPool; now?: () => string; }
