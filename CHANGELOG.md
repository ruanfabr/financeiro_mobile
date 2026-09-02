# Changelog

Registro das alterações feitas no app até agora, com o motivo de cada uma.

## Botão flutuante de movimentação (`ActionMovimentacao`)

- Criado o componente `src/components/ActionMovimentacao.tsx`: uma bolinha
  flutuante no canto inferior direito que, ao ser tocada, abre duas opções
  ("Gerar Ganho" / "Gerar Gasto") com uma animação simples (`react-native-reanimated`).
- Corrigido um bug em que o toggle de abrir/fechar usava o valor **antigo** do
  estado (`actionAberto`) tanto para decidir a animação quanto o `pointerEvents`,
  fazendo o menu alternar entre "visível mas não clicável" e "clicável mas
  invisível" a cada toque.
- Adicionado um fundo invisível (`Pressable` com `StyleSheet.absoluteFillObject`)
  que aparece só quando o menu está aberto: tocar em qualquer lugar fora das
  opções fecha o menu.
- Ao navegar para "Gerar Ganho"/"Gerar Gasto", o menu agora fecha antes de
  navegar (`navegarPara`) — sem isso, como a `mainPage` não desmonta ao
  navegar (ver seção de navegação), o menu continuava "aberto" quando o
  usuário voltava.
- Removida uma instância duplicada de `<ActionMovimentacao />` que estava
  sendo renderizada duas vezes na `mainPage`.

## Navegação

- Padronizado o uso de `useRouter()`/`router.push()` do `expo-router` para
  navegação disparada por função (em vez de só `<Link>`), já que permite
  combinar lógica antes de navegar (ex: fechar o menu antes de ir pra
  "Gerar Ganho").
- Corrigido: a `mainPage` fica montada na pilha de navegação quando se
  entra em `gerandoGanho`/`gerandoGasto` (comportamento normal de stack
  navigation) — então o `useEffect` que buscava os dados no banco (rodava só
  na montagem) não disparava de novo ao voltar. Trocado por `useFocusEffect`
  (`@react-navigation/native`), que roda toda vez que a tela ganha foco,
  inclusive ao voltar pelo botão físico do Android.

## Banco de dados local (SQLite)

- Adicionado `expo-sqlite` com um `DBProvider` (`src/database/sqlite.tsx`)
  plugado no `_layout.tsx` raiz, disponibilizando o banco pra qualquer tela
  via `useSQLiteContext()`.
- Criado um sistema de **migrations** versionado por `PRAGMA user_version`
  (`src/database/migrations/`) em vez de só um `CREATE TABLE` solto: cada
  tabela é uma migration separada, e o `user_version` garante que cada uma
  rode só uma vez por dispositivo — importante pra poder evoluir o schema
  (adicionar coluna, etc.) sem apagar dados de quem já usa o app.
- Corrigidos erros de SQL nas migrations: comentários com `//` (inválido em
  SQL — trocado por `--`/`/* */`), `DEFAULT P` sem aspas (interpretado como
  identificador em vez de string), `ON DELETE (CASCADE)` com parênteses
  (sintaxe errada), vírgula duplicada, e um `CREATE TABLE` sem o `)` de
  fechamento.
- As telas `gerandoGanho`/`gerandoGasto` agora fazem `INSERT` de verdade na
  tabela `movimentacoes`, e a `mainPage` faz `SELECT` pra listar os dados
  reais (no lugar do array de exemplo fixo que existia antes).
- Adicionado um botão de debug ("deletar table") que fecha a conexão
  (`db.closeAsync()`) e apaga o arquivo do banco (`SQLite.deleteDatabaseAsync`)
  — útil pra resetar o banco em homologação sem precisar desinstalar o app.

## Formulários de Ganho/Gasto

- Adicionado `InputDate` (`src/components/input/InputDate.tsx`): substitui o
  campo de texto livre da data por um seletor de data nativo
  (`@react-native-community/datetimepicker`). Mostra a data em `dd/mm/aaaa`
  pro usuário, mas guarda em ISO (`yyyy-mm-dd`) no formulário/banco — formato
  que ordena corretamente em `ORDER BY`.
- Adicionado `InputCheckbox` (`src/components/input/checkBox.tsx`) pro campo
  "Já foi paga".
- Depois de salvar com sucesso, o formulário é limpo com `reset()` do
  `react-hook-form` (antes os campos continuavam preenchidos após salvar).
- Adicionado `HeaderVoltar` (`src/components/HeaderVoltar.tsx`): cabeçalho
  reutilizável com botão de voltar (`router.back()`) usado nas duas telas.

## Estilo visual

- Criado `src/theme/colors.ts` e `src/theme/typography.ts` com a paleta e as
  fontes centralizadas, pra não espalhar cores soltas pelo código.
- Tema escuro (fundo cinza `#1a1920`, nunca preto puro) com **roxo**
  (`#8b5cf6`) como cor de marca (botões principais, links, campo em foco,
  checkbox marcado, FAB fechado) — **verde/vermelho ficam reservados só pro
  significado de ganho/gasto** (valores, ícones, botão "Salvar" de cada tipo),
  sem se misturar com o roxo.
- Instaladas e carregadas as fontes Sora (títulos/valores) e Manrope (corpo),
  via `@expo-google-fonts`, com a splash screen segurando o app até elas
  carregarem (`_layout.tsx`).
- Aplicado o tema em `ScreenWrapper`, `Button` (com variantes
  `purple`/`green`/`red`), `InputText`, `InputDate`, `InputCheckbox`,
  `ActionMovimentacao` e nas telas `index` (login), `mainPage`,
  `gerandoGanho` e `gerandoGasto`.
- Corrigido um flash branco rápido na lateral da tela ao voltar de
  `gerandoGanho` pra `mainPage`: não era o `ScreenWrapper`, e sim duas
  configurações nativas do Android que ainda apontavam pro branco padrão do
  Expo —`splash.backgroundColor` e principalmente `android.backgroundColor`
  (mapeia pro `android:windowBackground` do `AndroidManifest.xml`, usado
  durante transições de tela). Ambos ajustados pra cor de fundo do tema no
  `app.json`. Importante: `android.backgroundColor` é config nativa
  compilada — só reflete de verdade num build próprio
  (`expo prebuild` / `expo run:android` / dev client), o Expo Go não
  consegue simular essa parte.
