import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { ActionMovimentacao } from "../../components/ActionMovimentacao";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';



export default function MainPage(){

    // 1 - ganho
    // 2 - gasto
    const exemploDados = [
        {
            id: 1,
            tituloMovimentacao: 'Netflix',
            valor: 44.9,
            dt_pagamento: '2026-08-04',
            tipo_movimento: 2,
            iconMovimento: 'tv'
        },
        {
            id: 2,
            tituloMovimentacao: 'Salário',
            valor: 2649.5,
            dt_pagamento: '2026-08-03',
            tipo_movimento: 1,
            iconMovimento: 'money-bill'
        },
        {
            id: 3,
            tituloMovimentacao: 'vale alimentação',
            valor: 150,
            dt_pagamento: null,
            tipo_movimento: 1,
            iconMovimento: 'credit-card'
        },
        {
            id: 4,
            tituloMovimentacao: 'Pix para Bea - casa imóveis da cozinha',
            valor: 150,
            dt_pagamento: null,
            tipo_movimento: 2,
            iconMovimento: 'credit-card'
        },
    ]


    return(
    <ScreenWrapper>
        <View style={{ flex:1, paddingInline: 13, paddingBlock: 15 }}>
            <View>
                <Text style={styleContainer.dataResumo}>Agosto 2026</Text>
            </View>

            <View style={styleContainer.containerGeral}>

                {/* <View style={styleContainer.containerPendencias}>
                    <Text style={[styleContainer.containerTitle, {color: "#674600"}]}>Pendências</Text>
                </View> */}

                <View style={styleContainer.containerGanhos}>
                    <View style={styleContainer.containerTitle}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <FontAwesome5 name="arrow-up" size={20} color="#2a922a"/>
                            <Text style={[styleContainer.textTitle, {color: "#2a922a", paddingInline: 13}]}>
                                Ganhos
                            </Text>
                        </View>

                        <Text style={[styleContainer.textTitle, {color: "#2a922a"}, {fontSize: 17}]}>
                            Total X
                        </Text>
                    </View>
                    
                    <View style={{ gap:17, paddingBottom: 6 }}>
                    {
                        exemploDados.map((dado) => {
                            
                            if (dado.tipo_movimento == 1)
                            return(
                            <View key={dado.id}
                            style={styleContainer.containerConteudoOut}
                            >
                                {
                                    dado.iconMovimento && 
                                (
                                <View style={styleContainer.iconMovimentacaoGanho}>
                                    <FontAwesome5 name={dado.iconMovimento} size={17} color="green" />
                                </View>
                                )
                                }

                                <View style={styleContainer.containerConteudoIn}>
                                    <Text style={styleContainer.textConteudoTitulo}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    >
                                        {dado.tituloMovimentacao}
                                    </Text>

                                    {
                                    dado.dt_pagamento && 
                                    <Text style={styleContainer.textConteudoDate}>
                                        {dado.dt_pagamento}
                                    </Text>
                                    }
                                </View>

                                <Text style={styleContainer.textGanho}>
                                    R$ {String(dado.valor).replace('.', ',')}
                                </Text>
                            </View>
                        )}
                        )
                    }
                    </View>
                    
                    <Link href="/" style={styleContainer.textVerMaisGanho}>
                        Ver Mais
                    </Link>
                </View>

                <View style={styleContainer.containerGastos}>
                    <View style={styleContainer.containerTitle}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <FontAwesome5 name="arrow-down" size={20} color="#c71100"/>
                            <Text style={[styleContainer.textTitle, {color: "#c71100", paddingInline: 13}]}>
                                Gastos
                            </Text>
                        </View>

                        <Text style={[styleContainer.textTitle, {color: "#c71100"}, {fontSize: 17}]}>
                            Total X
                        </Text>
                    </View>

                    <View style={{ gap:17, paddingBottom: 6 }}>
                    {
                        exemploDados.map((dado) => {
                            
                            if (dado.tipo_movimento == 2)
                            return(
                            <View key={dado.id}
                            style={styleContainer.containerConteudoOut}
                            >
                                {
                                    dado.iconMovimento && 
                                (
                                <View style={styleContainer.iconMovimentacaoGasto}>
                                    <FontAwesome5 name={dado.iconMovimento} size={17} color="#b60f00" />
                                </View>
                                )
                                }

                                <View style={styleContainer.containerConteudoIn}>
                                    <Text style={styleContainer.textConteudoTitulo}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    >
                                        {dado.tituloMovimentacao}
                                    </Text>

                                    {
                                    dado.dt_pagamento && 
                                    <Text style={styleContainer.textConteudoDate}>
                                        {dado.dt_pagamento}
                                    </Text>
                                    }
                                </View>

                                <Text style={styleContainer.textGasto}>
                                    R$ {String(dado.valor).replace('.', ',')}
                                </Text>
                            </View>
                        )}
                        )
                    }
                    </View>

                </View>

            </View>

        </View>
        
        <ActionMovimentacao/>
    </ScreenWrapper>
    )
}


const styleContainer = StyleSheet.create({
    containerGeral: {
        paddingBlock: 20,
        gap: 45
    },
    dataResumo: {
        fontWeight: "bold",
        fontSize: 17,
        paddingInline: 3
    },
    iconMovimentacaoGanho: {
        width: 43,
        paddingInline: 10,
        alignSelf: 'center',
        backgroundColor: '#62f85d',
        aspectRatio: 1,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconMovimentacaoGasto: {
        width: 43,
        paddingInline: 10,
        alignSelf: 'center',
        backgroundColor: '#ed5e5e',
        aspectRatio: 1,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    
    containerPendencias: {
        backgroundColor: '#e6ba5c',
        width: '100%',
        borderRadius: 12,
        padding: 15,
        rowGap: 20
    },
    containerGanhos: {
        width: '100%',
        borderRadius: 12,
        padding: 15,
        rowGap: 20
    },
    containerGastos: {
        width: '100%',
        borderRadius: 12,
        padding: 15,
        rowGap: 20
    },
    containerTitle: {
        justifyContent: "space-between",
        flexDirection: "row",
        textAlign: 'center',
        alignItems: 'center',
        paddingBottom: 5,
        paddingInline: 5
    },
    containerConteudoOut: {
        flexDirection: "row",
        backgroundColor: "#e2e2e2",
        paddingBlock: 10,
        paddingInline: 12,
        borderRadius: 15,
        alignItems: 'center',
        width: '100%'
    },
    containerConteudoIn: {
        flex: 1,
        paddingInline: 7
    },
    
    
    textTitle: {
        fontWeight: "bold",
        fontSize: 23,
        textAlign: 'center',
    },
    textConteudoTitulo: {
        fontWeight: 'bold',
        fontSize: 17.5,
    },
    textConteudoDate: {
        alignSelf: "flex-start",
        fontWeight: 600,
        fontSize: 14,
        width: 'auto',
        letterSpacing: 0.2
    },
    textGanho: {
        color: '#2a922a',
        fontSize: 18.5,
        fontWeight: 'bold',
        textAlign: 'right',
        alignSelf: 'center',
        flexShrink: 0
    },
    textGasto: {
        color: '#c71100',
        fontSize: 18.5,
        fontWeight: 'bold',
        textAlign: 'right',
        alignSelf: 'center',
        flexShrink: 0
    },
    textVerMaisGanho: {
        fontWeight: "bold",
        fontSize: 18,
        justifyContent: "center",
        textAlign: "center",
        borderTopWidth: 2,
        borderColor: '#5ab539',
        paddingTop: 8,
        color: "#2a922a"
    }
})