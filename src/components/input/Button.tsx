import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";



export function ButtonComponent({label, variant = "purple", ...rest}: ButtonProps) {

    return(
        <TouchableOpacity
        style={[style.container, variantStyles[variant]]}
        activeOpacity={0.8}
        {...rest}>
            <Text style={style.text}>{label}</Text>
        </TouchableOpacity>
    )
}


type ButtonProps = TouchableOpacityProps & {
    label: string;
    variant?: "purple" | "green" | "red";
}

const style = StyleSheet.create({
    container: {
        padding: 6,
        paddingInline: 10,
        borderRadius: 12,
        textAlign: "center",
        width: "100%"
    },
    text: {
        fontFamily: fonts.bodyBold,
        textAlign: "center",
        fontSize: 16,
        color: colors.white,
        padding: 5,
        paddingInline: 10
    }
})

const variantStyles = StyleSheet.create({
    purple: {
        backgroundColor: colors.purple,
    },
    green: {
        backgroundColor: colors.green,
    },
    red: {
        backgroundColor: colors.red,
    },
})
