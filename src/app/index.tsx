import { ButtonComponent } from "@/components/input/Button";
import { InputText } from "@/components/input/InputText";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("E-mail inválido").min(1, "Preencher campo"),
  senha: z.string({ error: "Preencher campo" }).min(1, "Preencher campo"),
});

type loginFormData = z.infer<typeof loginSchema>;

export default function Index() {
  const router = useRouter();
  const {
    control,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  function handleSignIn(data: loginFormData) {
    console.log(data);
    router.push("/mainPage");
  }

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={style.viewNormal}>
          <Text style={style.title}>Projeto de organização financeira</Text>

          <View style={style.formularioLogin}>
            <InputText
              control={control}
              name="email"
              clearErrors={clearErrors}
              label="E-mail"
              autoCapitalize="none"
              keyboardType="email-address"
              style={style.formularioLoginCampo}
              error={errors.email?.message}
            />

            <InputText
              control={control}
              name="senha"
              clearErrors={clearErrors}
              label="Senha"
              autoCapitalize="none"
              secureTextEntry
              style={style.formularioLoginCampo}
              error={errors.senha?.message}
            />

            <View style={{ gap: 15 }}>
              <ButtonComponent
                label="Login"
                onPress={handleSubmit(handleSignIn)}
              />

              <Text style={style.textCadastro}>
                Não possui cadastro? {"\n"}{" "}
                <Link href="/auth/signup" style={style.linkCadastro}>
                  Registre-se aqui
                </Link>
              </Text>

              <Text>
                Pular para{" "}
                <Link href="/gerandoGanho" style={style.linkCadastro}>
                  pagina trabalhando atual
                </Link>
              </Text>

              <Text>
                mainPage{" "}
                <Link href="/mainPage" style={style.linkCadastro}>
                  {" "}
                  aqui{" "}
                </Link>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const style = StyleSheet.create({
  viewNormal: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#FDFDFD",
    padding: 32,
    gap: 40,
  },
  formularioLogin: {
    // backgroundColor: "#789895",
    width: 250,
    gap: 30,
  },
  formularioLoginCampo: {
    fontSize: 17,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textCadastro: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 22,
  },
  linkCadastro: {
    color: "#3e5de9",
    fontWeight: 700,
  },
});
