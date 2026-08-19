import { SQLiteDatabase } from "expo-sqlite";


export async function categoria(db: SQLiteDatabase) {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT
            ,descricao_categoria TEXT NOT NULL
            ,criada_em DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
        )
        `)
}