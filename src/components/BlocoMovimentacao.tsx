import { View, Text, StyleSheet } from "react-native"


export function BlocoMovimentacao() {

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
        <View style={styleContainer.containerGanhos}>
            <Text style={[styleContainer.containerTitle, {color: "#1b6d00"}]}>Ganhos</Text>
            
            {
                exemploDados.map((dado) => {
                    
                    if (dado.tipo_movimento == 1)
                    return(
                    <View key={dado.id}>
                        <Text>
                            {dado.desc_movimentacao}
                        </Text>
                    </View>
                )}
                )
            }
        </View>
    )
}


const styleContainer = StyleSheet.create({
    containerGeral: {
        paddingInline: 20,
        paddingBlock: 20,
        gap: 25
    },
    containerPendencias: {
        backgroundColor: '#e6ba5c',
        width: '100%',
        borderRadius: 12,
        padding: 15
    },
    containerGanhos: {
        backgroundColor: '#81e65c',
        width: '100%',
        borderRadius: 12,
        padding: 15
    },
    containerGastos: {
        backgroundColor: '#e6675c',
        width: '100%',
        borderRadius: 12,
        padding: 15
    },
    containerTitle: {
        fontWeight: "bold",
        fontSize: 19
    }
})