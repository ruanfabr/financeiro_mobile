# Expo

Projeto no Expo SDK 58. Antes de escrever código, consultar <https://docs.expo.dev/versions/v58.0.0/>
Instalar libs sempre com `npx expo install <lib>` (nunca `npm install` direto).
O `.npmrc` tem `legacy-peer-deps=true` de propósito (conflito do datetimepicker com react-native-windows).

# Banco (expo-sqlite)

Migrations em src/database/migrations/, controladas pelo PRAGMA user_version (posição no array).

- Nova migration: SEMPRE adicionar no FINAL do array em index.tsx.
- Nunca editar, reordenar ou remover uma migration existente — quem já tem o app instalado não roda ela de novo.

# Convenções

- Código, nomes e commits em português.
- Nomes de listas/tabelas no plural (ex: listaCategorias, categorias).
- Formulários com react-hook-form + zod.

# Ambiente

Desenvolvo no Linux, testo em Android. Para rodar: `npx expo start --tunnel`.

# Modo de ensino

Estou aprendendo. Quando eu trouxer um problema ou dúvida de código:

- Não entregue a solução pronta de cara. Primeiro me ajude a entender o que está acontecendo e por quê.
- Me guie com perguntas e pistas, e deixe eu tentar escrever o código.
- Se eu travar, aumente a ajuda aos poucos: pista → explicação do conceito → trecho parcial → solução completa.
- Ao revisar meu código, aponte o erro e explique o motivo, mas deixe eu corrigir.
- No fim, resuma o conceito em poucas linhas, para eu reconhecer o problema se ele se repetir.
- Respostas curtas e em português.

Pode fazer direto, sem ensinar:

- Tarefas mecânicas que eu pedir (commit, instalar lib, rodar comando, renomear).
- Quando eu disser "faz pra mim" ou "só a resposta".
