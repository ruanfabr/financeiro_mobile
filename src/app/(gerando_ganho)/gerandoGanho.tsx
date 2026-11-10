import { ButtonComponent } from "@/components/input/Button";
import { InputText } from "@/components/input/InputText";
import { InputCheckbox } from "@/components/input/checkBox";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSQLiteContext } from "expo-sqlite";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import z from "zod";
import { HeaderVoltar } from "@/components/HeaderVoltar";
import { InputDate } from "@/components/input/InputDate";
import { InputSelect } from "@/components/input/InputSelect";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";

const categoriasGanho = [
  { label: "Salário", value: "salario", icone: "sack-dollar" },
  { label: "Freelance", value: "freelance", icone: "laptop" },
  { label: "Investimento", value: "investimento", icone: "chart-line" },
  { label: "Presente", value: "presente", icone: "gift" },
  { label: "Outro", value: "outro", icone: "ellipsis" },
];

const movimentoGanhoSchema = z.object({
  tituloMovimentacao: z.string().min(3, "Pelo menos 3 caracteres"),
  valorMovimentacao: z.number().min(0.01, "Valor inválido").nonnegative(),
  descricaoMovimentacao: z.string().nullish(),
  // dataMovimentacao: z.date()
  dataMovimentacao: z.string().min(1, "Selecionar uma data"), // PARA VIÉS DE TESTE, DESABILITAR DEPOIS
  categoria: z.string().min(1, "Selecione uma categoria"),
});

type movimentoGanhoFormData = z.infer<typeof movimentoGanhoSchema>;

type Movimentacoes = {
    id: number;
    titulo: string;
    valor: number;
    descricao: string | null;
    data_emitida: string;
    categoria: number | null;
    recorrente: number;
    qtd_parcelas: number;
    status_movimentacao: string;
    tipo_movimentacao: number;
    icone: string | null;
}

type localSearch = {
  id: string;
}

export default function GerandoGanho() {
  const db = useSQLiteContext();
  const { id } = useLocalSearchParams<localSearch>();

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
    defaultValues: {
      dataMovimentacao: String(new Date().toISOString().split('T')[0])
    }
  });

  useFocusEffect(
    useCallback(() => {
      if (!id) return
      async function verMovimentoGanho() {
              const movimento = await db.getFirstAsync<Movimentacoes>(`
                  SELECT
                      id,
                      titulo,
                      valor,
                      descricao,
                      data_emitida,
                      categoria,
                      recorrente,
                      qtd_parcelas,
                      status_movimentacao,
                      tipo_movimentacao,
                      icone
                  FROM movimentacoes
                  WHERE id = ?
                  `, [id]);

                  reset({
                    tituloMovimentacao: movimento?.titulo,
                    descricaoMovimentacao: movimento?.descricao,
                    dataMovimentacao: movimento?.data_emitida,
                    // categoria: movimento?.categoria,
                    valorMovimentacao: movimento?.valor
                  })
                }
          verMovimentoGanho();
    }, [])
  )

  async function salvarMovimentacao(data: movimentoGanhoFormData) {
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
  }

  async function editarMovimentacao(data: movimentoGanhoFormData) {
    await db.runAsync(
      `
      UPDATE movimentacoes SET
        titulo = ?
        valor = ?,
        descricao = ?,
        data_emitida = ?,
        tipo_movimentacao = ?,
        icone = ?
      `,
      data.tituloMovimentacao,
      data.valorMovimentacao,
      data.descricaoMovimentacao? data.descricaoMovimentacao : null,
      data.dataMovimentacao,
      1,
      null,
    )
  }

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, paddingInline: 15, paddingBlock: 15 }}>
        <HeaderVoltar titulo={!id? "Gerando Ganho" : "Editar Ganho"} />

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
              name="descricaoMovimentacao"
              label="Descrição"
              clearErrors={clearErrors}
              placeholder="Descrição (opcional)"
              error={errors.descricaoMovimentacao?.message}
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

            <InputDate
              control={control}
              name="dataMovimentacao"
              label="Data efetuada"
              clearErrors={clearErrors}
              error={errors.dataMovimentacao?.message}
            />

            <InputCheckbox
            label="Recorrente"
            size={30}
            />

            <InputCheckbox
            label="Recebido"
            size={30}
            />

            <InputSelect
            control={control}
            name="categoria"
            label="Categoria"
            titulo="Categoria do ganho"
            opcoes={categoriasGanho}
            clearErrors={clearErrors}
            error={errors.categoria?.message}
            />

          </View>

          <View style={styleContainer.botaoSalvar}>
            <ButtonComponent
              label={!id? "Salvar":"Editar"}
              variant="green"
              onPress={() => handleSubmit(salvarMovimentacao)}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styleContainer = StyleSheet.create({
  tituloPagina: {
    fontSize: 27,
    fontWeight: "600",
    paddingInline: 7,
    paddingBlock: 8,
  },

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
