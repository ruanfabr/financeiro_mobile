import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { View, Text, Pressable, StyleSheet } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";


export function InputCheckbox <T extends FieldValues>({ label }: { label: string }){
    const [checked, setChecked] = useState(false)

    return (
        <Pressable style={styleContainer.linha} onPress={() => setChecked(!checked)}>
            <View style={[styleContainer.caixa, checked && styleContainer.caixaMarcada]}>
                {checked && <FontAwesome6 name="check" size={12} color={colors.white} />}
            </View>

            <Text style={styleContainer.texto}>{label}</Text>
        </Pressable>
    )
}

const styleContainer = StyleSheet.create({
    linha: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    caixa: {
        width: 22,
        height: 22,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
    },
    caixaMarcada: {
        backgroundColor: colors.purple,
        borderColor: colors.purple,
    },
    texto: {
        fontFamily: fonts.bodySemiBold,
        fontSize: 14.5,
        color: colors.text,
    }
})
