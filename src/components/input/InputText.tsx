import { TextInput, Text, View, StyleSheet, TextInputProps } from "react-native"
import { Controller, Control, FieldValues, Path, UseFormClearErrors } from "react-hook-form"
import { useState } from "react";
import { fonts } from "@/theme/typography";
import { colors } from "@/theme/colors";

function formatarReal(valor: number | null) {
    return valor?.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

interface ControllInputProps <T extends FieldValues> extends TextInputProps {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    error?: string;
    type?: "number" | "text" | "real";
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

    function tipoTexto (type: string, valor: string) {
        if (type == "text"){
            // onChange(valorOnchange)
            if (error && clearErrors) clearErrors(name)
            return valor    
            }
        else if (type == "number"){
            // onChange(parseFloat(valorOnchange?.replaceAll(',', '.')))
            
            if (error && clearErrors) clearErrors(name)
            return parseFloat(valor?.replaceAll(',', '.'))
            }
        else if (type == "real"){
            const digitos = valor.replace(/\D/g, "")
            const centavos = digitos ? parseInt(digitos, 10) : 0
            // onChange(centavos / 100)
            if (error && clearErrors) clearErrors(name)
            return centavos / 100
        }
    }

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
                style={[styleComponent.campoEscrita2, focado && styleComponent.focusCampoEscrita, style]}
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
                    onChange(tipoTexto(type, valorOnchange))
                }}
                value={type == "real" ? formatarReal(value ?? null) : value}
                {...TextInputProps}
                placeholderTextColor={"#7e7e7e"}
                />
            )}
            />

            {error && <Text style={styleComponent.errorText}>{error}</Text>}
        </View>
    )
}


const styleComponent = StyleSheet.create({
    textLabel1: {
        fontFamily: fonts.bodySemiBold,
        fontSize: 13,
        fontWeight: "500",
        paddingTop: 7,
        paddingInline: 8,

        borderTopWidth: 1,
        borderStartWidth: 1,
        borderEndWidth: 1,

        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderColor: "#555555",
    },

    campoEscrita1: {
        // backgroundColor: "#05050505",
        // width: "100%",
        height: 47,
        paddingLeft: 12,
        paddingRight: 8,
        
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        borderColor: "#555555",
    },

    textLabel2: {
        fontFamily: fonts.bodySemiBold,
        fontSize: 13.7,
        fontWeight: "500",

        color: colors.textMuted,

        paddingLeft: 5,
        paddingBottom: 5
    },

    campoEscrita2: {
        fontFamily: fonts.bodyMedium,
        height: 49,
        fontSize: 16,
        paddingLeft: 12,
        paddingRight: 8,
        paddingBlock: 1,
        
        color: colors.text,
        backgroundColor: colors.surface,

        borderWidth: 1,
        borderRadius: 12,
        borderColor: colors.border,
    },

    focusCampoEscrita: {
        borderColor: colors.purple
    },

    errorText: {
        fontFamily: fonts.bodyMedium,
        color: colors.error,
        paddingLeft: 6,
        paddingBlock: 2
    }
})