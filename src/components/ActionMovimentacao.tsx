import { useState } from "react";
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated'
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";


export function ActionMovimentacao(){
    const { width } = useWindowDimensions()
    const router = useRouter()

    const [actionAberto, setActionAberto] = useState(false)
    const progress = useSharedValue(0)

    const abrindoAction = () => {
        setActionAberto(!actionAberto)
        progress.value = withTiming(!actionAberto ? 1 : 0, { duration: 200 });
    }
    
    const pushRota = (rota: '/gerandoGanho' | '/gerandoGasto' | '/categorias' ) => {
        setActionAberto(false)
        progress.value = 0
        router.push(rota)
    }

    const estiloOpcoes = useAnimatedStyle(() => ({
        opacity: progress.value,
        transform: [
            { translateY: (1 - progress.value) * 20 }, // sobe 20px ao abrir
        ],
    }))

    
    return(
        <>
        {actionAberto && (
            <Pressable style={StyleSheet.absoluteFill} onPress={abrindoAction}/>
        )}
        <View style={styleContainer.containerPrincipal}>
            <Animated.View style={[styleContainer.opcoes, estiloOpcoes]} pointerEvents={actionAberto ? "auto" : "none"}>
                <Pressable
                onPress={() => pushRota('/gerandoGanho')}
                style={[styleContainer.opcaoBotao, {backgroundColor:colors.green}]}
                >
                    <Text style={[styleContainer.textOpcoes, {fontSize: width * 0.043}]}>Gerar Ganho</Text>
                </Pressable>

                <Pressable
                onPress={() => {pushRota('/gerandoGasto')}}
                style={[styleContainer.opcaoBotao, {backgroundColor:colors.red}]}
                >
                    <Text style={[styleContainer.textOpcoes, {fontSize: width * 0.043}]}>Gerar Gasto</Text>
                </Pressable>

                <Pressable
                onPress={() => {pushRota('/categorias')}}
                style={[styleContainer.opcaoBotao, {backgroundColor:'#5732be'}]}
                >
                    <Text style={[styleContainer.textOpcoes, {fontSize: width * 0.043}]}>Categorias</Text>
                </Pressable>
            </Animated.View>

            <Pressable style={styleContainer.imgCentral} onPress={abrindoAction}>
                <FontAwesome6 name={actionAberto ? "xmark" : "dollar-sign"} color={colors.white} size={width * 0.07}/>
            </Pressable>
        </View>
        </>
    )
}

const styleContainer = StyleSheet.create({
    containerPrincipal: {
        position: 'absolute',
        bottom: 20,
        right: 18,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: 150
    },
    imgCentral: {
        backgroundColor: colors.purple,
        borderRadius: 100,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        aspectRatio: 1,
        shadowColor: colors.purple,
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6
    },
    opcoes: {
        marginBottom: 12,
        alignItems: "flex-end",
        gap: 15
    },
    opcaoBotao: {
        paddingInline: 15,
        paddingBlock: 7.5,
        borderRadius: 100
    },
    textOpcoes: {
        fontFamily: fonts.bodyBold,
        fontSize: 13,
        color: colors.white
    }
})