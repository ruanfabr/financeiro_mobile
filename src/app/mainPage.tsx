import { ScreenWrapper } from "@/components/ScreenWrapper";
import { View, Text } from "react-native";



export default function MainPage(){


    return(
    <ScreenWrapper>
        <View style={{ flex:1 , backgroundColor:"red"}}>
            <View>
                <Text>Olá </Text>
            </View>
        </View>
    </ScreenWrapper>
    )
}