import { ButtonComponent } from "@/components/input/Button";
import { InputText } from "@/components/input/InputText";
import { InputSelect } from "@/components/input/InputSelect";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSQLiteContext } from "expo-sqlite";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import z from "zod";
import { HeaderVoltar } from "@/components/HeaderVoltar";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { InputDate } from "@/components/input/InputDate";
import { InputCheckbox } from "@/components/input/checkBox";
import { useCallback } from "react";

const categoriasGasto = [
  { label: "Alimentação", value: 1, icone: "utensils" },
  { label: "Casa", value: 2, icone: "house" },
  { label: "Transporte", value: 3, icone: "car" },
  { label: "Lazer", value: 4, icone: "gamepad" },
  { label: "Outro", value: 5, icone: "ellipsis" },
];

const movimentoGastoSchema = z.object({
  tituloMovimentacao: z.string().min(3, "Pelo menos 3 caracteres"),
  valorMovimentacao: z.number().min(0.01, "Valor inválido").nonnegative(),
  descricaoMovimentacao: z.string().nullish(),
  // dataMovimentacao: z.date()
  dataMovimentacao: z.string(), // PARA VIÉS DE TESTE, DESABILITAR DEPOIS
  recorrente: z.number(),
  parcelas: z.number(),
  parcelas_restantes: z.number(),
  categoria: z.number(),
});

type Movimentacoes = {
    id: number;
    titulo: string;
    valor: number;
    descricao: string | null;
    data_emitida: string;
    categoria: number | null;
    recorrente: number;
    status_movimentacao: string;
    tipo_movimentacao: number;
    icone: string | null;
    parcelas_restantes: number | null;
}

type movimentoGastoFormData = z.infer<typeof movimentoGastoSchema>;

type localSearch = {
  id: string;
}

export default function GerandoGasto() {
  const { id } = useLocalSearchParams<localSearch>();
  const router = useRouter()
  const db = useSQLiteContext();
  const {
    control,
    clearErrors,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<movimentoGastoFormData>({
    resolver: zodResolver(movimentoGastoSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      dataMovimentacao: String(new Date().toISOString().split('T')[0]),
      parcelas_restantes: 0,
      parcelas: 0,
      recorrente: 0,
    }
  });

  useFocusEffect(
    useCallback(() => {
      if (!id) return
      async function verMovimentoGasto() {
        const movimento = await db.getFirstAsync<Movimentacoes>(
          `
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
          `,
          [id]
        );
        console.log(movimento)
        reset({
          tituloMovimentacao: movimento?.titulo,
          descricaoMovimentacao: movimento?.descricao,
          dataMovimentacao: movimento?.data_emitida,
          categoria: movimento?.categoria ?? undefined,
          recorrente: movimento?.recorrente,
          valorMovimentacao: movimento?.valor,
          parcelas: movimento?.parcelas_restantes && movimento.parcelas_restantes > 0? 1:0,
          parcelas_restantes: movimento?.parcelas_restantes ?? undefined
        })
      }
      verMovimentoGasto()
    }, [])
  )

  async function salvarMovimentacao(data: movimentoGastoFormData) {
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
      data.descricaoMovimentacao ?? null,
      data.dataMovimentacao,
      2,
      data.recorrente,
      data.categoria,
      null,
    )
    .then(async (res) => {
      if (data.parcelas == 1 && data.parcelas_restantes > 0){
        await db.runAsync(
          `
          INSERT INTO movimentoParcelado (
            id_movimentacao
            ,parcelas_pagas
            ,parcelas_restantes
          )
            values
          (?, ?, ?)
          `,
          res.lastInsertRowId,
          0,
          data.parcelas_restantes
        )
      }
      router.back()
    })
    .catch((err) => { console.log(err) })
  }

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, paddingInline: 15, paddingBlock: 15 }}>
        <HeaderVoltar titulo={!id? "Gerar Gasto":"Editar Gasto"}/>

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

            <InputCheckbox
            control={control}
            name="parcelas"
            label="Parcelas"
            size={30}
            />

            {
              watch("parcelas") == 1?
              <InputText
              control={control}
              name="parcelas_restantes"
              label="Número de parcelas"
              type="number"
              />
              : null
            }

            <InputSelect
            control={control}
            name="categoria"
            label="Categoria"
            titulo="Categoria do gasto"
            opcoes={categoriasGasto}
            clearErrors={clearErrors}
            error={errors.categoria?.message}
            />
          </View>

          <View style={styleContainer.botaoSalvar}>
            <ButtonComponent
              label={!id? "Salvar":"Editar"}
              variant="red"
              onPress={() => handleSubmit(salvarMovimentacao, (err) => console.log(err))()}
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
