# Anotações: banco de dados

## Migrations

**O que é:** um passo de alteração na **estrutura** do banco (criar tabela, adicionar coluna, mudar tipo...).

O banco mora no celular do usuário, junto com os dados dele. Não dá para apagar e recriar a cada versão, então as mudanças viram uma **lista de passos em ordem**, e cada celular roda só os que faltam.

**Como funciona neste projeto:**

- Cada arquivo em `src/database/migrations/` é um passo.
- O array `migrations` em `index.tsx` é a lista, e **a posição no array é a versão**.
- O `PRAGMA user_version` é um número guardado dentro do próprio banco que diz quantos passos já rodaram.
- O `runMigrations` faz `for (i = user_version; i < migrations.length; i++)`, ou seja, roda só as que faltam e depois grava o novo total.

### Regras

1. **Nunca editar uma migration que já foi lançada.** Ela já rodou no celular dos usuários e não roda de novo, então a edição nunca chega lá.
   - Exemplo: `user_version = 4` e o array tem 4 itens → o `for` começa em 4 e roda enquanto `i < 4` → não roda nada.
2. **Mudou a estrutura? Crie uma migration nova, no FINAL do array.** Isso aumenta o `length` e faz o `for` rodar só ela. Os dados existentes são **preservados**.
   - Ex.: `ALTER TABLE categorias ADD COLUMN cor TEXT`. Uma migration não precisa criar tabela, pode só alterar.
3. **Nunca apagar migrations antigas.** Quem instala o app do zero (`user_version = 0`) precisa rodar todas, desde a primeira.
4. **Nunca reordenar o array.** Os celulares já instalados rodariam os passos errados.

### Enquanto o app não foi lançado

As regras acima protegem **quem já tem o app instalado**. Enquanto só eu uso:

- posso editar as migrations existentes à vontade;
- depois de editar, **limpo os dados do app** (Configurações → Apps → Limpar dados) ou reinstalo, e o banco é recriado do zero.

As regras passam a valer na primeira versão que outras pessoas instalarem.

### Organização

- A lista cresce com o tempo, e isso é normal. Cada migration roda **uma vez só** por celular, então não pesa.
- **Numerar os arquivos** (`001_cria_categorias.ts`, `005_categorias_adiciona_cor.ts`) deixa a ordem visível.
- Dá para separar em **pastas** (ex.: uma por tabela). A pasta não importa para o banco: o que vale é a **ordem do array**. Mover um arquivo só muda o caminho do `import`.

### Como adicionar uma migration

1. Criar o arquivo novo em `src/database/migrations/`.
2. Escrever a função no mesmo formato das outras (`async`, recebe o `db`, chama `db.execAsync(...)` com o SQL).
3. Importar no `index.tsx` e colocar **no final** do array.

## Dá para evitar migrations?

Não. Se a estrutura muda e existem dados antigos, alguém precisa converter. Dá só para deixar o trabalho mais leve:

- **ORM que gera as migrations**, como o **Drizzle** (funciona com o `expo-sqlite`). As tabelas são descritas em TypeScript, e um comando gera o SQL da migration comparando com a versão anterior. Ainda dá tipos automáticos nas consultas. Popular no ecossistema Expo.
- **Coluna JSON** para dados "extras": entra campo novo sem `ALTER TABLE`, mas perco filtrar, ordenar e relacionar esses campos.

**Outras ferramentas usam o mesmo conceito:**

- **Room (Android nativo):** versão do banco (guardada no mesmo `user_version`), migrations manuais e AutoMigrations para mudanças simples. Se faltar migration, o app fecha com erro. O `fallbackToDestructiveMigration()` apaga tudo e recria, e só se usa em desenvolvimento ou com dados de cache.
- **WatermelonDB:** também tem migrations. Usa módulo nativo, então não roda no Expo Go.

**Conclusão:** migrations são justamente o que **evita** perder dados. Aprender com SQL puro primeiro ajuda a entender o que um ORM faz por baixo.

## Salvar em arquivo (JSON) em vez de SQLite?

Funciona, mas o trabalho do banco vira meu:

| Tarefa | SQLite | Arquivo JSON |
|---|---|---|
| Buscar só um mês | `WHERE` | ler tudo e filtrar no código |
| Alterar um registro | `UPDATE` em uma linha | reescrever o arquivo inteiro |
| Relacionar tabelas | `JOIN` | ligar na mão |
| App fecha no meio da gravação | transação protege | arquivo pode corromper |

O problema de mudar o formato continua existindo (teria que criar minhas próprias "migrations").

**Quando usar arquivo/chave-valor:** dados pequenos, como preferências. Para o app financeiro, **SQLite**.

