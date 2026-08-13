import { TextInput, Text, View, StyleSheet, TextInputProps } from "react-native"
import { Controller, Control, FieldValues, Path, UseFormClearErrors } from "react-hook-form"

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
    return(
        <View>
            <Controller
            control={control}
            name={name}
            render={({ field: {onChange, onBlur, value} }) => (
                <TextInput 
                style={[styleComponent.campoEscrita, style]}
                onBlur={onBlur}
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
                />
            )}
            />

            {error && <Text style={styleComponent.errorText}>{error}</Text>}
        </View>
    )
}


const styleComponent = StyleSheet.create({
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