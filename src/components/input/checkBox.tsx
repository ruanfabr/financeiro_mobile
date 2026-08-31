import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { View, Text, StyleSheet, Pressable } from "react-native";


export function InputCheckbox <T extends FieldValues>({ label }: {label: string}){
    const [checked, setChecked] = useState(false)

    return (
        <Pressable style={styleContainer.linha} onPress={() => setChecked(!checked)}>
            <View style={[styleContainer.mainBox, checked && styleContainer.mainBoxCheck]}>
                {checked && <FontAwesome6 name="check" size={12} color={colors.white}/>}
            </View>

            <Text style={styleContainer.texto}>
                {label}
            </Text>
        </Pressable>
    )
}

const styleContainer = StyleSheet.create({
    linha: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    mainBox: {
        width: 22,
        height: 22,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
    },
    mainBoxCheck: {
        backgroundColor: colors.purple,
        borderColor: colors.purple
    },
    texto: {
        fontFamily: fonts.bodySemiBold,
        fontSize: 14.5,
        color: colors.text,
    }
})