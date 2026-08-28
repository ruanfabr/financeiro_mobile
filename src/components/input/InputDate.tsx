import { useState } from "react"
import { Pressable, Text, View, StyleSheet } from "react-native"
import { Controller, Control, FieldValues, Path, UseFormClearErrors } from "react-hook-form"
import DateTimePicker from "@react-native-community/datetimepicker"
import { colors } from "@/theme/colors"
import { fonts } from "@/theme/typography"

interface InputDateProps <T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    error?: string;
    clearErrors?: UseFormClearErrors<T>;
}

function paraIso(data: Date) {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, "0")
    const dia = String(data.getDate()).padStart(2, "0")
    return `${ano}-${mes}-${dia}`
}

function paraBr(dataIso: string) {
    const [ano, mes, dia] = dataIso.split("-")
    return `${dia}/${mes}/${ano}`
}

export function InputDate <T extends FieldValues>({
    control,
    name,
    label,
    error,
    clearErrors,
    }: InputDateProps<T>) {
    const [mostrarPicker, setMostrarPicker] = useState(false)

    return(
        <View>
            <Text style={styleComponent.textLabel}>
                {label}
            </Text>
            <Controller
            control={control}
            name={name}
            render={({ field: {onChange, value} }) => (
                <>
                <Pressable
                style={[styleComponent.campo, mostrarPicker && styleComponent.campoFocado]}
                onPress={() => setMostrarPicker(true)}
                >
                    <Text style={value ? styleComponent.textoValor : styleComponent.textoPlaceholder}>
                        {value ? paraBr(value) : "Selecionar data"}
                    </Text>
                </Pressable>

                {mostrarPicker && (
                    <DateTimePicker
                    value={value ? new Date(`${value}T00:00:00`) : new Date()}
                    mode="date"
                    onChange={(_evento, dataSelecionada) => {
                        setMostrarPicker(false)
                        if (dataSelecionada) {
                            onChange(paraIso(dataSelecionada))
                            if (error && clearErrors) clearErrors(name)
                        }
                    }}
                    />
                )}
                </>
            )}
            />

            {error && <Text style={styleComponent.errorText}>{error}</Text>}
        </View>
    )
}

const styleComponent = StyleSheet.create({
    textLabel: {
        fontFamily: fonts.bodySemiBold,
        fontSize: 13.7,
        color: colors.textMuted,
        paddingLeft: 5,
        paddingBottom: 5
    },

    campo: {
        height: 49,
        justifyContent: "center",
        backgroundColor: colors.surface,
        paddingInline: 12,

        borderWidth: 1,
        borderRadius: 12,
        borderColor: colors.border,
    },

    campoFocado: {
        borderColor: colors.purple,
    },

    textoValor: {
        fontFamily: fonts.bodyMedium,
        fontSize: 16,
        color: colors.text,
    },

    textoPlaceholder: {
        fontFamily: fonts.bodyMedium,
        fontSize: 16,
        color: colors.textFaint,
    },

    errorText: {
        fontFamily: fonts.bodyMedium,
        color: colors.error,
        paddingLeft: 6,
        paddingBlock: 2
    }
})
