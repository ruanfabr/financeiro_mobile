import { useState } from "react";
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated'


export function ActionMovimentacao(){
    const { width } = useWindowDimensions()

    const [actionAberto, setActionAberto] = useState(false)
    const progress = useSharedValue(0)

    const abrindoAction = () => {
        setActionAberto(!actionAberto)
        progress.value = withTiming(actionAberto ? 1 : 0, { duration: 200 });
    }

    const estiloOpcoes = useAnimatedStyle(() => ({
        opacity: progress.value,
        transform: [
            { translateY: (1 - progress.value) * 20 }, // sobe 20px ao abrir
        ],
    }))

    
    return(
        <View style={styleContainer.containerPrincipal}>
            <Animated.View style={[styleContainer.opcoes, estiloOpcoes]} pointerEvents={actionAberto ? "auto" : "none"}>
                <Pressable onPress={() => console.log('Gerando ganho')}>
                    <Text style={[styleContainer.textOpcoes, {fontSize: width * 0.05}]}>Gerar Ganho</Text>
                </Pressable>

                <Pressable onPress={() => console.log('Gerando gasto')}>
                    <Text style={[styleContainer.textOpcoes, {fontSize: width * 0.05}]}>Gerar Gasto</Text>
                </Pressable>
            </Animated.View>

            <Pressable style={styleContainer.imgCentral} onPress={abrindoAction}>
                <MaterialIcons name={actionAberto ? "attach-money" : "close"} color="black" size={width * 0.1} style={styleContainer.iconeCentral}/>
            </Pressable>
        </View>
    )
}

const styleContainer = StyleSheet.create({
    containerPrincipal: {
        position: 'absolute',
        bottom: 20,
        right: 18,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: '40%',
        // aspectRatio: 1,
        // backgroundColor: 'green'
    },
    imgCentral: {
        backgroundColor: "#979797",
        borderRadius: 100,
        width: '40%',
        // height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1
    },
    iconeCentral: {
        // backgroundColor: 'purple'
        left: 1.5
    },
    opcoes: {
        marginBottom: 12,
        alignItems: "center",
        backgroundColor: 'gray',
        paddingInline: 15,
        paddingBlock: 18,
        gap: 22,
        borderRadius: 20
    },
    textOpcoes: {
        fontWeight: '600'
        // paddingBlock: 8,
        // paddingInline: 15,
    }
})