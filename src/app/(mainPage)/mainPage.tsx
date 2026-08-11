import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { ActionMovimentacao } from "./actionMovimentacao";



export default function MainPage(){

    // 1 - ganho
    // 2 - gasto
    const exemploDados = [
        {
            id: 1,
            desc_movimentacao: 'Netflix',
            valor: 44.9,
            dt_pagamento: '2026-08-04',
            tipo_movimento: 2
        },
        {
            id: 2,
            desc_movimentacao: 'Salário',
            valor: 2649.5,
            dt_pagamento: null,
            tipo_movimento: 1
        },
        {
            id: 3,
            desc_movimentacao: 'vale alimentação',
            valor: 150,
            dt_pagamento: null,
            tipo_movimento: 1
        },
    ]


    return(
    <ScreenWrapper>
        <View style={{ flex:1, paddingInline: 20, paddingBlock: 15 }}>
            <View>
                <Text style={styleContainer.dataResumo}>Agosto 2026</Text>
            </View>

            <View style={styleContainer.containerGeral}>

                {/* <View style={styleContainer.containerPendencias}>
                    <Text style={[styleContainer.containerTitle, {color: "#674600"}]}>Pendências</Text>
                </View> */}

                <View style={styleContainer.containerGanhos}>
                    <View style={styleContainer.containerTitle}>
                        <Text style={[styleContainer.textTitle, {color: "#1b6d00"}]}>
                            Ganhos
                        </Text>

                        <Text style={[styleContainer.textTitle, {color: "#1b6d00"}, {fontSize: 17}]}>
                            Total X
                        </Text>
                    </View>
                    
                    <View style={{ gap:17, paddingBottom: 6 }}>
                    {
                        exemploDados.map((dado) => {
                            
                            if (dado.tipo_movimento == 1)
                            return(
                            <View key={dado.id}
                            style={styleContainer.containerConteudo}
                            >
                                <Text style={styleContainer.textConteudo}>
                                    {dado.desc_movimentacao}
                                </Text>
                                <Text style={styleContainer.textConteudo}>
                                    R$ {String(dado.valor).replace('.', ',')}
                                </Text>
                            </View>
                        )}
                        )
                    }
                    </View>
                    
                    <Link href="/" style={styleContainer.textVerMais}>
                        Ver Mais
                    </Link>
                </View>

                <View style={styleContainer.containerGastos}>
                    <View style={styleContainer.containerTitle}>
                        <Text style={[styleContainer.textTitle, {color: "#7e0a00"}]}>
                            Gastos
                        </Text>

                        <Text style={[styleContainer.textTitle, {color: "#7e0a00"}, {fontSize: 17}]}>
                            Total X
                        </Text>
                    </View>

                    <View>

                    {
                        exemploDados.map((dado) => {
                            if (dado.tipo_movimento == 2)
                            return(
                            <View key={dado.id}
                            style={styleContainer.containerConteudo}
                            >
                                <Text style={styleContainer.textConteudo}>
                                    {dado.desc_movimentacao}
                                </Text>
                                <Text style={styleContainer.textConteudo}>
                                    {dado.valor}
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
    containerPendencias: {
        backgroundColor: '#e6ba5c',
        width: '100%',
        borderRadius: 12,
        padding: 15,
        rowGap: 20
    },
    containerGanhos: {
        backgroundColor: '#81e65c',
        width: '100%',
        borderRadius: 12,
        padding: 15,
        rowGap: 20
    },
    containerGastos: {
        backgroundColor: '#e6675c',
        width: '100%',
        borderRadius: 12,
        padding: 15,
        rowGap: 20
    },
    containerTitle: {
        justifyContent: "space-between",
        flexDirection: "row",
        paddingBottom: 5
    },
    textTitle: {
        fontWeight: "bold",
        fontSize: 23
    },
    containerConteudo: {
        justifyContent: "space-between",
        flexDirection: "row"
    },
    textConteudo: {
        alignSelf: "flex-start",
        fontWeight: 600,
        fontSize: 15
    },
    textVerMais: {
        fontWeight: "bold",
        fontSize: 18,
        justifyContent: "center",
        textAlign: "center",
        borderTopWidth: 2,
        borderColor: '#5ab539',
        paddingTop: 8,
        color: "#1b6d00"
    }
})