import { SQLiteDatabase } from "expo-sqlite";


export async function categorias(db: SQLiteDatabase) {

    /*
    TIPO_MOVIMENTACAO:
    1 - ganho
    2 - gasto
    3 - Ambos
    */
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT
            ,descricao_categoria TEXT NOT NULL
            ,tipo_movimentacao CHAR NOT NULL
            ,criada_em DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
        )
        `)
}