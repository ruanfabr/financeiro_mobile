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
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";

const categoriasGanho = [
  { label: "Salário", value: 1, icone: "sack-dollar" },
  { label: "Freelance", value: 2, icone: "laptop" },
  { label: "Investimento", value: 3, icone: "chart-line" },
  { label: "Presente", value: 4, icone: "gift" },
  { label: "Outro", value: 5, icone: "ellipsis" },
];

const movimentoGanhoSchema = z.object({
  tituloMovimentacao: z.string().min(3, "Pelo menos 3 caracteres"),
  valorMovimentacao: z.number().min(0.01, "Valor inválido").nonnegative(),
  descricaoMovimentacao: z.string().nullish(),
  // dataMovimentacao: z.date()
  dataMovimentacao: z.string().min(1, "Selecionar uma data"), // PARA VIÉS DE TESTE, DESABILITAR DEPOIS
  recorrente: z.number(),
  // recebido: z.boolean().default(true),
  categoria: z.number(),
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
    parcelas_restantes: number;
    status_movimentacao: string;
    tipo_movimentacao: number;
    icone: string | null;
}

type localSearch = {
  id: string;
}

export default function GerandoGanho() {
  const router = useRouter()
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
      dataMovimentacao: String(new Date().toISOString().split('T')[0]),
      recorrente: 0
    }
  });

  useFocusEffect(
    useCallback(() => {
      if (!id) return
      async function verMovimentoGanho() {
              const movimento = await db.getFirstAsync<Movimentacoes>(`
                  SELECT
                      m.id,
                      m.titulo,
                      m.valor,
                      m.descricao,
                      m.data_emitida,
                      m.categoria,
                      m.recorrente,
                      m.status_movimentacao,
                      m.tipo_movimentacao,
                      m.icone,
                      mp.parcelas_restantes
                  FROM movimentacoes m
                  join movimentoParcelado mp on m.id = mp.id_movimentacao
                  WHERE m.id = ?
                  `, [id]);

                  reset({
                    tituloMovimentacao: movimento?.titulo,
                    descricaoMovimentacao: movimento?.descricao,
                    dataMovimentacao: movimento?.data_emitida,
                    categoria: movimento?.categoria ?? undefined,
                    recorrente: movimento?.recorrente,
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
        recorrente,
        categoria,
        icone
      )
      values
      (
        ?,?,?,?,?,?,?,?
      )
      `,
      data.tituloMovimentacao,
      data.valorMovimentacao,
      data.descricaoMovimentacao? data.descricaoMovimentacao : null,
      data.dataMovimentacao,
      1,
      data.recorrente? 1 : 0,
      data.categoria,
      null,
    );
    router.back()
  }

  async function editarMovimentacao(data: movimentoGanhoFormData) {
    await db.runAsync(
      `
      UPDATE movimentacoes SET
        titulo = ?,
        valor = ?,
        descricao = ?,
        data_emitida = ?,
        tipo_movimentacao = ?,
        recorrente = ?,
        categoria = ?,
        icone = ?
      WHERE id = ?
      `,
      data.tituloMovimentacao,
      data.valorMovimentacao,
      data.descricaoMovimentacao? data.descricaoMovimentacao : null,
      data.dataMovimentacao,
      1,
      data.recorrente? 1:0,
      data.categoria,
      null,
      id
    );
    router.back()
  }

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, paddingInline: 15, paddingBlock: 15 }}>
        <HeaderVoltar titulo={!id? "Gerar Ganho" : "Editar Ganho"} />

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
            control={control}
            name="recorrente"
            label="Recorrente"
            size={30}
            />

            {/* <InputCheckbox
            control={control}
            name="recebido"
            label="Recebido"
            size={30}
            /> */}

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
              onPress={() => {
                !id? handleSubmit(salvarMovimentacao)():handleSubmit(editarMovimentacao, (err) => console.log(err))()
              }}
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
    paddingTop: 15
  },

  containerDadosPrincipais: {
    gap: 25,
  },

  botaoSalvar: {
    paddingTop: 35,
    paddingBottom: 15,
  },
});
