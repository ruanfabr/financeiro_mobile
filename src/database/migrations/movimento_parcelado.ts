import { SQLiteDatabase } from "expo-sqlite";


export async function movimentoParcelado(db: SQLiteDatabase){
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS movimentoParcelado (
            id INTEGER PRIMARY KEY AUTOINCREMENT
            ,id_movimentacao INTEGER NOT NULL
            ,parcelas_pagas INTEGER NOT NULL
            ,parcelas_restantes INTEGER NOT NULL

            ,FOREIGN KEY (id_movimentacao) REFERENCES movimentacoes(id)
            ON DELETE CASCADE
        )
        `)
}