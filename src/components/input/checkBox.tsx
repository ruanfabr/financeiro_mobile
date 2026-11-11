import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import { Controller, FieldValues, Control, Path } from "react-hook-form";
import { View, Text, StyleSheet, Pressable } from "react-native";


interface propCheckBox <T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    size?: number;
}

export function InputCheckbox <T extends FieldValues>({ control, name, label, size = 22 }: propCheckBox<T>){

    return (
        <Controller
        control={control}
        name={name}
        render={({ field: {onChange, onBlur, value}}) => (
        <Pressable style={styleContainer.linha} onPress={() => {
            onChange(value == 1? 0:1)
            console.log(value)
            }}>
            <View
            style={[
                styleContainer.mainBox,
                {width: size, height: size, borderRadius: size * 0.32},
                value == 1 && styleContainer.mainBoxCheck
            ]}
            >
                {value == 1 && <FontAwesome6 name="check" size={size * 0.55} color={colors.white}/>}
            </View>

            <Text style={[styleContainer.texto, size?{fontSize: size * 0.69}:null]}>
                {label}
            </Text>
        </Pressable>
        )}
        />
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