# Gestão Financeira API - Documentação Backend e Postman

## Objetivo

Este documento explica como configurar, executar e testar a API do projeto **Gestão Financeira**.

A API foi desenvolvida para salvar e gerenciar:

* Usuários simples para login acadêmico;
* Categorias de receitas e despesas;
* Transações financeiras;
* Validações de entrada;
* Regras de negócio, como impedir exclusão de categorias padrão.

A validação dos endpoints foi realizada usando uma Collection do Postman localizada em:

```text
postman/collection.json
```

---

# 1. Pré-requisitos

Antes de iniciar, é necessário ter instalado:

* Node.js
* npm
* MySQL Server
* Postman
* DBeaver ou outro cliente visual para banco de dados, opcionalmente

---

# 2. Acessar a pasta da API

A partir da raiz do projeto, entre na pasta do backend:

```bash
cd praticas/gestao-financeira/gestao-financeira-api
```

Confirme se a pasta contém arquivos como:

```text
package.json
prisma/
src/
.env.example
```

---

# 3. Instalar as dependências

Execute:

```bash
npm install
```

ou:

```bash
npm i
```

Esse comando instala as dependências do projeto, incluindo:

* Express
* Prisma
* Zod
* Nodemon
* CORS
* MySQL client

---

# 4. Gerar Prisma Client

Após instalar as dependências, execute:

```bash
npx prisma generate
```

Esse comando gera o Prisma Client com base no arquivo:

```text
prisma/schema.prisma
```

Ele é necessário para que o backend consiga conversar com o banco de dados usando o Prisma.

---

# 5. Rodar as migrations

Execute:

```bash
npm run prisma:migrate
```

Esse comando aplica as migrations do Prisma e cria as tabelas necessárias no banco.

Caso seja necessário resetar o banco local durante os testes, use:

```bash
npx prisma migrate reset
```

Esse comando apaga as tabelas, recria tudo pelas migrations e pode executar o seed novamente.

---

# 6. Executar o seed

Execute:

```bash
npm run prisma:seed
```

Esse comando popula o banco com as categorias padrão:

* income
* food
* house
* education
* travel

Também cria o usuário padrão para login acadêmico:

```text
Nome: Administrador
Email: admin@admin.com
Senha: 123456
```

Essas categorias são necessárias para os testes da Collection.

---

# 7. Iniciar a API

Execute:

```bash
npm run dev
```

A API deve iniciar com uma mensagem parecida com:

```text
API rodando em http://localhost:3000
```

A partir disso, a API estará disponível em:

```text
http://localhost:3000
```

---

# 8. Importar a Collection no Postman

1. Abra o Postman.
2. Clique em **Import**.
3. Selecione o arquivo:

```text
postman/collection.json
```

4. Confirme a importação.
5. Será criada a Collection:

```text
Gestão Financeira API
```

---

# 9. Variáveis da Collection

A Collection utiliza variáveis para facilitar os testes.

| Variável        | Valor inicial           | Descrição                                   |
| --------------- | ----------------------- | ------------------------------------------- |
| `baseUrl`       | `http://localhost:3000` | URL base da API                             |
| `incomeId`      | vazio                   | ID da categoria padrão `income`             |
| `categoryId`    | vazio                   | ID da categoria customizada criada no teste |
| `transactionId` | vazio                   | ID da transação criada no teste             |
| `userId`        | vazio                   | ID do usuário criado ou autenticado         |

Antes de rodar algumas requisições, será necessário preencher manualmente os IDs retornados pelas respostas anteriores.

---

# 10. Ordem completa de testes no Postman

## 10.1 Health-check

### Objetivo

Verificar se a API está online.

### Requisição

```http
GET {{baseUrl}}
```

### Resposta esperada

```json
{
  "ok": true,
  "name": "gestao-financeira-api"
}
```

Status esperado:

```text
200 OK
```

---

## 10.2 Cadastrar usuário

### Objetivo

Validar o cadastro simples de usuário usado pelo requisito acadêmico de login.

### Requisição

```http
POST {{baseUrl}}/auth/register
```

### Body

