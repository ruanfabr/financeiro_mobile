import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { View, Text, StyleSheet } from "react-native";


export function InputCheckbox <T extends FieldValues>(){
    const [checked, setChecked] = useState(false)

    return (
        <View style={styleContainer.mainBox}>
            <View style={styleContainer.containerBox}>

            <Text>oi teste</Text>
            </View>
        </View>
    )
}

const styleContainer = StyleSheet.create({
    mainBox: {
        // width: '10%',
        // aspectRatio: 1,
        backgroundColor: 'purple',
        paddingBlock: 5
    },
    containerBox: {
        // width: '100%',

        backgroundColor: 'white',
        // aspectRatio: 0,
        padding: 5,
        alignSelf: 'flex-start',
        paddingInline: 8,

        justifyContent:'center',
        alignItems: 'center'
    }
})