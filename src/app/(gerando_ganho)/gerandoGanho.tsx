import { ButtonComponent } from "@/components/input/Button";
import { InputText } from "@/components/input/InputText";
import { InputDate } from "@/components/input/InputDate";
import { InputCheckbox } from "@/components/input/checkBox";
import { HeaderVoltar } from "@/components/HeaderVoltar";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSQLiteContext } from "expo-sqlite";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import z from "zod";

const movimentoGanhoSchema = z.object({
  tituloMovimentacao: z.string().min(3, "Pelo menos 3 caracteres"),
  valorMovimentacao: z.number().min(0.01, "Valor inválido").nonnegative(),
  descricaoMovimentacao: z.string().nullish(),
  dataMovimentacao: z.string().min(1, "Selecione uma data"),
});

type movimentoGanhoFormData = z.infer<typeof movimentoGanhoSchema>;

export default function GerandoGanho() {
  const db = useSQLiteContext();

  const {
    control,
    clearErrors,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<movimentoGanhoFormData>({
    resolver: zodResolver(movimentoGanhoSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  async function salvarMovimentacao(data: movimentoGanhoFormData) {
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
      data.descricaoMovimentacao? data.descricaoMovimentacao : null,
      data.dataMovimentacao,
      1,
      null,
    );
    reset();
  }

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, paddingInline: 13, paddingBlock: 15 }}>
        <HeaderVoltar titulo="Gerando Ganho" />

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
              type="number"
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

            <InputDate
              control={control}
              name="dataMovimentacao"
              label="Data efetuada"
              clearErrors={clearErrors}
              error={errors.dataMovimentacao?.message}
            />

            <InputCheckbox label="Já foi paga"/>
          </View>

          <View style={styleContainer.botaoSalvar}>
            <ButtonComponent
              label="Salvar"
              variant="green"
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
    gap: 25,
  },

  botaoSalvar: {
    // alignSelf: 'flex-end',
  },
});
