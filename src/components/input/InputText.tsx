import { TextInput, StyleSheet, TextInputProps } from "react-native"

export function InputText({...rest}: TextInputProps) {
    return(
        <TextInput style={style.campoEscrita} {...rest}/>
    )
}


const style = StyleSheet.create({
    campoEscrita: {
        // backgroundColor: "#05050505",
        width: "100%",
        height: 42,
        borderWidth: 1,
        borderColor: "#555555",
        borderRadius: 15,
        paddingLeft: 15,
        paddingRight: 10
    }
})