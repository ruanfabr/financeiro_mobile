import { SQLiteDatabase } from "expo-sqlite";

export async function movimentoRecorrente(db: SQLiteDatabase) {
  await db.execAsync(`
        CREATE TABLE IF NOT EXISTS movimentacoes_recorrentes (
            id INTEGER PRIMARY KEY AUTOINCREMENT
            ,titulo TEXT NOT NULL
            ,valor REAL NOT NULL
            ,descricao TEXT
            ,data_emitida DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
            ,categoria INTEGER
            ,status_movimentacao TEXT DEFAULT 'P' NOT NULL /* P - pendente / PG - pago */
            ,tipo_movimentacao INTEGER NOT NULL /* 1 - ganho / 2 - gasto */
        )
        `);
}
