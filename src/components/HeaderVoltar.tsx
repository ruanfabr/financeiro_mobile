import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

export function HeaderVoltar({ titulo }: { titulo: string }) {
    const router = useRouter();

    return (
        <View style={styleContainer.linha}>
            <Pressable style={styleContainer.botaoVoltar} onPress={() => router.back()}>
                <FontAwesome6 name="arrow-left" size={16} color={colors.text} />
            </Pressable>

            <Text style={styleContainer.titulo}>{titulo}</Text>
        </View>
    )
}

const styleContainer = StyleSheet.create({
    linha: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingBlock: 8,
    },
    botaoVoltar: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
    },
    titulo: {
        fontFamily: fonts.displayBold,
        color: colors.text,
        fontSize: 24,
    },
})
