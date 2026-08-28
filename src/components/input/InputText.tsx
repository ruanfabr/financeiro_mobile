import { useState } from "react"
import { TextInput, Text, View, StyleSheet, TextInputProps } from "react-native"
import { Controller, Control, FieldValues, Path, UseFormClearErrors } from "react-hook-form"
import { colors } from "@/theme/colors"
import { fonts } from "@/theme/typography"

interface ControllInputProps <T extends FieldValues> extends TextInputProps {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    error?: string;
    type?: "number" | "text";
    clearErrors?: UseFormClearErrors<T>;
}

export function InputText <T extends FieldValues>({
    control,
    name,
    label,
    error,
    type = "text",
    style,
    clearErrors,
    ...TextInputProps
    }: ControllInputProps<T>) {
    const [focado, setFocado] = useState(false)

    return(
        <View>
            <Text style={styleComponent.textLabel2}>
                {label}
            </Text>
            <Controller
            control={control}
            name={name}
            render={({ field: {onChange, onBlur, value} }) => (
                <TextInput
                style={[styleComponent.campoEscrita2, focado && styleComponent.campoEscritaFocado, style]}
                onFocus={() => setFocado(true)}
                onBlur={() => {
                    setFocado(false)
                    onBlur()
                }}
                onChangeText={(texto) => {
                    let valorOnchange: any = texto
                    if (texto === ""){
                        valorOnchange = null
                    }
                    else {
                        valorOnchange = texto
                    }

                    if (type == "text"){
                        onChange(valorOnchange)
                        if (error && clearErrors) clearErrors(name)
                        }
                    else if (type == "number"){
                        onChange(parseFloat(valorOnchange?.replaceAll(',', '.')))
                        if (error && clearErrors) clearErrors(name)
                    }
                }}
                value={value}
                {...TextInputProps}
                placeholderTextColor={colors.textFaint}
                />
            )}
            />

            {error && <Text style={styleComponent.errorText}>{error}</Text>}
        </View>
    )
}


const styleComponent = StyleSheet.create({
    textLabel2: {
        fontFamily: fonts.bodySemiBold,
        fontSize: 13.7,
        color: colors.textMuted,
        paddingLeft: 5,
        paddingBottom: 5
    },

    campoEscrita2: {
        height: 49,
        fontFamily: fonts.bodyMedium,
        fontSize: 16,
        color: colors.text,
        backgroundColor: colors.surface,
        paddingLeft: 12,
        paddingRight: 8,
        paddingBlock: 1,

        borderWidth: 1,
        borderRadius: 12,
        borderColor: colors.border,
    },

    campoEscritaFocado: {
        borderColor: colors.purple,
    },

    errorText: {
        fontFamily: fonts.bodyMedium,
        color: colors.error,
        paddingLeft: 6,
        paddingBlock: 2
    }
})