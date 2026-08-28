import { SQLiteDatabase } from "expo-sqlite";


export async function movimentacoes(db: SQLiteDatabase){
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS movimentacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT
        ,titulo TEXT NOT NULL
        ,valor REAL NOT NULL
        ,descricao TEXT
        ,data_emitida DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
        ,categoria INTEGER
        ,recorrente INTEGER DEFAULT 0 NOT NULL /* 0 não / 1 sim OBS: SE SIM A PERIODICIDADE É DE MÊS EM MÊS */
        ,qtd_parcelas INTEGER default 0 NOT NULL
        ,status_movimentacao TEXT DEFAULT 'P' NOT NULL /* P - pendente / PG - pago */
        ,tipo_movimentacao INTEGER NOT NULL /* 1 - ganho / 2 - gasto */
        ,icone TEXT
        )
    `)
}