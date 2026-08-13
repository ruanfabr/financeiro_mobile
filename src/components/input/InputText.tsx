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
            <Text style={styleComponent.textLabel2}>
                {label}
            </Text>
            <Controller
            control={control}
            name={name}
            render={({ field: {onChange, onBlur, value} }) => (
                <TextInput 
                style={[styleComponent.campoEscrita2, style]}
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
        height: 42,
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
        fontSize: 13,
        fontWeight: "500",
        paddingLeft: 5,
        paddingBottom: 5
    },

    campoEscrita2: {
        // backgroundColor: "#05050505",
        // width: "100%",
        height: 44,
        paddingLeft: 12,
        paddingRight: 8,
        paddingBlock: 1,
        
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "#555555",
    },

    errorText: {
        color: '#e65045',
        paddingLeft: 6,
        paddingBlock: 2
    }
})