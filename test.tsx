import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";

type Props = {
    onSelect: (tipo: 1 | 2) => void;
};

export function ActionMovimentacao({ onSelect }: Props) {
    const [aberto, setAberto] = useState(false);
    const progresso = useSharedValue(0); // 0 = fechado, 1 = aberto

    function alternar() {
        const novoValor = !aberto;
        setAberto(novoValor);
        progresso.value = withTiming(novoValor ? 1 : 0, { duration: 200 });
    }

    function selecionar(tipo: 1 | 2) {
        progresso.value = withTiming(0, { duration: 200 });
        setAberto(false);
        onSelect(tipo);
    }

    const estiloOpcoes = useAnimatedStyle(() => ({
        opacity: progresso.value,
        transform: [
            { translateY: (1 - progresso.value) * 20 }, // sobe 20px ao abrir
        ],
    }));

    return (
        <View style={styles.container} pointerEvents="box-none">
            <Animated.View style={[styles.opcoes, estiloOpcoes]} pointerEvents={aberto ? "auto" : "none"}>
                <Pressable style={[styles.opcao, { backgroundColor: "#81e65c" }]} onPress={() => selecionar(1)}>
                    <Text style={styles.opcaoTexto}>Ganho</Text>
                </Pressable>
                <Pressable style={[styles.opcao, { backgroundColor: "#e6675c" }]} onPress={() => selecionar(2)}>
                    <Text style={styles.opcaoTexto}>Gasto</Text>
                </Pressable>
            </Animated.View>

            <Pressable style={styles.botao} onPress={alternar}>
                <Ionicons name={aberto ? "close" : "add"} size={30} color="white" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { position: "absolute", right: 20, bottom: 30, alignItems: "center" },
    botao: {
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: "#2b6cff", alignItems: "center", justifyContent: "center",
        elevation: 6,
    },
    opcoes: { marginBottom: 12, gap: 10, alignItems: "flex-end" },
    opcao: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, elevation: 4 },
    opcaoTexto: { color: "white", fontWeight: "bold" },
});
