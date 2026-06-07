# 🧠 Clean Node API & Angular Frontend

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Angular](https://img.shields.io/badge/Angular-22.x-red?logo=angular)](https://angular.dev/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue?logo=docker)](https://www.docker.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL_8.0-blue?logo=mysql)](https://www.mysql.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb)](https://www.mongodb.com/)
[![Jest](https://img.shields.io/badge/Tests-Jest-red?logo=jest)](https://jestjs.io/)
[![Vitest](https://img.shields.io/badge/Tests-Vitest-yellow?logo=vitest)](https://vitest.dev/)

Este é um projeto full-stack monorepo composto por um **Backend em Node.js (TypeScript)** robusto e altamente desacoplado que segue os princípios de **Clean Architecture** e **SOLID**, e um **Frontend em Angular (v22)** com uma interface moderna construída usando **PrimeNG**.

---

## 📂 Visão Geral e Como a Aplicação Funciona

A aplicação é projetada sob o princípio da **independência de frameworks e bancos de dados**. Ela adota a **Clean Architecture**, onde o domínio de negócios (regras de negócio corporativas) fica isolado no centro, e as tecnologias externas (bancos de dados, frameworks web, bibliotecas de criptografia) são empurradas para as bordas.

### 📐 Arquitetura do Backend

O fluxo de dados segue uma linha unidirecional de fora para dentro, garantindo que as regras de negócio nunca dependam de detalhes de implementação:

```text
[Cliente / Frontend]
         │
         ▼
[Express Router (Main)] ───► [Express Routes Adapter]
                                       │
                                       ▼
                         [LogControllerDecorator (Main)]
                                       │
                                       ▼
                           [SignUpController (Presentation)]
                                       │
                                       ▼
                          [DbAddAccount (Data Usecase)]
                           /                         \
                          /                           \
                         ▼                             ▼
       [BcryptAdapter (Infra)]               [AccountMySqlRepository (Infra)]
                 │                                     │
                 ▼                                     ▼
        (Bcrypt / Crypto)                       (MySQL Database)
```

1. **Camada de Domínio (Domain):** Contém as entidades de negócio (`AccountModel`) e as definições abstratas dos casos de uso (`AddAccount`). Não possui nenhuma dependência de bibliotecas externas.
2. **Camada de Dados (Data):** Implementa os casos de uso definidos no Domínio. Ela gerencia o fluxo de dados (ex: busca a senha, criptografa e envia para salvar) usando contratos/protocolos de repositório (`AddAccountRepository`).
3. **Camada de Apresentação (Presentation):** Contém os Controllers responsáveis por lidar com requisições e respostas HTTP de forma genérica (independente de framework web).
4. **Camada de Infraestrutura (Infrastructure):** Onde estão as implementações concretas e acopladas a frameworks/bancos específicos. Aqui temos o adaptador do **Bcrypt** para criptografia, o driver do **MongoDB** e o helper/repositório do **MySQL**.
5. **Camada Principal (Main):** O *Composition Root* (ponto de entrada) da aplicação. É a única camada que conhece todas as outras. Ela carrega as configurações, adapta o Express para usar nossos controladores genéricos e instancia as classes injetando as dependências corretas usando fábricas (*Factories*).

---

## 🛠️ Tecnologias Utilizadas

### Backend
*   **Core:** Node.js, TypeScript (v5.x), Express (v5.x)
*   **Bancos de Dados:** 
    *   **MySQL 8.0:** Utilizado via `mysql2/promise` para queries rápidas e eficientes com suporte a Promises.
    *   **MongoDB:** Driver nativo para suporte a armazenamento NoSQL.
*   **Ferramentas de Desenvolvimento:** 
    *   **Nodemon & Sucrase:** Permite execução direta de arquivos TypeScript em tempo real sem a lentidão do processo de compilação tradicional (`tsc`).
*   **Testes:** 
    *   **Jest (v30.x):** Suíte de testes unitários e de integração extremamente rápida.
    *   `@shelf/jest-mongodb` para testes de integração com banco de dados em memória.

### Frontend
*   **Core:** Angular (v22.x) com TypeScript
*   **Visual e Componentes:** PrimeNG (temas modernos e componentes prontos de alta qualidade), PrimeIcons
*   **Estilização:** Vanilla CSS/SCSS (estilização direta e organizada, livre de classes utilitárias complexas)
*   **Testes:** Vitest (v4.x) e JSDOM

### Infraestrutura & DevOps
*   **Docker & Docker Compose:** Containerização completa da aplicação e do banco de dados MySQL.
*   **Script de Inicialização SQL (`init.sql`):** Automatiza a criação do banco de dados `clean_node_api` e de todas as tabelas necessárias (`accounts` e `errors`) assim que o banco é iniciado pela primeira vez.

---

## 🚀 Como Instalar e Executar

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
1.  **Docker Desktop** (com suporte ao comando `docker compose`)
2.  **Node.js (v20+)** e **npm** (caso queira rodar localmente fora do Docker)

---

### Método 1: Execução Completa via Docker Compose (Recomendado)

Este método levanta a aplicação Node e o banco de dados MySQL de forma totalmente isolada e automática, executando o script `init.sql` na primeira subida.

1.  Abra o terminal na pasta raiz do projeto:
    ```bash
    /Users/marcossilva/Documents/Udemy/Node/CLEAN-NODE-API
    ```
2.  Inicie os containers:
    ```bash
    docker compose up --build
    ```
3.  O Docker irá:
    *   Baixar e iniciar o MySQL 8.0 na porta local **3307**.
    *   Rodar o script `init.sql` para criar a tabela de usuários (`accounts`) e logs (`errors`).
    *   Compilar e iniciar a API do Node.js na porta **5050**.
4.  Para desligar os containers e liberar a memória do seu Mac:
    ```bash
    docker compose down
    ```
    *Dica: Se quiser apagar os dados do banco para recriar as tabelas do zero usando o `init.sql`, use `docker compose down -v`.*

---

### Método 2: Execução Local (Para Desenvolvimento Ativo)

Para desenvolver de forma ágil, você pode rodar os serviços individualmente.

#### Passo 1: Iniciar apenas o Banco de Dados (Docker)
Inicie apenas o serviço do MySQL para que o backend local possa se conectar:
```bash
docker compose up -g mysql
# ou simplesmente iniciar o container mysql individualmente
```

#### Passo 2: Executar o Backend Node.js
1.  Na raiz do projeto, instale as dependências:
    ```bash
    npm install
    ```
2.  Inicie a API em modo de desenvolvimento (com auto-reload):
    ```bash
    npm run dev
    ```
3.  A API estará rodando em `http://localhost:5050`.

#### Passo 3: Executar o Frontend Angular
1.  Navegue até a pasta do frontend:
    ```bash
    cd frontend
    ```
2.  Instale as dependências do Angular:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm start
    ```
4.  O seu frontend abrirá automaticamente em `http://localhost:4200`.

---

## 🧪 Como Executar os Testes

A qualidade do código é mantida através de uma cobertura de testes rigorosa (TDD).

### Testes do Backend (Jest)
Rode os seguintes comandos na pasta raiz:
*   **Executar todos os testes:**
    ```bash
    npm test
    ```
*   **Testes Unitários em tempo real (Watch Mode):**
    ```bash
    npm run test:unit
    ```
*   **Testes de Integração (Banco de dados e Rotas Express):**
    ```bash
    npm run test:integration
    ```
*   **Testes com Relatório de Cobertura (CI):**
    ```bash
    npm run test:ci
    ```

### Testes do Frontend (Vitest)
Rode na pasta `frontend/`:
*   **Executar testes do Angular:**
    ```bash
    npm test
    ```
