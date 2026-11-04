import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";


type Movimentacoes = {
    id: number;
    titulo: string;
    valor: number;
    descricao: string | null;
    data_emitida: string;
    categoria: number | null;
    recorrente: number;
    qtd_parcelas: number;
    status_movimentacao: string;
    tipo_movimentacao: number;
    icone: string | null;
}

type parcelaMovimentacao = {
    id: number;
    id_movimentacao: number;
    parcelas_pagas: number;
    parcelas_restantes: number;
}

type localSearch = {
    id: string;
}


export default function verMovimentoDetalhado() {
    const { id } = useLocalSearchParams<localSearch>();
    const db = useSQLiteContext();
    const [dadosMovimento, setDadosMovimento] = useState<Movimentacoes>({})

    useFocusEffect(
        useCallback(() => {
            async function verMovimento() {
                const movimento = await db.getFirstAsync<Movimentacoes>(`
                    SELECT
                        id,
                        titulo,
                        valor,
                        descricao,
                        data_emitida,
                        categoria,
                        recorrente,
                        qtd_parcelas,
                        status_movimentacao,
                        tipo_movimentacao,
                        icone
                    FROM movimentacoes
                    WHERE id = ?
                    `, [id]);

                setDadosMovimento(movimento);
            }
            verMovimento();
        }, []) 
    )

    console.log(dadosMovimento)
    return (
        <ScreenWrapper>
        <View style={{ flex: 1, paddingInline: 13, paddingBlock: 15}}>
            <Text>
                eae
            </Text>
        </View>
        </ScreenWrapper>
    )
}


const styleContainer = StyleSheet.create({
    
})