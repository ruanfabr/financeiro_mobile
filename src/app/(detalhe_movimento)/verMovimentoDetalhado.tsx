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


export default function VerMovimentoDetalhado() {
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
                    size={width * 0.1}
                    color={dadosMovimento?.tipo_movimentacao == 1? colors.green : colors.red}
                    />
                </View>
                <Text style={styleContainer.headerTitulo}>
                    {dadosMovimento?.titulo}
                </Text>
            </View>

            <View style={[styleContainer.valorMovimentacao, {backgroundColor: dadosMovimento?.tipo_movimentacao == 1? colors.greenSoft : colors.redSoft}]}>
                <Text style={[styleContainer.valorMovimentacaoText, {color: dadosMovimento?.tipo_movimentacao == 1 ? colors.green : colors.red}]}>
                    R$ {dadosMovimento?.valor.toLocaleString("pt-BR", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </Text>
            </View>

            <View style={styleContainer.bodyBlocos}>

            <View style={styleContainer.innerContainerBloco}>
                <FontAwesome6
                name={'clock'}
                size={width * 0.05}
                color={colors.purple}
                />
                <Text style={styleContainer.descCard}>
                    Data
                </Text>
                <Text style={styleContainer.valorCard}>
                    {dadosMovimento?.data_emitida}
                </Text>
            </View>

            <View style={styleContainer.innerContainerBloco}>
                <FontAwesome6
                name={'repeat'}
                size={width * 0.05}
                color={colors.purple}
                />
                <Text style={styleContainer.descCard}>
                    Recorrência
                </Text>
                <Text>
                    {dadosMovimento?.recorrente == 0? "Única" : "Sim"}
                </Text>
            </View>

            <View style={[styleContainer.innerContainerBloco, {width: '100%'}]}>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <Text style={styleContainer.descCard}>
                        Parcelas
                    </Text>

                    <Text style={styleContainer.descCard}>
                        numero parcelas
                    </Text>
                </View>

            </View>

            <View style={[styleContainer.innerContainerBloco, {width: '100%'}]}>
                <Text style={styleContainer.descCard}>
                    Descrição
                </Text>
            </View>

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
        gap: 12,
        alignContent: 'center',
        alignItems: 'center'
    },
    iconMovimento: {
        paddingInline: 20,
        borderRadius: 100,
        aspectRatio: 1,
        width: 65,
        alignSelf: "center",
        justifyContent: "center"
    },
    headerTitulo: {
        color: colors.text,
        fontSize: 24.5,
        alignSelf: "flex-start",
        fontFamily: fonts.displaySemiBold
    },


    valorMovimentacao: {
        borderRadius: 15,
        paddingInline: 17,
        paddingBlock: 18,
        borderWidth: 1.5,
        borderColor: colors.greenLine,
        marginBlock: 10
    },

    valorMovimentacaoText: {
        fontSize: 28,
        fontFamily: fonts.displaySemiBold
    },

    bodyBlocos: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
        rowGap: 15,
        marginBlock: 10
    },
    innerContainerBloco: {
        width: '48%',
        backgroundColor: colors.surfaceRaised,
        borderRadius: 12,
        paddingInline: 14,
        paddingBlock: 12,
        gap: 5
    },
    descCard: {
        color: colors.textFaint,
        fontFamily: fonts.bodyBold,
        fontSize: 14
    },
    valorCard: {
        color: colors.text,
        fontFamily: fonts.bodyBold
    }
})