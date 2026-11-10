import { HeaderVoltar } from "@/components/HeaderVoltar";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";


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
    const sheetRef = useRef<BottomSheetModal>(null)
    const snapPoints = useMemo(() => ["24.5%"], [])
    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            opacity={0.55}
            pressBehavior="close"
            />
        ),
        []
    )

    const router = useRouter()
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

    return (
        <ScreenWrapper>
        <View style={{ flex: 1, paddingInline: 15, paddingBlock: 15}}>
        <HeaderVoltar titulo="Detalhe" pressOpcoes={() => sheetRef.current?.present()}/>

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
                <Text style={styleContainer.valorCard}>
                    {dadosMovimento?.recorrente == 0? "Única" : "Sim"}
                </Text>
            </View>

            <View style={[styleContainer.innerContainerBloco, {width: '100%'}]}>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <Text style={styleContainer.descCard}>
                        Parcelas
                    </Text>
                    {
                        dadosMovimento?.qtd_parcelas || 0 > 0? (
                        <View>
                            <Text style={styleContainer.descCard}>
                                numero parcelas
                            </Text>
                        </View>
                        ):(
                        <View>
                            <Text style={styleContainer.descCard}>
                                Não há parcelas
                            </Text>
                        </View>
                        )
                    }
                </View>

            </View>

            {
                dadosMovimento?.descricao?

                <View style={[styleContainer.innerContainerBloco, {width: '100%'}]}>
                    <Text style={styleContainer.descCard}>
                        Descrição
                    </Text>

                    <Text style={styleContainer.valorCard}>

                        {dadosMovimento.descricao}
                    </Text>
                </View>
                :
                null
            }
            </View>

        </View>

        {upModal()}
        </ScreenWrapper>
    )


    function upModal() {
        return(
            <BottomSheetModal
            ref={sheetRef}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enableOverDrag={false}
            enableDynamicSizing={false}
            backgroundStyle={{backgroundColor: colors.surface}}
            handleIndicatorStyle={{backgroundColor: colors.border,
        width: 40}}
            >
                <BottomSheetView style={{paddingInline: 24,paddingBottom: 45, paddingTop: 20, gap: 35}}>
                    <Pressable style={styleContainer.btOpcoes} onPress={() => {

                        router.push({
                        pathname: dadosMovimento?.tipo_movimentacao == 1? '/(gerando_ganho)/gerandoGanho' : '/(gerando_gasto)/gerandoGasto',
                        params: {
                            id: dadosMovimento?.id
                        }
                        })
                        sheetRef.current?.dismiss()
                        }}>
                        <View style={[styleContainer.iconOpcoes, {backgroundColor: colors.purpleSoft}]}>
                            <FontAwesome6 name="pencil" size={width * 0.05} color={colors.purple} />
                        </View>

                        <Text style={[styleContainer.textoOpcoes, {color: colors.text}]}>
                            Editar movimentação
                        </Text>
                    </Pressable>

                    <Pressable style={styleContainer.btOpcoes} onPress={() => console.log('Excluir')}>
                        <View style={[styleContainer.iconOpcoes, {backgroundColor: colors.redSoft}]}>
                            <FontAwesome6 name="trash" size={width * 0.05} color={colors.red} />
                        </View>
                        <Text style={[styleContainer.textoOpcoes, {color: colors.red}]}>
                            Excluir movimentação
                        </Text>
                    </Pressable>
                </BottomSheetView>
            </BottomSheetModal>
        )
    }
}



const styleContainer = StyleSheet.create({
    headerMovimentacao: {
        justifyContent: 'flex-start',
        flexDirection: "row",
        // padding: 15,
        paddingBlock: 20,
        gap: 12,
        alignItems: 'center',
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
        fontFamily: fonts.displaySemiBold,
        alignItems: 'center'
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
    },


    textoOpcoes: {
        fontFamily: fonts.bodyBold,
        fontSize: 17
    },
    btOpcoes: {
        flexDirection: 'row',
        alignItems: "center",
        gap: 15
    },
    iconOpcoes: {
        padding: 10,
        borderRadius: 8
    }
})