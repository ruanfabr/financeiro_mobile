import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useState } from "react"
import { Text, View } from "react-native";


type Categorias = {
    id: number;
    descricao_categoria: string;
    tipo_movimentacao: number;
    criada_em: string;
}

export default function Categorias() {
    const [listaCategoria, setListaCategoria] = useState<Categorias[]>([]);
    const db = useSQLiteContext();

    useFocusEffect(
        useCallback(() => {
            async function definindoListaCategoria(){
                const listaCategorias = await db.getAllAsync<Categorias>(
                    `
                    SELECT
                        id
                        ,descricao_categoria
                        ,tipo_movimentacao
                        ,criada_em
                    FROM financeiro.categorias
                    `
                )
                setListaCategoria(listaCategorias)
            }
            definindoListaCategoria();
        }, [])
    )

    return (
        <>
        {
            listaCategoria?
            <>
            <View>
                <Text>
                    teste
                </Text>
            </View>
            </>
            :
            <Text>
                Não há nada
            </Text>
        }
        </>
    )
}