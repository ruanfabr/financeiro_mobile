import { ButtonComponent } from '@/components/Button'
import { InputText } from '@/components/input/InputText'
import { ScreenWrapper } from '@/components/ScreenWrapper'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { View, Text, StyleSheet } from 'react-native'
import z from 'zod'


const movimentoGanhoSchema = z.object({
    tituloMovimentacao: z.string().min(3, 'Pelo menos 3 caracteres'),
    valorMovimentacao: z.number().min(0.01, 'Valor inválido').nonnegative(),
    descricaoMovimentacao: z.string().min(5, 'Precisa de no mínimo 5 caracteres').nullable(),
    // dataMovimentacao: z.date()
    dataMovimentacao: z.string() // PARA VIÉS DE TESTE, DESABILITAR DEPOIS
})

type movimentoGanhoFormData = z.infer<typeof movimentoGanhoSchema>;

export default function GerandoGanho(){

    const {
        control,
        clearErrors,
        handleSubmit,
        formState: {errors}
    } = useForm<movimentoGanhoFormData>({
        resolver: zodResolver(movimentoGanhoSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    })

    function salvarMovimentacao(data: movimentoGanhoFormData) {
        console.log(data)
    }

    return(
        <ScreenWrapper>
            <View style={{ flex:1, paddingInline: 13, paddingBlock: 15 }}>
                <Text>
                Gerando Ganho
                </Text>

                <View style={styleContainer.containerDadosPrincipais}>
                    <InputText
                    control={control}
                    name='tituloMovimentacao'
                    label='Titulo'
                    placeholder='Titulo da movimentação'
                    error={errors.tituloMovimentacao?.message}
                    />
                    
                    <InputText
                    control={control}
                    name='valorMovimentacao'
                    label='Valor'
                    keyboardType='numeric'
                    type='number'
                    placeholder='Valor'
                    error={errors.valorMovimentacao?.message}
                    />

                    <InputText
                    control={control}
                    name='descricaoMovimentacao'
                    label='Descrição'
                    placeholder='Descrição (opcional)'
                    error={errors.descricaoMovimentacao?.message}
                    />

                    <InputText
                    control={control}
                    name='dataMovimentacao'
                    label='Data efetuada'
                    placeholder='Data efetuada'
                    error={errors.dataMovimentacao?.message}
                    />
                </View>

                <ButtonComponent
                label='Salvar'
                onPress={handleSubmit(salvarMovimentacao)}
                />
            </View>
        </ScreenWrapper>
    )
}


const styleContainer = StyleSheet.create({
    containerDadosPrincipais: {
        gap: 20
    }
})