import { HeaderVoltar } from "@/components/HeaderVoltar";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import z from "zod";
import { fonts } from "@/theme/typography";
import { colors } from "@/theme/colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";


const categoriaSchema = z.object({
    descricao_categoria: z.string().min(3, "Pelo menos 3 caracteres"),
    tipo_movimentacao: z.number().max(1).nonnegative(), /*0 gasto, 1 ganho*/
    icone: z.string().nullish()
})

type Categorias = {
    id: number;
    descricao_categoria: string;
    tipo_movimentacao: 0 | 1;
    icone: string | null;
    criada_em: string;
}

type categoriaFormData = z.infer<typeof categoriaSchema>;

export default function Categorias() {
    const [listaCategoria, setListaCategoria] = useState<Categorias[]>([]);
    const db = useSQLiteContext();
    const {
        control,
        clearErrors,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<categoriaFormData>({
        resolver: zodResolver(categoriaSchema)
    })
    const { width } = useWindowDimensions()
    
    useFocusEffect(
        useCallback(() => {
            async function definindoListaCategoria(){
                const dataListaCategorias = await db.getAllAsync<Categorias>(
                    `
                    SELECT
                        id
                        ,descricao_categoria
                        ,tipo_movimentacao
                        ,icone
                        ,criada_em
                    FROM categorias
                    `
                )
                console.log(dataListaCategorias)
                setListaCategoria(dataListaCategorias)
            }
            definindoListaCategoria();
        }, [])
    )

    function visualListaVazia() {
        return (
            <View style={styleContainer.listaVaziaView}>
                <Text style={[styleContainer.listaVaziaText, {fontSize: width * 0.075}]}>
                    Não há nada
                </Text>
            </View>
        )
    }

    function cardCategoria() {
        return (
                listaCategoria.map((item) => {
                return (
                    <View>
                        <Text>
                            Em desenvolvimento
                            {item.id}
                        </Text>
                    </View>
                )
            })
        )
    }

    return (
        <ScreenWrapper>
        <View style={{ flex: 1, paddingInline: 13, paddingBlock: 15 }}>
            <HeaderVoltar titulo="Categorias"/>
        {
            listaCategoria && listaCategoria.length > 0?
            cardCategoria()
            :
            visualListaVazia()
        }

        <Pressable style={styleContainer.btAdicionarCategoria}>
            <FontAwesome6 name="plus" size={width * 0.06}/>
        </Pressable>

        </View>
        </ScreenWrapper>
    )
}

const styleContainer = StyleSheet.create({
    listaVaziaView: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    listaVaziaText: {
        color: colors.text,
        fontFamily: fonts.displayBold
    },

    btAdicionarCategoria: {
        backgroundColor: colors.background,
        paddingBlock: 7.5,
        paddingInline: 15
    }
})