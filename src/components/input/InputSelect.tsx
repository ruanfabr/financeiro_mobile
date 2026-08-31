import { useCallback, useMemo, useRef } from "react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { Controller, Control, FieldValues, Path, UseFormClearErrors } from "react-hook-form"
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView, BottomSheetBackdropProps } from "@gorhom/bottom-sheet"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import { colors } from "@/theme/colors"
import { fonts } from "@/theme/typography"

type Opcao = {
    label: string
    value: string | number
    icone?: string
}

interface InputSelectProps <T extends FieldValues> {
    control: Control<T>
    name: Path<T>
    label?: string
    error?: string
    clearErrors?: UseFormClearErrors<T>
    titulo: string
    opcoes: Opcao[]
}

export function InputSelect <T extends FieldValues>({
    control,
    name,
    label,
    error,
    clearErrors,
    titulo,
    opcoes,
    }: InputSelectProps<T>) {
    const sheetRef = useRef<BottomSheetModal>(null)
    const snapPoints = useMemo(() => ["55%"], [])

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

    return (
        <View>
            <Text style={styleComponent.textLabel}>{label}</Text>

            <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => {
                const selecionado = opcoes.find((opcao) => opcao.value === value)

                return (
                    <>
                    <Pressable style={styleComponent.campo} onPress={() => sheetRef.current?.present()}>
                        {selecionado ? (
                            <View style={styleComponent.escolhido}>
                                {selecionado.icone && (
                                    <FontAwesome6 name={selecionado.icone} size={18} color={colors.purple} />
                                )}
                                <Text style={styleComponent.textoValor}>{selecionado.label}</Text>
                            </View>
                        ) : (
                            <Text style={styleComponent.textoPlaceholder}>Selecionar</Text>
                        )}
                        <FontAwesome6 name="chevron-down" size={12} color={colors.textMuted} />
                    </Pressable>

                    <BottomSheetModal
                    ref={sheetRef}
                    snapPoints={snapPoints}
                    backdropComponent={renderBackdrop}
                    backgroundStyle={styleComponent.sheetBg}
                    handleIndicatorStyle={styleComponent.handle}
                    >
                        <BottomSheetView style={styleComponent.sheetContent}>
                            <Text style={styleComponent.sheetTitulo}>{titulo}</Text>

                            {opcoes.map((opcao) => {
                                const ativo = opcao.value === value

                                return (
                                    <Pressable
                                    key={opcao.value}
                                    style={[styleComponent.opcaoRow, ativo && styleComponent.opcaoRowAtiva]}
                                    onPress={() => {
                                        onChange(opcao.value)
                                        if (error && clearErrors) clearErrors(name)
                                        sheetRef.current?.dismiss()
                                    }}
                                    >
                                        <View style={styleComponent.opcaoEsquerda}>
                                            {opcao.icone && (
                                                <View style={styleComponent.opcaoIcone}>
                                                    <FontAwesome6 name={opcao.icone} size={16} color={colors.purple} />
                                                </View>
                                            )}
                                            <Text style={[styleComponent.opcaoTexto, ativo && styleComponent.opcaoTextoAtivo]}>
                                                {opcao.label}
                                            </Text>
                                        </View>

                                        {ativo && <FontAwesome6 name="check" size={16} color={colors.purple} />}
                                    </Pressable>
                                )
                            })}
                        </BottomSheetView>
                    </BottomSheetModal>
                    </>
                )
            }}
            />

            {error && <Text style={styleComponent.errorText}>{error}</Text>}
        </View>
    )
}

const styleComponent = StyleSheet.create({
    textLabel: {
        fontFamily: fonts.bodySemiBold,
        fontSize: 13.7,
        color: colors.textMuted,
        paddingLeft: 5,
        paddingBottom: 5
    },

    campo: {
        height: 49,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.surface,
        paddingInline: 12,

        borderWidth: 1,
        borderRadius: 12,
        borderColor: colors.border,
    },

    escolhido: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    textoValor: {
        fontFamily: fonts.bodyBold,
        fontSize: 16,
        color: colors.text,
    },

    textoPlaceholder: {
        fontFamily: fonts.bodyMedium,
        fontSize: 16,
        color: colors.textFaint,
    },

    sheetBg: {
        backgroundColor: colors.surface,
    },

    handle: {
        backgroundColor: colors.border,
        width: 40,
    },

    sheetContent: {
        paddingInline: 18,
        paddingBottom: 24,
    },

    sheetTitulo: {
        fontFamily: fonts.displaySemiBold,
        fontSize: 18.5,
        color: colors.text,
        marginBottom: 8,
    },

    opcaoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBlock: 13,
        paddingInline: 12,
        borderRadius: 10,
    },

    opcaoRowAtiva: {
        backgroundColor: colors.purpleSoft,
        paddingInline: 12
    },

    opcaoEsquerda: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    opcaoIcone: {
        width: 35,
        height: 35,
        borderRadius: 9,
        backgroundColor: colors.purpleSoft,
        alignItems: "center",
        justifyContent: "center",
    },

    opcaoTexto: {
        fontFamily: fonts.bodySemiBold,
        fontSize: 15.5,
        color: colors.text,
    },

    opcaoTextoAtivo: {
        color: colors.purple,
        fontFamily: fonts.bodyBold,
    },

    errorText: {
        fontFamily: fonts.bodyMedium,
        color: colors.error,
        paddingLeft: 6,
        paddingBlock: 2
    }
})
