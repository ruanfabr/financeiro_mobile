import {
    StyleSheet,
    Text,
    TouchableHighlightProps,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";



export function ButtonComponent({label, ...rest}: ButtonProps) {

    return(
        <TouchableOpacity
        style={style.container}
        activeOpacity={0.8}
        {...rest}>
            <Text style={style.text}>{label}</Text>
        </TouchableOpacity>
    )
}


type ButtonProps = TouchableOpacityProps & {
    label: string
}

const style = StyleSheet.create({
    container: {
        padding: 2,
        paddingInline: 10,
        backgroundColor: "#34c946",
        borderRadius: 9,
        textAlign: "center",
        width: "100%"
    },
    text: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 17,
        padding: 5,
        paddingInline: 10
    }
})