import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { View, Text, StyleSheet, Pressable } from "react-native";


interface propCheckBox {
    label: string,
    size?: number
}

export function InputCheckbox <T extends FieldValues>({ label, size = 22 }: propCheckBox){
    const [checked, setChecked] = useState(false)

    return (
        <Pressable style={styleContainer.linha} onPress={() => setChecked(!checked)}>
            <View
            style={[
                styleContainer.mainBox,
                {width: size, height: size, borderRadius: size * 0.32},
                checked && styleContainer.mainBoxCheck
            ]}
            >
                {checked && <FontAwesome6 name="check" size={size * 0.55} color={colors.white}/>}
            </View>

            <Text style={[styleContainer.texto, size?{fontSize: size * 0.69}:null]}>
                {label}
            </Text>
        </Pressable>
    )
}

const styleContainer = StyleSheet.create({
    linha: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 10,
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