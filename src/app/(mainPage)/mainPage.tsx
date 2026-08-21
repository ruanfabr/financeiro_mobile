import { ButtonComponent } from "@/components/input/Button";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Link } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActionMovimentacao } from "../../components/ActionMovimentacao";

import * as SQLite from "expo-sqlite";

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
};

export default function MainPage() {
  const db = useSQLiteContext();
  const [dadosMovimentacoes, setDadosMovimentacoes] = useState<Movimentacoes[]>(
    [],
  );

  async function resetarBanco() {
    await db.closeAsync();
    await SQLite.deleteDatabaseAsync("financeiro.db");
  }

  useEffect(() => {
    async function listaMovimentacoes() {
      const movimentacoes = await db.getAllAsync<Movimentacoes>(`
                    SELECT * FROM movimentacoes
                `);

      setDadosMovimentacoes(movimentacoes);
    }
    listaMovimentacoes();
  }, []);

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, paddingInline: 13, paddingBlock: 15 }}>
        <View>
          <Text style={styleContainer.dataResumo}>Agosto 2026</Text>
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
                <FontAwesome6 name="arrow-up" size={20} color="#2a922a" />
                <Text
                  style={[
                    styleContainer.textTitle,
                    { color: "#2a922a", paddingInline: 13 },
                  ]}
                >
                  Ganhos
                </Text>
              </View>

              {dadosMovimentacoes && (
                <Text
                  style={[
                    styleContainer.textTitle,
                    { color: "#2a922a" },
                    { fontSize: 17 },
                  ]}
                >
                  Total{" "}
                  {dadosMovimentacoes
                    .filter((item) => item.tipo_movimentacao === 1)
                    .reduce((a, item) => a + item.valor, 0)}
                </Text>
              )}
            </View>

            <View style={{ gap: 17, paddingBottom: 6 }}>
              {dadosMovimentacoes.map((dado) => {
                if (dado.tipo_movimentacao == 1)
                  return (
                    <View
                      key={dado.id}
                      style={styleContainer.containerConteudoOut}
                    >
                      <View style={styleContainer.iconMovimentacaoGanho}>
                        <FontAwesome6
                          name={dado.icone ? dado.icone : "dollar-sign"}
                          size={21}
                          color="green"
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
                          <Text style={styleContainer.textConteudoDate}>
                            {dado.data_emitida}
                          </Text>
                        )}
                      </View>

                      <Text style={styleContainer.textGanho}>
                        R$ {String(dado.valor).replace(".", ",")}
                      </Text>
                    </View>
                  );
              })}
            </View>

            {dadosMovimentacoes &&
            dadosMovimentacoes.find(
              (elemento) => elemento.tipo_movimentacao === 1,
            ) ? (
              <Link href="/" style={styleContainer.textVerMaisGanho}>
                Ver Mais
              </Link>
            ) : null}
          </View>

          <View style={styleContainer.containerGastos}>
            <View style={styleContainer.containerTitle}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome6 name="arrow-down" size={20} color="#c71100" />
                <Text
                  style={[
                    styleContainer.textTitle,
                    { color: "#c71100", paddingInline: 13 },
                  ]}
                >
                  Gastos
                </Text>
              </View>

              <Text
                style={[
                  styleContainer.textTitle,
                  { color: "#c71100" },
                  { fontSize: 17 },
                ]}
              >
                Total{" "}
                {dadosMovimentacoes
                  .filter((item) => item.tipo_movimentacao === 2)
                  .reduce((a, item) => a + item.valor, 0)}
              </Text>
            </View>

            <View style={{ gap: 17, paddingBottom: 6 }}>
              {dadosMovimentacoes.map((dado) => {
                if (dado.tipo_movimentacao == 2)
                  return (
                    <View
                      key={dado.id}
                      style={styleContainer.containerConteudoOut}
                    >
                      <View style={styleContainer.iconMovimentacaoGasto}>
                        <FontAwesome6
                          name={dado.icone ? dado.icone : "dollar-sign"}
                          size={21}
                          color="#b60f00"
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
                          <Text style={styleContainer.textConteudoDate}>
                            {dado.data_emitida}
                          </Text>
                        )}
                      </View>

                      <Text style={styleContainer.textGasto}>
                        R$ {String(dado.valor).replace(".", ",")}
                      </Text>
                    </View>
                  );
              })}
            </View>
          </View>
        </View>
      </View>
      <ButtonComponent
        label="ver banco"
        onPress={() => console.log("movimentações: ", dadosMovimentacoes)}
      />
      <ActionMovimentacao />

      <ButtonComponent label="deletar table" onPress={resetarBanco} />
      <ActionMovimentacao />
    </ScreenWrapper>
  );
}

const styleContainer = StyleSheet.create({
  containerGeral: {
    paddingBlock: 20,
    gap: 45,
  },
  dataResumo: {
    fontWeight: "bold",
    fontSize: 25,
    paddingInline: 10,
    paddingBlock: 5,
  },
  iconMovimentacaoGanho: {
    width: 43,
    paddingInline: 10,
    alignSelf: "center",
    backgroundColor: "#62f85d",
    aspectRatio: 1,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  iconMovimentacaoGasto: {
    width: 43,
    paddingInline: 10,
    alignSelf: "center",
    backgroundColor: "#ed5e5e",
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
    width: "100%",
    borderRadius: 12,
    padding: 15,
    rowGap: 20,
  },
  containerGastos: {
    width: "100%",
    borderRadius: 12,
    padding: 15,
    rowGap: 20,
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
    backgroundColor: "#e2e2e2",
    paddingBlock: 10,
    paddingInline: 12,
    borderRadius: 15,
    alignItems: "center",
    width: "100%",
  },
  containerConteudoIn: {
    flex: 1,
    paddingInline: 7,
  },

  textTitle: {
    fontWeight: "bold",
    fontSize: 23,
    textAlign: "center",
  },
  textConteudoTitulo: {
    fontWeight: "bold",
    fontSize: 17.5,
  },
  textConteudoDate: {
    alignSelf: "flex-start",
    fontWeight: 600,
    fontSize: 14,
    width: "auto",
    letterSpacing: 0.2,
  },
  textGanho: {
    color: "#2a922a",
    fontSize: 18.5,
    fontWeight: "bold",
    textAlign: "right",
    alignSelf: "center",
    flexShrink: 0,
  },
  textGasto: {
    color: "#c71100",
    fontSize: 18.5,
    fontWeight: "bold",
    textAlign: "right",
    alignSelf: "center",
    flexShrink: 0,
  },
  textVerMaisGanho: {
    fontWeight: "bold",
    fontSize: 18,
    justifyContent: "center",
    textAlign: "center",
    borderTopWidth: 2,
    borderColor: "#5ab539",
    paddingTop: 8,
    color: "#2a922a",
  },
});
