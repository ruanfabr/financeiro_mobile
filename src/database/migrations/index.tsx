import { movimentoParcelado } from "./movimento_parcelado";
import { movimentoRecorrente } from "./movimento_recorrente";
import { categorias } from "./categorias";
import { SQLiteDatabase } from "expo-sqlite";
import { movimentacoes } from "./movimentacoes";

const migrations = [
    categorias,
    movimentacoes,
    movimentoParcelado,
    movimentoRecorrente
]

export async function runMigrations(db: SQLiteDatabase) {

    const result = await db.getFirstAsync<{ user_version: number }>(
        "PRAGMA user_version"
    );
    const versaoAtual = result?.user_version ?? 0;

    for (let i = versaoAtual; i < migrations.length; i++){
        await migrations[i](db)
    }

    await db.execAsync(`PRAGMA user_version = ${migrations.length}`)
}