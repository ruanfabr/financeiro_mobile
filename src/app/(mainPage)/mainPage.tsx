import { ButtonComponent } from "@/components/input/Button";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { ActionMovimentacao } from "../../components/ActionMovimentacao";

import * as SQLite from "expo-sqlite";
import { fonts } from "@/theme/typography";
import { colors } from "@/theme/colors";

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
  valor_parcela: number | null;
  parcelas_pagas: number | null;
  parcelas_restantes: number | null;
};

export default function MainPage() {
  const { width } = useWindowDimensions()
  const router = useRouter()
  const db = useSQLiteContext();
  const [dadosMovimentacoes, setDadosMovimentacoes] = useState<Movimentacoes[]>(
    [],
  );

  /* FUNÇÃO PARA DESCARTAR DEPOIS */
  async function resetarBanco() {
    await db.closeAsync();
    await SQLite.deleteDatabaseAsync("financeiro");
  }

  useFocusEffect(
    useCallback(() => {
      async function listaMovimentacoes() {
        const movimentacoes = await db.getAllAsync<Movimentacoes>(`
                      SELECT
                        m.id
                        ,m.titulo 
                        ,m.valor 
                        ,m.descricao 
                        ,m.data_emitida
                        ,m.categoria 
                        ,m.recorrente
                        ,m.status_movimentacao
                        ,m.tipo_movimentacao
                        ,mp.valor_parcela
                        ,mp.parcelas_pagas
                        ,mp.parcelas_restantes
                      FROM movimentacoes m
                      LEFT JOIN movimentoParcelado mp on m.id = mp.id_movimentacao
                  `);
  
        setDadosMovimentacoes(movimentacoes);
      }
      listaMovimentacoes();
    }, [])
  );

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, paddingInline: 15, paddingBlock: 15 }}>
        <View>
          <Text style={styleContainer.dataResumo}>{new Date().toLocaleDateString('pt-BR', {month: 'long', year: 'numeric'}).replace(/\sde\s/g, ' ')}</Text>
        </View>

        <View style={styleContainer.containerGeral}>
          {/* <View style={styleContainer.containerPendencias}>
                    <Text style={[styleContainer.containerTitle, {color: "#674600"}]}>Pendências</Text>
                </View> */}

          <View style={styleContainer.containerGanhos}>
            <View style={styleContainer.containerTitle}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesome6 name="arrow-up" size={20} color={colors.green} />
                <Text
                  style={[
                    styleContainer.textTitle,
                    {
                      // color: "#2a922a",
                      paddingInline: 13
                    },
                  ]}
                >
                  Ganhos
                </Text>
              </View>

              {dadosMovimentacoes && (
                <Text
                  style={[
                    styleContainer.textTitle,
                    { color: colors.green },
                    { fontSize: 17 },
                  ]}
                >
                  R${" "}
                  {dadosMovimentacoes
                    .filter((item) => item.tipo_movimentacao === 1)
                    .reduce((a, item) => a + item.valor, 0)?.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    }
                </Text>
              )}
            </View>

            <View style={{ gap: 17, paddingBottom: 6 }}>
              {dadosMovimentacoes.map((dado) => {
                if (dado.tipo_movimentacao == 1)
                  return (
                    <Pressable onPress={() => router.push({
                      pathname: '/(detalhe_movimento)/verMovimentoDetalhado',
                      params: {
                              id: dado.id
                              }
                      })}
                      key={dado.id}>
                    <View
                      style={styleContainer.containerConteudoOut}
                    >
                      <View style={styleContainer.iconMovimentacaoGanho}>
                        <FontAwesome6
                          name={dado.icone ? dado.icone : "dollar-sign"}
                          size={width * 0.065}
                          color={colors.green}
                        />
                      </View>

                      <View style={styleContainer.containerConteudoIn}>
                        <Text
                          style={styleContainer.textConteudoTitulo}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {dado.titulo}
                        </Text>

                        {dado.data_emitida && (
                          <Text style={styleContainer.textConteudoDesc}>
                            {new Date(dado.data_emitida).toLocaleDateString('pt-BR')}
                          </Text>
                        )}
                      </View>

                      <Text style={styleContainer.textGanho}>
                        R$ {dado.valor?.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Text>
                    </View>
                    </Pressable>
                  );
              })}
            </View>

            {dadosMovimentacoes &&
            dadosMovimentacoes.find(
              (elemento) => elemento.tipo_movimentacao === 1,
            ) ? (
              <Link href="/" style={[styleContainer.textVerMais, {color: colors.green}]}>
                Ver Mais
              </Link>
            ) : null}
          </View>

          <View style={styleContainer.containerGastos}>
            <View style={styleContainer.containerTitle}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome6 name="arrow-down" size={20} color={colors.red} />
                <Text
                  style={[
                    styleContainer.textTitle,
                    {
                      paddingInline: 13
                    },
                  ]}
                >
                  Gastos
                </Text>
              </View>

              <Text
                style={[
                  styleContainer.textTitle,
                  { color: colors.red },
                  { fontSize: 17 },
                ]}
              >
                R$ {" "}
                {dadosMovimentacoes
                  .filter((item) => item.tipo_movimentacao === 2)
                  .reduce((a, item) => a + (item.valor_parcela? item.valor_parcela:item.valor), 0)?.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>

            <View style={{ gap: 17, paddingBottom: 6 }}>
              {dadosMovimentacoes.map((dado) => {
                if (dado.tipo_movimentacao == 2)
                  return (
                    <Pressable onPress={() => router.push({
                      pathname: '/(detalhe_movimento)/verMovimentoDetalhado',
                      params: {
                              id: dado.id
                              }
                      })}
                      key={dado.id}>
                    <View
                      style={styleContainer.containerConteudoOut}
                    >
                      <View style={styleContainer.iconMovimentacaoGasto}>
                        <FontAwesome6
                          name={dado.icone ? dado.icone : "dollar-sign"}
                          size={width * 0.065}
                          color={colors.red}
                        />
                      </View>

                      <View style={styleContainer.containerConteudoIn}>
                        <Text
                          style={styleContainer.textConteudoTitulo}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {dado.titulo}
                        </Text>

                          <View style={{flexDirection: 'row', alignContent: 'center', gap: 7.5}}>
                            {dado.data_emitida && (
                              <Text style={styleContainer.textConteudoDesc}>
                                {new Date(dado.data_emitida).toLocaleDateString('pt-BR')}
                              </Text>
                            )}

                            {dado.parcelas_restantes && dado.parcelas_restantes != 0?
                              <Text style={[styleContainer.textConteudoDesc]}>
                                {dado.parcelas_pagas} de {dado.parcelas_restantes}
                              </Text>
                            :null}
                          </View>
                        </View>

                      <Text style={styleContainer.textGasto}>
                        R$
                        {
                          dado.valor_parcela?
                          (dado.valor_parcela?.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
                          :
                          (dado.valor?.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
                        }
                      </Text>
                    </View>
                    </Pressable>
                  );
              })}
            </View>
                        {dadosMovimentacoes &&
            dadosMovimentacoes.find(
              (elemento) => elemento.tipo_movimentacao === 2,
            ) ? (
              <Link href="/" style={[styleContainer.textVerMais, {color: colors.red}]}>
                Ver Mais
              </Link>
            ) : null}
          </View>
        </View>
      </View>
      <ActionMovimentacao />

    </ScreenWrapper>
  );
}

const styleContainer = StyleSheet.create({
  containerGeral: {
    paddingBlock: 20,
    gap: 24,
  },
  dataResumo: {
    fontFamily: fonts.displayBold,
    color: colors.text,
    fontSize: 24,
    paddingInline: 10,
    paddingBlock: 5,
  },
  iconMovimentacaoGanho: {
    width: 40,
    paddingInline: 10,
    alignSelf: "center",
    backgroundColor: colors.greenSoft,
    aspectRatio: 1,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  iconMovimentacaoGasto: {
    width: 40,
    paddingInline: 10,
    alignSelf: "center",
    backgroundColor: colors.redSoft,
    aspectRatio: 1,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },

  containerPendencias: {
    backgroundColor: "#e6ba5c",
    width: "100%",
    borderRadius: 12,
    padding: 15,
    rowGap: 20,
  },
  containerGanhos: {
    backgroundColor: colors.surface,
    width: "100%",
    borderRadius: 18,
    padding: 16,
    rowGap: 16,
  },
  containerGastos: {
    backgroundColor: colors.surface,
    width: "100%",
    borderRadius: 18,
    padding: 16,
    rowGap: 16,
  },
  containerTitle: {
    justifyContent: "space-between",
    flexDirection: "row",
    textAlign: "center",
    alignItems: "center",
    paddingBottom: 5,
    paddingInline: 5,
  },
  containerConteudoOut: {
    flexDirection: "row",
    backgroundColor: colors.surfaceRaised,
    paddingBlock: 10,
    paddingInline: 10.7,
    borderRadius: 14,
    alignItems: "center",
    width: "100%",
  },
  containerConteudoIn: {
    flex: 1,
    paddingInline: 7,
  },

  textTitle: {
    fontFamily: fonts.displaySemiBold,
    color: colors.text,
    fontSize: 16,
    textAlign: "center",
  },
  textConteudoTitulo: {
    fontFamily: fonts.bodyBold,
    color: colors.text,
    fontSize: 15,
  },
  textConteudoDesc: {
    fontFamily: fonts.bodyMedium,
    color: colors.textMuted,
    alignSelf: "flex-start",
    fontSize: 12.2,
    width: "auto",
    letterSpacing: 0.23
  },
  textGanho: {
    fontFamily: fonts.bodyBold,
    color: colors.green,
    fontSize: 16,
    textAlign: "right",
    alignSelf: "center",
    flexShrink: 0,
  },
  textGasto: {
    fontFamily: fonts.bodyBold,
    color: colors.red,
    fontSize: 15.5,
    textAlign: "right",
    alignSelf: "center",
    flexShrink: 0,
  },
  textVerMais: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    justifyContent: "center",
    textAlign: "center",
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 10,
  }
});
