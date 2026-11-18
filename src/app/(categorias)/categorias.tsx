import { HeaderVoltar } from "@/components/HeaderVoltar";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import z from "zod";
import { fonts } from "@/theme/typography";
import { colors } from "@/theme/colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";


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
    const [listaCategorias, setListaCategoria] = useState<Categorias[]>([]);
    const db = useSQLiteContext();
    
    const sheetRef = useRef<BottomSheetModal>(null)
    const snapPoints = useMemo(() => ["24.4%"], [])
    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            opacity={0.55}
            pressBehavior="close"
            />
        ),
        []
    )

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
                setListaCategorias(dataListaCategorias)
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
                listaCategorias.map((item) => {
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

    function clickAdicionarCategoria() {
        console.log('adicionei categoria')
    }

    return (
        <ScreenWrapper>
        <View style={{ flex: 1, paddingInline: 15, paddingBlock: 15 }}>
            <HeaderVoltar titulo="Categorias" pressOpcoes={() => sheetRef.current?.present()}/>
        {
            listaCategorias && listaCategorias.length > 0?
            cardCategoria()
            :
            visualListaVazia()
        }

        {/* <Pressable style={styleContainer.btAdicionarCategoria}>
            <FontAwesome6 name="plus" color={colors.white} size={width * 0.06}/>
        </Pressable> */}

        </View>

        {upModal()}
        </ScreenWrapper>
    )

    function upModal(){
        return (
            <BottomSheetModal
            ref={sheetRef}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enableOverDrag={false}
            enableDynamicSizing={false}
            backgroundStyle={{backgroundColor: colors.surface}}
            handleIndicatorStyle={{backgroundColor: colors.border,
                width: 40
            }}
            >
                <BottomSheetView
                style={{paddingInline: 24,paddingBottom: 45, paddingTop: 20, gap: 35}}
                >
                    <Pressable onPress={() => {console.log('oi')}}>
                        <Text>
                            oi
                        </Text>
                    </Pressable>
                </BottomSheetView>
            </BottomSheetModal>
        )
    }
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
        backgroundColor: colors.purple,
        paddingBlock: 9,
        paddingInline: 15,
        alignContent: 'center',
        justifyContent: 'center',
        aspectRatio: 1,
        elevation: 6
    },

    viewBtCategoria: {
        position: 'absolute',
        bottom: 20,
        right: 18,
    }
})