```json
{
  "name": "Eduardo",
  "email": "eduardo@email.com",
  "password": "123456"
}
```

### Resposta esperada

Status:

```text
201 Created
```

Exemplo de resposta:

```json
{
  "id": "...",
  "name": "Eduardo",
  "email": "eduardo@email.com"
}
```

### Observação

Se o mesmo email já tiver sido cadastrado antes, a API retorna:

```text
409 Conflict
```

com:

```json
{
  "error": "Registro duplicado"
}
```

---

## 10.3 Login de usuário

### Objetivo

Validar o login simples usando o usuário padrão criado no seed.

### Requisição

```http
POST {{baseUrl}}/auth/login
```

### Body

```json
{
  "email": "admin@admin.com",
  "password": "123456"
}
```

### Resposta esperada

Status:

```text
200 OK
```

Corpo esperado:

```json
{
  "id": "...",
  "name": "Administrador",
  "email": "admin@admin.com"
}
```

### Ação após executar

Copie o `id` retornado e, se desejar, preencha a variável:

```text
userId
```

Não há token JWT nesta implementação.

---

## 10.4 Login inválido

### Objetivo

Validar erro de acesso quando email ou senha não conferem.

### Requisição

```http
POST {{baseUrl}}/auth/login
```

### Body

```json
{
  "email": "admin@admin.com",
  "password": "senha-errada"
}
```

### Resposta esperada

Status:

```text
401 Unauthorized
```

Corpo esperado:

```json
{
  "error": "Credenciais inválidas"
}
```

---

## 10.5 Listar categorias

### Objetivo

Verificar se o seed criou corretamente as categorias padrão.

### Requisição

```http
GET {{baseUrl}}/categories
```

### Resposta esperada

Deve retornar uma lista contendo as categorias:

```text
income
food
house
education
travel
```

### Ação após executar

Copie o `id` da categoria com:

```json
"name": "income"
```

Depois preencha a variável da Collection:

```text
incomeId
```

---

## 10.6 Criar categoria

### Objetivo

Criar uma nova categoria customizada.

### Requisição

```http
POST {{baseUrl}}/categories
```

### Body

```json
{
  "name": "health",
  "displayName": "Saúde",
  "icon": "favorite",
  "background": "#FFB6B6",
  "isIncome": false
}
```

### Resposta esperada

Status:

```text
201 Created
```

A resposta deve conter o objeto criado, incluindo o `id`.

### Ação após executar

Copie o `id` retornado e preencha a variável:

```text
categoryId
```

---

## 10.7 Atualizar categoria

### Objetivo

Atualizar a categoria customizada criada anteriormente.

### Requisição

```http
PUT {{baseUrl}}/categories/{{categoryId}}
```

### Body

```json
{
  "displayName": "Saúde e Bem-estar"
}
```

### Resposta esperada

Status:

```text
200 OK
```

A resposta deve mostrar a categoria com o novo `displayName`.

---

## 10.8 Excluir categoria customizada

### Objetivo

Excluir a categoria criada no teste.

### Requisição

```http
DELETE {{baseUrl}}/categories/{{categoryId}}
```

### Resposta esperada

Status:

```text
204 No Content
```

Não deve retornar corpo na resposta.

---

## 10.9 Excluir categoria padrão

### Objetivo

Validar a regra de negócio que impede excluir categorias padrão.

### Pré-requisito

A variável `incomeId` deve estar preenchida com o ID da categoria padrão `income`.

### Requisição

```http
DELETE {{baseUrl}}/categories/{{incomeId}}
```

### Resposta esperada

Status:

```text
400 Bad Request
```

Corpo esperado:

```json
{
  "error": "Categorias padrão não podem ser excluídas"
}
```

---

## 10.10 Criar transação

### Objetivo

Criar uma transação financeira vinculada a uma categoria.

### Pré-requisito

A variável `incomeId` deve estar preenchida.

### Requisição

```http
POST {{baseUrl}}/transactions
```

### Body

```json
{
  "description": "Salário de outubro",
  "value": 3500.50,
  "date": "2026-04-29",
  "categoryId": "{{incomeId}}"
}
```

