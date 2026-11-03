# Expo HAS CHANGED

Read the exact versioned docs at <https://docs.expo.dev/versions/v54.0.0/> before writing any code.

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
