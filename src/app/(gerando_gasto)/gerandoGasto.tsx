import { ButtonComponent } from "@/components/input/Button";
import { InputText } from "@/components/input/InputText";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSQLiteContext } from "expo-sqlite";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import z from "zod";

const movimentoGastoSchema = z.object({
  tituloMovimentacao: z.string().min(3, "Pelo menos 3 caracteres"),
  valorMovimentacao: z.number().min(0.01, "Valor inválido").nonnegative(),
  descricaoMovimentacao: z.string(),
  // dataMovimentacao: z.date()
  dataMovimentacao: z.string(), // PARA VIÉS DE TESTE, DESABILITAR DEPOIS
});

type movimentoGastoFormData = z.infer<typeof movimentoGastoSchema>;

export default function GerandoGasto() {
  const db = useSQLiteContext();

  const {
    control,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<movimentoGastoFormData>({
    resolver: zodResolver(movimentoGastoSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  async function salvarMovimentacao(data: movimentoGastoFormData) {
    console.log(data);
    await db.runAsync(
      `
            INSERT INTO movimentacoes (
            titulo,
            valor,
            descricao,
            data_emitida,
            tipo_movimentacao,
            icone
            )
            values
            (
            ?,?,?,?,?,?
            )
            `,
      data.tituloMovimentacao,
      data.valorMovimentacao,
      data.descricaoMovimentacao,
      data.dataMovimentacao,
      2,
      null,
    );
  }

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, paddingInline: 13, paddingBlock: 15 }}>
        <Text>Gerando Gasto</Text>

        <View style={styleContainer.conteudoPagina}>
          <View style={styleContainer.containerDadosPrincipais}>
            <InputText
              control={control}
              name="tituloMovimentacao"
              label="Titulo"
              clearErrors={clearErrors}
              placeholder="Titulo da movimentação"
              error={errors.tituloMovimentacao?.message}
            />

            <InputText
              control={control}
              name="valorMovimentacao"
              label="Valor"
              clearErrors={clearErrors}
              keyboardType="numeric"
              type="real"
              placeholder="Valor"
              error={errors.valorMovimentacao?.message}
            />

            <InputText
              control={control}
              name="descricaoMovimentacao"
              label="Descrição"
              clearErrors={clearErrors}
              placeholder="Descrição (opcional)"
              error={errors.descricaoMovimentacao?.message}
            />

            <InputText
              control={control}
              name="dataMovimentacao"
              label="Data efetuada"
              clearErrors={clearErrors}
              placeholder="Data efetuada"
              error={errors.dataMovimentacao?.message}
            />
          </View>

          <View style={styleContainer.botaoSalvar}>
            <ButtonComponent
              label="Salvar"
              onPress={handleSubmit(salvarMovimentacao)}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styleContainer = StyleSheet.create({
  conteudoPagina: {
    flex: 1,
    justifyContent: "space-between",
  },
  containerDadosPrincipais: {
    gap: 20,
  },

  botaoSalvar: {
    // alignSelf: 'flex-end',
  },
});
