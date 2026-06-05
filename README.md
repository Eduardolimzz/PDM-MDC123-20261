# Gestão Financeira

Projeto acadêmico de Gestão Financeira desenvolvido com:

- Frontend em Expo/React Native;
- Backend em Node.js/Express;
- Banco MySQL com Prisma ORM;
- Collection do Postman para testar as rotas.

O app permite cadastrar categorias, registrar receitas/despesas, editar e excluir dados, filtrar por mês/ano, visualizar resumo financeiro e fazer login simples acadêmico.

## Estrutura Principal

```text
praticas/gestao-financeira/
├── gestao-financeira/        # Frontend Expo/React Native
└── gestao-financeira-api/    # Backend Express + Prisma + MySQL
```

## Backend

Pasta:

```text
praticas/gestao-financeira/gestao-financeira-api
```

Arquivos principais:

```text
prisma/schema.prisma
prisma/seed.js
src/server.js
src/lib/prisma.js
src/routes/auth.js
src/routes/categories.js
src/routes/transactions.js
src/schemas/authSchema.js
src/schemas/categorySchema.js
src/schemas/transactionSchema.js
src/middlewares/errorHandler.js
postman/collection.json
postman/instrucoes.md
```

### Models Prisma

O schema possui:

- `User`: usuário simples para login acadêmico;
- `Category`: categorias de receitas/despesas;
- `Transaction`: transações financeiras.

Arquivo:

```text
praticas/gestao-financeira/gestao-financeira-api/prisma/schema.prisma
```

### Login Acadêmico

Foi implementado somente o necessário para cumprir o requisito da atividade:

Rotas:

```http
POST /auth/register
POST /auth/login
```

Usuário padrão criado no seed:

```text
Nome: Administrador
Email: admin@admin.com
Senha: 123456
```

### Rotas Do Backend

Health-check:

```http
GET /
```

Auth:

```http
POST /auth/register
POST /auth/login
```

Categorias:

```http
GET /categories
POST /categories
PUT /categories/:id
DELETE /categories/:id
```

Transações:

```http
GET /transactions
POST /transactions
PUT /transactions/:id
DELETE /transactions/:id
```

## Rodar Backend

Entre na pasta da API:

```bash
cd praticas/gestao-financeira/gestao-financeira-api
```

Instale dependências:

```bash
npm install
```

Configure o `.env` com base no exemplo:

```bash
cp .env.example .env
```

Exemplo de `DATABASE_URL`:

```env
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/gestao_financeira"
PORT=3000
```

Gere o Prisma Client:

```bash
npx prisma generate
```

Rode as migrations:

```bash
npm run prisma:migrate
```

Rode o seed:

```bash
npm run prisma:seed
```

Inicie a API:

```bash
npm run dev
```

URL padrão:

```text
http://localhost:3000
```

## Postman

Arquivos:

```text
praticas/gestao-financeira/gestao-financeira-api/postman/collection.json
praticas/gestao-financeira/gestao-financeira-api/postman/instrucoes.md
```

A collection contém testes para:

- health-check;
- cadastro de usuário;
- login;
- login inválido;
- listar/criar/editar/excluir categorias;
- bloquear exclusão de categoria padrão;
- listar/criar/editar/excluir transações;
- validar erros com Zod.

Importe no Postman:

```text
postman/collection.json
```

Leia o passo a passo em:

```text
postman/instrucoes.md
```

## Frontend

Pasta:

```text
praticas/gestao-financeira/gestao-financeira
```

Arquivos principais:

```text
app/_layout.jsx
app/(tabs)/_layout.jsx
app/(tabs)/index.jsx
app/(tabs)/categories.jsx
app/(tabs)/add-transactions.jsx
app/(tabs)/summary.jsx
components/LoginScreen.jsx
components/PeriodFilter.jsx
components/TransactionItem.jsx
components/SummaryItem.jsx
contexts/GlobalState.jsx
services/api.js
constants/colors.js
styles/globalStyles.js
```

### Telas

- Login: `components/LoginScreen.jsx`;
- Transações: `app/(tabs)/index.jsx`;
- Categorias: `app/(tabs)/categories.jsx`;
- Adicionar Transação: `app/(tabs)/add-transactions.jsx`;
- Resumo: `app/(tabs)/summary.jsx`.

### Funcionalidades Do Frontend

- Login simples usando `/auth/login`;
- Cadastro simples usando `/auth/register`;
- Mensagem de boas-vindas na tela de Transações;
- Botão `Sair`;
- Listagem de transações em cards;
- Criação, edição e exclusão de transações;
- Listagem, criação, edição e exclusão de categorias customizadas;
- Categorias padrão sem botão de exclusão;
- Filtro local por mês/ano em Transações;
- Filtro local por mês/ano em Resumo;
- Card de saldo;
- Totais de receitas/despesas;
- Gráfico visual simples em barras, sem biblioteca externa;
- Estado global centralizado em `contexts/GlobalState.jsx`;
- Comunicação HTTP centralizada em `services/api.js`.

## Rodar Frontend

Entre na pasta do app:

```bash
cd praticas/gestao-financeira/gestao-financeira
```

Instale dependências:

```bash
npm install
```

Configure o `.env` com base no exemplo:

```bash
cp .env.example .env
```

Para Expo Web:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Para Android Emulator:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```

Para celular físico:

```env
EXPO_PUBLIC_API_URL=http://IP_DA_MAQUINA:3000
```

Inicie o app:

```bash
npm run web
```

ou:

```bash
npm run android
```

## Fluxo Para O Professor Testar

1. Subir o backend em `http://localhost:3000`.
2. Rodar migrations e seed.
3. Importar a collection do Postman.
4. Testar `POST /auth/login` com:

```json
{
  "email": "admin@admin.com",
  "password": "123456"
}
```

5. Rodar o frontend.
6. Fazer login no app com:

```text
Email: admin@admin.com
Senha: 123456
```

7. Conferir a mensagem:

```text
Olá, Administrador!
```

8. Criar uma categoria customizada.
9. Editar a categoria customizada.
10. Excluir a categoria customizada.
11. Confirmar que categorias padrão não exibem botão de exclusão.
12. Criar uma transação.
13. Editar a transação.
14. Excluir a transação.
15. Usar o filtro mês/ano em Transações.
16. Usar o filtro mês/ano em Resumo.
17. Conferir saldo, totais e gráfico visual no Resumo.
18. Clicar em `Sair` e confirmar que volta para o login.

## Observações Importantes

- O backend não usa autenticação real com token.
- O login foi implementado de forma simples para requisito acadêmico.
- As rotas de categorias e transações continuam públicas.
- O frontend guarda o usuário autenticado localmente para manter o login durante o uso do app.
- O Postman não precisa configurar Bearer Token.
- O Prisma Client precisa ser gerado novamente após alterações no schema:

```bash
npx prisma generate
```

## Comandos Rápidos

Backend:

```bash
cd praticas/gestao-financeira/gestao-financeira-api
npm install
npx prisma generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Frontend:

```bash
cd praticas/gestao-financeira/gestao-financeira
npm install
npm run web
```

## Status Da Entrega

Implementado:

- Backend com Prisma + MySQL;
- CRUD de categorias;
- CRUD de transações;
- Validações com Zod;
- Tratamento centralizado de erros;
- Login/cadastro acadêmico simples;
- Frontend integrado com API;
- Filtro mês/ano;
- Resumo com saldo, totais e gráfico visual;
- Postman atualizado;
- Documentação atualizada.
