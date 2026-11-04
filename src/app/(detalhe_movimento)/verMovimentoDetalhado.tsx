import { HeaderVoltar } from "@/components/HeaderVoltar";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";


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
    const { width } = useWindowDimensions()
    const [dadosMovimento, setDadosMovimento] = useState<Movimentacoes | null>(null)

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
        <View style={{ flex: 1, paddingInline: 15, paddingBlock: 15}}>
        <HeaderVoltar titulo="Detalhe"/>
            <View style={styleContainer.headerMovimentacao}>
                <View style={[styleContainer.iconMovimento, {backgroundColor: dadosMovimento?.tipo_movimentacao == 1? colors.greenSoft : colors.redSoft}]}>
                    <FontAwesome6
                    name={dadosMovimento?.icone || "dollar-sign"}
                    size={width * 0.12}
                    color={dadosMovimento?.tipo_movimentacao == 1? colors.green : colors.red}
                    />
                </View>
                <Text style={styleContainer.headerTitulo}>
                    {dadosMovimento?.titulo}
                </Text>
            </View>

            <View style={[styleContainer.valorMovimentacao, {backgroundColor: dadosMovimento?.tipo_movimentacao == 1? colors.greenSoft : colors.redSoft}]}>
                <Text>
                    {dadosMovimento?.valor}
                </Text>
            </View>
        </View>
        </ScreenWrapper>
    )
}


const styleContainer = StyleSheet.create({
    headerMovimentacao: {
        justifyContent: 'flex-start',
        flexDirection: "row",
        // padding: 15,
        paddingBlock: 20,
        gap: 18,
        alignContent: 'center',
        alignItems: 'center'
    },
    iconMovimento: {
        paddingInline: 20,
        borderRadius: 100,
        aspectRatio: 1,
        width: 70,
        alignSelf: "center",
        justifyContent: "center"
    },
    headerTitulo: {
        color: colors.white,
        fontSize: 22,
        alignSelf: "flex-start",
        fontFamily: fonts.displaySemiBold
    },


    valorMovimentacao: {
        borderRadius: 15,
        paddingInline: 15,
        paddingBlock: 18
    }
})