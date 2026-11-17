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
  categoria: z.number(),
  parcela: z.number(),
  parcelas_restantes: z.number().nullable().optional(),
  parcelas_pagas: z.number().nullable().optional(),
  valor_parcela: z.number().nullable().optional()
}).superRefine((data, err) => {
  const arrayCampos = ["parcelas_pagas", "parcelas_restantes", "valor_parcela"] as const
  if (data.parcela == 1 && (data.parcelas_pagas == null || data.parcelas_restantes == null || data.valor_parcela == null)){
    arrayCampos.forEach((item) => {
      if (data[item] == undefined) {
          return err.addIssue({
            code: "custom",
            message: "Campo não pode estar vazio",
            path: [item]
          })
      }
    })
  }
  // else if(data.parcela == 1  && ((data.parcelas_pagas != null && data.parcelas_pagas < 0) || (data.parcelas_restantes != null && data.parcelas_restantes <= 0) || (data.valor_parcela != null && data.valor_parcela <= 0))){
  //   arrayCampos.forEach((item) => {
  //     if ((item == "parcelas_pagas" && (data.parcelas_pagas && data.parcelas_pagas < 0)) || data[item] && data[item] <= 0 && ((item == "parcelas_restantes" || item == "valor_parcela")))
  //     return err.addIssue({
  //       code: "custom",
  //       message: "Valor inválido",
  //       path: [item]
  //     })
  //   })
  // }
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
    parcelas_pagas: number | null;
    valor_parcela: number | null;
}

type movimentoGastoFormData = z.infer<typeof movimentoGastoSchema>;

type localSearch = {
  id?: string;
  tipoMovimentacaoURL: string;
}

export default function GerandoGasto() {
  const { id, tipoMovimentacaoURL } = useLocalSearchParams<localSearch>();
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
      // valor_parcela: 0,
      // parcelas_restantes: 0,
      // parcelas_pagas: 0,
      parcela: 0,
      recorrente: 0,
    }
  });

  function capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

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
              mp.parcelas_restantes,
              mp.parcelas_pagas,
              mp.valor_parcela
          FROM movimentacoes m
          left join movimentoParcelado mp on m.id = mp.id_movimentacao
          WHERE m.id = ?
          `,
          [id?? null]
        );
        console.log(movimento)
        reset({
          tituloMovimentacao: movimento?.titulo,
          descricaoMovimentacao: movimento?.descricao,
          dataMovimentacao: movimento?.data_emitida,
          categoria: movimento?.categoria ?? undefined,
          recorrente: movimento?.recorrente,
          valorMovimentacao: movimento?.valor,
          valor_parcela: movimento?.valor_parcela ?? undefined,
          parcela: movimento?.parcelas_restantes && movimento.parcelas_restantes > 0? 1:0,
          parcelas_restantes: movimento?.parcelas_restantes ?? undefined,
          parcelas_pagas: movimento?.parcelas_pagas ?? undefined
        })
      }
      verMovimentoGasto()
    }, [])
  )

  async function salvarMovimentacao(data: movimentoGastoFormData) {
    console.log('salva')
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
      tipoMovimentacaoURL.toLowerCase() == "ganho"? 1:2,
      data.recorrente,
      data.categoria,
      null,
    )
    .then(async (res) => {
      console.log(data.parcela)

      if (data.parcela == 1 && data.parcelas_restantes && data.parcelas_restantes > 0){
        await db.runAsync(
          `
          INSERT INTO movimentoParcelado (
            id_movimentacao
            ,valor_parcela
            ,parcelas_pagas
            ,parcelas_restantes
          )
            values
          (?, ?, ?, ?)
          `,
          res.lastInsertRowId,
          data.valor_parcela?? null,
          data.parcelas_pagas?? null,
          data.parcelas_restantes?? null
        )
      }
      router.back()
    })
    .catch((err) => { console.log(err) })
  }

  async function editarMovimentacao(data: movimentoGastoFormData) {
    console.log('edit')
    await db.runAsync(
      `
      UPDATE movimentacoes SET
        titulo = ?,
        valor = ?,
        descricao = ?,
        data_emitida = ?,
        recorrente = ?,
        categoria = ?,
        icone = ?
      WHERE id = ?
      `,
      data.tituloMovimentacao,
      data.valorMovimentacao,
      data.descricaoMovimentacao ?? null,
      data.dataMovimentacao,
      data.recorrente,
      data.categoria,
      null,
      id?? null
    ).then(async () => {
      console.log(data.parcela)
      if (data.parcela == 1){
        await db.runAsync(
          `
          INSERT INTO movimentoParcelado (
            id_movimentacao
            ,valor_parcela
            ,parcelas_pagas
            ,parcelas_restantes
            )
            values
            (?, ?, ?, ?)
            ON CONFLICT(id_movimentacao) DO UPDATE SET
            parcelas_restantes = excluded.parcelas_restantes,
            parcelas_pagas = excluded.parcelas_pagas,
            valor_parcela = excluded.valor_parcela
            `,
            id?? null,
            data.valor_parcela?? null,
            data.parcelas_pagas?? null,
            data.parcelas_restantes?? null
          )
        console.log('edit movimento parcelado')
      }
      else {
        console.log('deletando movimento parcelado')
        await db.runAsync(
          `
          DELETE from movimentoParcelado
          where id_movimentacao = ?;
          `,
          id?? null
        )
      }
      router.back()
    })
    .catch((err) => {
      console.log('erro ao inserir parcelas: ', err)
    })
  }

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, paddingInline: 15, paddingBlock: 15 }}>
        <HeaderVoltar titulo={!id? `Gerar ${capitalize(tipoMovimentacaoURL)}`:`Editar ${capitalize(tipoMovimentacaoURL)}`}/>

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
            control={control}
            name="recorrente"
            label="Recorrente"
            size={30}
            />

            <InputCheckbox
            control={control}
            name="parcela"
            label="parcela"
            size={30}
            />

            {
              watch("parcela") == 1?
              <>
              <InputText
              control={control}
              name="valor_parcela"
              label="Valor da Parcela"
              placeholder="Valor da Parcela"
              type="real"
              clearErrors={clearErrors}
              error={errors.valor_parcela?.message}
              />

              <InputText
              control={control}
              name="parcelas_pagas"
              label="Número de Parcelas Pagas"
              placeholder="Parcelas Pagas"
              type="number"
              clearErrors={clearErrors}
              error={errors.parcelas_pagas?.message}
              />

              <InputText
              control={control}
              name="parcelas_restantes"
              label="Número de Parcelas Restantes"
              placeholder="Parcelas Restantes"
              type="number"
              clearErrors={clearErrors}
              error={errors.parcelas_restantes?.message}
              />
              </>
              : null
            }

            <InputSelect
            control={control}
            name="categoria"
            label="Categoria"
            titulo={`Categoria do ${capitalize(tipoMovimentacaoURL)}`}
            opcoes={categoriasGasto}
            clearErrors={clearErrors}
            error={errors.categoria?.message}
            />
          </View>

        </View>
      </View>
      <View style={styleContainer.botaoSalvar}>
        <ButtonComponent
          label={!id? "Salvar":"Editar"}
          variant={tipoMovimentacaoURL.toLowerCase() == "ganho"? "green":"red"}
          onPress={() => !id? handleSubmit(salvarMovimentacao, (err) => console.log(err))():handleSubmit(editarMovimentacao, (err) => console.log(err))()}
        />
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
    paddingInline: 20
  },
});
