import { 
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from "react-native"
import { InputText } from "@/components/input/InputText"

export default function Index(){
    return(
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS == 'ios' ? 64 : 0}
    >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                <View style={style.viewNormal}>
                <Text style={style.title}>Eae</Text>

                    <View style={style.formularioLogin}>
                        <InputText placeholder="E-mail" keyboardType="email-address"/>
                        <InputText placeholder="Senha" secureTextEntry/>
                    </View>

                </View>
                
            </ScrollView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    )
}


const style = StyleSheet.create({
    viewNormal: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#FDFDFD",
        padding:32,
        gap: 40
    },
    formularioLogin: {
        // backgroundColor: "#789895",
        gap: 15
    },
    title: {
        fontSize:18,
        fontWeight: 'bold'
    }
})