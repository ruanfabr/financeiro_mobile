import { HeaderVoltar } from "@/components/HeaderVoltar";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { View, Text } from "react-native";




export default function CriarCategoria() {

    return(
        <ScreenWrapper>
        <View style={{ flex: 1, paddingInline: 15, paddingBlock: 15 }}>
        <HeaderVoltar titulo="Criar Categoria"/>
            <View>
                <Text>
                    oi
                </Text>
            </View>
        </View>
        </ScreenWrapper>
    )
}