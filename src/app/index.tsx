import { View, Text, StyleSheet } from "react-native"

export default function Index(){
    return(
        <View style={style.container}>
        <Text style={style.title}>Eae</Text>
        </View>
    )
}


const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#FDFDFD",
        padding:32
    },
    title: {
        fontSize:18,
        fontWeight: 'bold'
    }
})