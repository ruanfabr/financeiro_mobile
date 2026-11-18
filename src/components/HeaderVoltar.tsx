import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useRouter } from "expo-router"
import { Pressable, useWindowDimensions } from "react-native";
import { View, Text, StyleSheet } from "react-native";



export function HeaderVoltar({ titulo, pressOpcoes }: { titulo: string, pressOpcoes?: () => void }) {
const {width} = useWindowDimensions()

    const router = useRouter();

    return (
        <View style={styleContainer.container}>
            <View style={styleContainer.linha}>
                <Pressable style={styleContainer.botaoVoltar} onPress={() => router.back()}>
                    <FontAwesome6 name="arrow-left" size={width * 0.05} color={colors.text}/>
                </Pressable>

                <Text style={styleContainer.titulo}>
                    {titulo}
                </Text>
            </View>

            {
                pressOpcoes? 
                <Pressable style={styleContainer.configPontos} onPress={pressOpcoes}>
                    <SimpleLineIcons name="options" size={width * 0.05} color="white" />
                </Pressable>
                :
                null
            }
        </View>
    )
}


const styleContainer = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingBlock: 8,
        justifyContent: "space-between"
    },

    linha: {
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        gap: 16
    },
    botaoVoltar: {
        // aspectRatio: 1,
        padding: 10,
        borderRadius: 10,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center"
    },
    titulo: {
        fontFamily: fonts.displayExtraBold,
        color: colors.text,
        fontSize: 24,
        letterSpacing:1.1
    },

    configPontos: {
        backgroundColor: colors.surface,
        padding: 10,
        borderRadius: 10,
        alignContent: "center",
        alignItems: "center",
    }
})