### Resposta esperada

Status:

```text
201 Created
```

A resposta deve conter a transação criada e a categoria aninhada.

### Ação após executar

Copie o `id` da transação e preencha a variável:

```text
transactionId
```

---

## 10.11 Listar transações

### Objetivo

Listar as transações cadastradas.

### Requisição

```http
GET {{baseUrl}}/transactions
```

### Resposta esperada

Status:

```text
200 OK
```

A resposta deve conter uma lista de transações, incluindo a categoria associada.

---

## 10.12 Atualizar transação

### Objetivo

Atualizar a descrição da transação criada.

### Pré-requisito

A variável `transactionId` deve estar preenchida.

### Requisição

```http
PUT {{baseUrl}}/transactions/{{transactionId}}
```

### Body

```json
{
  "description": "Salário Atualizado"
}
```

### Resposta esperada

Status:

```text
200 OK
```

A resposta deve conter a transação atualizada.

---

## 10.13 Excluir transação

### Objetivo

Excluir a transação criada durante o teste.

### Requisição

```http
DELETE {{baseUrl}}/transactions/{{transactionId}}
```

### Resposta esperada

Status:

```text
204 No Content
```

Não deve retornar corpo na resposta.

---

## 10.14 Validar erro de categoria

### Objetivo

Confirmar que o servidor valida dados inválidos com Zod.

### Requisição

```http
POST {{baseUrl}}/categories
```

### Body inválido

```json
{}
```

### Resposta esperada

Status:

```text
400 Bad Request
```

Exemplo de resposta:

```json
{
  "error": "Dados inválidos",
  "details": []
}
```

O campo `details` pode conter a lista de problemas encontrados na validação.

---

## 10.15 Validar erro de transação

### Objetivo

Confirmar que o servidor bloqueia criação de transação inválida.

### Requisição

```http
POST {{baseUrl}}/transactions
```

### Body inválido

```json
{
  "description": ""
}
```

### Resposta esperada

Status:

```text
400 Bad Request
```

Exemplo de resposta:

```json
{
  "error": "Dados inválidos",
  "details": []
}
```

---

# 11. Autenticação

A versão atual possui apenas um login acadêmico simples para cumprir o requisito da atividade.

Foram criadas as rotas:

```text
POST /auth/register
POST /auth/login
```

Importante:

* Não existe JWT;
* Não existe Bearer Token;
* Não existe refresh token;
* Não existe middleware protegendo rotas;
* As rotas de categorias e transações continuam públicas;
* A senha é salva em texto simples apenas por simplicidade acadêmica.

Usuário padrão do seed:

```text
Email: admin@admin.com
Senha: 123456
```

No frontend, ao fazer login com sucesso, o app guarda o usuário retornado no contexto e exibe:

```text
Olá, Administrador!
```

O botão `Sair` limpa o usuário no frontend.

---

# 12. Possíveis erros e soluções

## Erro: variável não encontrada no Postman

Se aparecer uma variável em laranja, como:

```text
{{incomeId}}
```

significa que ela ainda não foi preenchida.

Solução:

1. Execute a requisição anterior.
2. Copie o ID retornado.
3. Vá em **Collection > Variables**.
4. Cole o valor na variável correspondente.

---

## Erro: categoria duplicada

Se tentar criar a categoria `health` mais de uma vez, pode ocorrer erro de registro duplicado.

Solução:

* Excluir a categoria criada;
* Ou resetar o banco com:

```bash
npx prisma migrate reset
```

---

## Erro: banco não encontrado

Verifique se o banco foi criado:

```sql
CREATE DATABASE IF NOT EXISTS gestao_financeira;
```

---

## Erro: API não responde

Verifique se o servidor está rodando:

```bash
npm run dev
```

---

# 13. Resultado esperado final

Ao seguir esta documentação, deve ser possível:

* Subir a API localmente;
* Criar as tabelas no banco;
* Inserir os dados iniciais;
* Importar a Collection;
* Testar todas as rotas;
* Confirmar as validações;
* Confirmar as regras de negócio;
* Validar que o backend está funcionando corretamente.
