import { HeaderVoltar } from "@/components/HeaderVoltar";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from '@expo/vector-icons/Feather';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { ButtonComponent } from "@/components/input/Button";


type Movimentacoes = {
    id: number;
    titulo: string;
    valor: number;
    descricao: string | null;
    data_emitida: string;
    categoria: number | null;
    recorrente: number;
    parcelas_pagas: number;
    parcelas_restantes: number;
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
    const [movimentoPago, setMovimentoPago] = useState(0)
    const sheetRef = useRef<BottomSheetModal>(null)
    const snapPoints = useMemo(() => ["33.4%"], [])
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
                        m.id,
                        m.titulo,
                        m.valor,
                        m.descricao,
                        m.data_emitida,
                        m.categoria,
                        m.recorrente,
                        mp.parcelas_pagas,
                        mp.parcelas_restantes,
                        m.status_movimentacao,
                        m.tipo_movimentacao,
                        m.icone
                    FROM movimentacoes m
                    LEFT JOIN movimentoParcelado mp on m.id = mp.id_movimentacao
                    WHERE m.id = ?
                    `, [id]);
                setDadosMovimento(movimento);
            }
            verMovimento();
        }, [movimentoPago]) 
    )

    async function excluirMovimento(id: number) {
        await db.runAsync(
            `
            DELETE FROM movimentacoes
            WHERE id = ?
            `,
            id
        )
        .then(() => {
            sheetRef.current?.dismiss()
            router.back()
        })
        .catch((err) => console.log(err))
    }

    async function marcarComoPago(id: number) {
        await db.runAsync(
            `
            UPDATE movimentoParcelado
            SET parcelas_pagas = parcelas_pagas + 1
            WHERE id_movimentacao = ? and parcelas_pagas < parcelas_restantes
            `,
            id
        )
        .then(() => {
            setMovimentoPago(movimentoPago + 1)
            sheetRef.current?.dismiss()
        })
        .catch((err) => console.log(err))
    }

    if (dadosMovimento)
    return (
        <ScreenWrapper>
        <View style={{ flex: 1, paddingInline: 15, paddingBlock: 15}}>
        <HeaderVoltar titulo="Detalhe" pressOpcoes={() => sheetRef.current?.present()}/>

            <View style={styleContainer.headerMovimentacao}>
                <View style={[styleContainer.iconMovimento, {backgroundColor: dadosMovimento.tipo_movimentacao == 1? colors.greenSoft : colors.redSoft}]}>
                    <FontAwesome6
                    name={dadosMovimento.icone || "dollar-sign"}
                    size={width * 0.1}
                    color={dadosMovimento.tipo_movimentacao == 1? colors.green : colors.red}
                    />
                </View>
                <Text style={styleContainer.headerTitulo}>
                    {dadosMovimento.titulo}
                </Text>
            </View>

            <View style={[styleContainer.valorMovimentacao, {backgroundColor: dadosMovimento.tipo_movimentacao == 1? colors.greenSoft : colors.redSoft, borderColor: dadosMovimento.tipo_movimentacao == 1 ? colors.greenLine:colors.redLine}]}>
                <Text style={[styleContainer.valorMovimentacaoText, {color: dadosMovimento.tipo_movimentacao == 1 ? colors.green : colors.red}]}>
                    R$ {dadosMovimento.valor.toLocaleString("pt-BR", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
                    {new Date(dadosMovimento.data_emitida).toLocaleDateString('pt-BR')}
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
                    {dadosMovimento.recorrente == 0? "Única" : "Sim"}
                </Text>
            </View>

            <View style={[styleContainer.innerContainerBloco, {width: '100%'}]}>
                <View>
                    {
                        dadosMovimento.parcelas_restantes || 0 > 0? (
                        <View style={{gap: 16}}>
                            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                <Text style={styleContainer.descCard}>
                                    Parcelas
                                </Text>
                                <Text style={styleContainer.descCard}>
                                    {dadosMovimento.parcelas_pagas} de {dadosMovimento.parcelas_restantes} Pagas
                                </Text>
                            </View>

                            <View>
                                <View style={styleContainer.barraFaltanteStatusParcela}>
                                <View style={[styleContainer.barraPreenchidaStatusParcela, {width: String(dadosMovimento.parcelas_pagas*100/dadosMovimento.parcelas_restantes) + '%'}]}/>
                                </View>
                            </View>
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
            {/* {
                dadosMovimento.parcelas_restantes || 0 > 0? (
                <>
                <View style={[styleContainer.innerContainerBloco]}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styleContainer.descCard}>
                            Parcelas Pagas
                        </Text>
                    </View>

                    <View>
                        <Text style={[styleContainer.valorCard, {fontSize: 18}]}>
                            {dadosMovimento.parcelas_pagas}
                        </Text>
                    </View>
                </View>
                <View style={[styleContainer.innerContainerBloco]}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={styleContainer.descCard}>
                            Parcelas Restantes
                        </Text>
                    </View>

                    <View>
                        <Text style={[styleContainer.valorCard, {fontSize: 18}]}>
                            {dadosMovimento.parcelas_restantes}
                        </Text>
                    </View>
                </View>
                </>
                ):(
                <View>
                    <Text style={styleContainer.descCard}>
                        Não há parcelas
                    </Text>
                </View>
                )
            } */}

            {
                dadosMovimento.descricao?

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
        
        <View style={styleContainer.botaoPagar}>
            <ButtonComponent
            label="Marcar como Pago"
            variant="green"
            />
        </View>

        {upModal()}
        </ScreenWrapper>
    )


    function upModal() {
        if (dadosMovimento)
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
                    marcarComoPago(dadosMovimento.id)
                    }}>
                        <View style={[styleContainer.iconOpcoes, {backgroundColor: colors.greenSoft}]}>
                            <Feather name="check-square" size={width * 0.05} color={colors.green} />
                        </View>
                        <Text style={[styleContainer.textoOpcoes, {color: colors.text}]}>
                            Marcar como Pago
                        </Text>
                    </Pressable>

                    <Pressable style={styleContainer.btOpcoes} onPress={() => {
                        router.push({
                        pathname: '/(administrar_movimento)/administrarMovimento',
                        params: {
                            id: dadosMovimento.id,
                            tipoMovimentacaoURL: dadosMovimento.tipo_movimentacao == 1? "Ganho":"Gasto"
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

                    <Pressable style={styleContainer.btOpcoes} onPress={() => excluirMovimento(dadosMovimento.id)}>
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
    },


    barraFaltanteStatusParcela: {
        backgroundColor: colors.surface,
        height: 9,
        borderRadius: 20
    },
    barraPreenchidaStatusParcela: {
        backgroundColor: colors.purple,
        height: '100%',
        borderRadius: 20
    },


    botaoPagar: {
    marginBlock: 'auto',
    paddingTop: 35,
    paddingBottom: 15,
    paddingInline: 20
    }
})