## Banco externo (servidor)

- **pgAdmin não é banco.** É um programa para visualizar e administrar um **PostgreSQL** (como o DBeaver).
- **O app NUNCA se conecta direto no Postgres.** Usuário e senha do banco ficariam dentro do APK, e qualquer um extrairia e teria acesso aos dados de todos. Sempre precisa de algo no meio:
  - **API própria:** um servidor (ex.: Node) conversa com o banco, e o app conversa com a API.
  - **BaaS (ex.: Supabase):** a camada já vem pronta, com login, storage e regras de acesso (Row Level Security).

### SQLite local × banco externo

| | SQLite | Banco externo |
|---|---|---|
| Internet | não precisa | precisa (ou tratar offline) |
| Vários aparelhos / web | não | sim |
| Backup se perder o celular | não | sim |
| Login | não precisa | precisa |
| Custo | zero | grátis até um limite |

- **Meio-termo:** SQLite no celular + sincronização com o servidor. É o mais completo e o mais trabalhoso.
- **Migrations no servidor:** ficam no projeto, no computador (ex.: `supabase/migrations/*.sql`), e **eu** aplico uma vez no servidor. Elas não vão para o celular, e é um banco só para atualizar.
  - Hoje, no SQLite, as migrations também não são "arquivos no telefone": viram parte do código do app.
- **Outro projeto usando o mesmo banco** (ex.: um site em Next.js): funciona, desde que
  - as migrations fiquem em **um lugar só** (um projeto "dono" do banco ou um repositório separado);
  - os tipos sejam gerados do banco (`supabase gen types`) e usados nos dois projetos;
  - as regras de acesso (RLS) fiquem no banco, para valer igual para os dois.

### Como me preparar para trocar depois

- **Centralizar as consultas:** hoje elas estão dentro das telas (ex.: `db.getAllAsync` no `categorias.tsx`). Criar funções como `listarCategorias()` e `criarCategoria()` num arquivo só (ex.: `src/database/categorias.ts`). As telas chamam as funções e não sabem qual banco existe por trás, então na troca mudo só esse arquivo.
- **IDs:** `INTEGER AUTOINCREMENT` conflita quando dois aparelhos sincronizam (os dois criam `id = 5`). Quem planeja sincronizar usa **UUID**.
- **Trabalho novo de qualquer jeito:** login, levar os dados que já estão no celular para o servidor e, se quiser, modo offline.

## Opções gratuitas (pesquisado em 03/11/2026)

| | Supabase | Render | alwaysdata |
|---|---|---|---|
| Tipo | BaaS (API e login prontos) | hospedagem | hospedagem |
| Preciso escrever API? | não | sim | sim |
| Banco | Postgres, 500 MB | Postgres, ~1 GB | Postgres/MySQL, 1 GB total (disco) |
| Expira? | não, mas **pausa após 1 semana sem uso** (reativar no painel) | **sim, banco apagado ~30 dias após criado** | não ("para sempre", uso pessoal) |
| Backup grátis | não | não | 3 dias |
| Outros | 5 GB de tráfego/mês, 1 GB de arquivos, 50 mil usuários/mês, 2 projetos | servidor dorme após ~15 min sem acesso (~1 min para acordar) | 256 MB de RAM, ¼ de CPU, hospeda Node/Python/PHP |

⚠️ Os números do **Render** são de memória (o site estava fora do ar na pesquisa), e os tipos de banco e o Node do **alwaysdata** também. Confirmar em render.com/docs/free e help.alwaysdata.com.

**Decisão:**

- **Caminho mais fácil:** Supabase, porque não preciso escrever servidor. Fazer exportação de backup de vez em quando, por conta própria.
- **Para aprender a criar uma API:** alwaysdata (API + banco juntos, de graça, sem expirar).
- **Render grátis:** não serve para guardar dados de verdade (expira).
- **Por enquanto:** o SQLite local atende ao app.

## Exercícios pendentes

1. Com o app lançado e 200 movimentações salvas, criei uma migration que adiciona a coluna `cor`. O que acontece com as 200 movimentações? Qual valor a `cor` tem nas categorias que já existiam?
2. Num celular que instala o app hoje (`user_version = 0`), quais migrations rodam?
3. Se eu mover o `categorias.ts` para uma pasta e só ajustar o `import`, alguma migration roda de novo? Por quê?
4. Escrever a migration que adiciona a coluna `cor` em `categorias` (`ALTER TABLE <tabela> ADD COLUMN <coluna> <tipo>`).
5. Tirar a consulta de dentro do `categorias.tsx` e criar a função `listarCategorias()` num arquivo separado.
