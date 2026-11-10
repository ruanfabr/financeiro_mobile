# Financeiro Mobile

App mobile de organização financeira pessoal: registrar ganhos e gastos, acompanhar parcelas e organizar tudo por categoria. Os dados ficam salvos no próprio aparelho, com SQLite.

> 🚧 **Em desenvolvimento.** O que está sendo feito fica nas [issues](https://github.com/ruanfabr/financeiro_mobile/issues) e nos [milestones](https://github.com/ruanfabr/financeiro_mobile/milestones).

## Funcionalidades

- [x] Lista de ganhos e gastos na tela principal
- [x] Cadastro de ganho e de gasto
- [x] Tela de detalhe da movimentação
- [x] Excluir movimentação
- [ ] Editar movimentação
- [ ] Telas de "ver mais" para ganhos e gastos
- [ ] Gerenciamento de categorias
- [ ] Login

## Tecnologias

- [Expo](https://docs.expo.dev/versions/v58.0.0/) SDK 58 + React Native
- TypeScript
- [Expo Router](https://docs.expo.dev/router/introduction/) para a navegação, baseada em arquivos
- [expo-sqlite](https://docs.expo.dev/versions/v58.0.0/sdk/sqlite/) para o banco local
- [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/) para os formulários e a validação
- [@gorhom/bottom-sheet](https://gorhom.dev/react-native-bottom-sheet/) para os menus que sobem da parte de baixo da tela
- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) para as animações

## Como rodar

O que você precisa ter instalado:

- Node.js
- O app [Expo Go](https://expo.dev/go) no celular

Instale as dependências e inicie o projeto:

```bash
npm install
npx expo start --tunnel
```

Depois, leia o QR Code com o Expo Go. O `--tunnel` permite conectar o celular mesmo quando ele não está na mesma rede que o computador.

> O `.npmrc` tem `legacy-peer-deps=true` de propósito: o `@react-native-community/datetimepicker` tem um conflito de peer dependency com o `react-native-windows`.

Para instalar uma biblioteca nova, use sempre `npx expo install <lib>`. Esse comando escolhe a versão compatível com o SDK do Expo.

## Estrutura

```
src/
├── app/          # telas (cada arquivo é uma rota do Expo Router)
├── components/   # componentes reutilizáveis (header, botões, inputs...)
├── database/     # conexão com o SQLite e migrations
└── theme/        # cores e fontes
```

## Banco de dados

O banco é criado no aparelho na primeira vez que o app abre. As mudanças no formato do banco são feitas por **migrations** (em `src/database/migrations/`), e o `PRAGMA user_version` controla quais já foram executadas.

- Toda migration nova vai sempre no **final** da lista, em `migrations/index.tsx`.
- Nunca edite, reordene ou remova uma migration que já existe: quem já tem o app instalado não executa ela de novo.

Mais anotações sobre o banco estão em [anotacoes/banco-de-dados.md](anotacoes/banco-de-dados.md).

## Histórico

As mudanças feitas até agora e o motivo de cada uma estão no [CHANGELOG.md](CHANGELOG.md).

## Licença

[MIT](LICENSE)
