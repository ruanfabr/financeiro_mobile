import { TextInput, Text, View, StyleSheet, TextInputProps } from "react-native"
import { Controller, Control, FieldValues, Path, UseFormClearErrors } from "react-hook-form"

interface ControllInputProps <T extends FieldValues> extends TextInputProps {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    error?: string;
    clearErrors?: UseFormClearErrors<T>;
}

export function InputText <T extends FieldValues>({
    control,
    name,
    label,
    error,
    clearErrors,
    ...TextInputProps
    }: ControllInputProps<T>) {
    return(
        <View>
            <Controller
            control={control}
            name={name}
            render={({ field: {onChange, onBlur, value} }) => (
                <TextInput 
                style={style.campoEscrita}
                onBlur={onBlur}
                onChangeText={(texto) => {
                    onChange(texto)
                    if (error && clearErrors) clearErrors(name)
                }}
                value={value}
                {...TextInputProps}
                />
            )}
            />

            {error && <Text style={style.errorText}>{error}</Text>}
        </View>
    )
}


const style = StyleSheet.create({
    campoEscrita: {
        // backgroundColor: "#05050505",
        width: "100%",
        height: 42,
        borderWidth: 1,
        borderColor: "#555555",
        borderRadius: 7,
        paddingLeft: 15,
        paddingRight: 10
    },

    errorText: {
        color: '#e65045',
        paddingLeft: 6,
        paddingBlock: 2
    }
})