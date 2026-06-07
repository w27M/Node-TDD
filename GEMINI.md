# 🧠 Gemini Instructions: CLEAN-NODE-API

Bem-vindo! Este espaço de trabalho contém um monorepo full-stack apresentando um **Backend Node.js** construído com os princípios de Clean Architecture/SOLID e um **Frontend Angular** moderno e desacoplado. Este documento serve como blueprint arquitetural, guia técnico e referência operacional para sessões de desenvolvimento com assistentes de IA (como Gemini CLI) neste projeto.

---

## 📂 Visão Geral do Projeto e Estrutura de Diretórios

A estrutura de arquivos garante um isolamento estrito de responsabilidades:

```text
/CLEAN-NODE-API
├── frontend/               # Aplicação Frontend em Angular (PrimeNG + Vitest)
├── src/                    # Backend Clean Node API (TypeScript + Jest)
│   ├── data/               # Implementações de casos de uso de negócios (interage com protocolos)
│   │   ├── protocols/      # Interfaces e contratos de Repositórios e Helpers
│   │   └── usecases/       # Implementações das interfaces de caso de uso do Domínio
│   ├── domain/             # Regras de negócios corporativas puras (sem dependências externas)
│   │   ├── models/         # Estruturas de dados / Entidades (ex: AccountModel)
│   │   └── usecases/       # Contratos de negócios do Domínio (ex: AddAccount, Authentication)
│   ├── infra/              # Adaptadores de ferramentas e frameworks externos (Banco de dados, Criptografia)
│   │   ├── criptography/   # Adaptadores de criptografia (Bcrypt)
│   │   └── db/             # Conexões e ajudantes de banco de dados (MongoDB, MySQL)
│   ├── main/               # Raiz de Composição / Composition Root (Inicialização do Framework, Rotas, Fábricas)
│   │   ├── adapters/       # Adaptadores de rotas e middlewares do Express
│   │   ├── config/         # Configurações de carregamento de rotas e middlewares
│   │   ├── decorators/     # Decoradores de log (Tratamento transversal de erros)
│   │   ├── factories/      # Instanciação de controladores/casos de uso e injeção de dependências
│   │   └── routes/         # Configuração de endpoints do Express
│   ├── presentation/       # Camada HTTP/Controlador (Validações, Respostas, Formatação)
│   │   ├── controllers/    # Manipuladores de requisição (SignUp, Login, DeleteAccount, ListAccounts)
│   │   └── protocols/      # Contratos de controladores e validações
│   └── utils/              # Adaptadores de utilitários genéricos (ex: EmailValidator)
├── tests/                  # Suítes de testes unitários e integração colocalizados com a fonte
└── env.ts                  # Configurações de ambiente do Backend
```

---

## 🛠️ Stack Tecnológica

### Backend
- **Core:** Node.js, TypeScript (v5.x), Express (v5.x), dotenv
- **Desenvolvimento:** Nodemon, Sucrase (para execução local instantânea sem necessidade de compilar previamente com `tsc`)
- **Adaptadores de Banco de Dados:** 
  - **MongoDB:** Conectividade NoSQL de alta performance.
  - **MySQL 8.0:** Implementado de forma transparente via `mysql2/promise` para gerenciar tabelas relacionais em conjunto com o paradigma Clean.
- **Testes:** Jest (v30.x) configurado individualmente para suítes unitárias e de integração (`@shelf/jest-mongodb` para banco Mongo em memória).

### Frontend
- **Core:** Angular (v22.x)
- **UI & Design:** PrimeNG, PrimeIcons, Vanilla CSS/SCSS
- **Testes:** Vitest (v4.x), JSDOM
- **Build:** Angular CLI (`@angular/build`)

### Infraestrutura & Docker
- **Docker Compose:** Orquestra um container com o banco de dados **MySQL 8.0** e outro com a própria API Node.
- **Automatização de Tabelas (`init.sql`):** Configurado como volume do MySQL no caminho `/docker-entrypoint-initdb.d/init.sql`, garantindo que o banco de dados `clean_node_api` e as tabelas `accounts` e `errors` sejam provisionados na primeira inicialização do container.

---

## 🏃 Como Construir e Executar

### Utilizando o Docker Compose (Fluxo Simplificado)

Para levantar o banco de dados MySQL e a aplicação Node integrada automaticamente com as tabelas criadas:
```bash
docker compose up --build
```
Isso expõe:
- A API Node na porta **5050** (`http://localhost:5050`)
- O MySQL na porta local **3307** (`localhost:3307`, usuário `root`, senha `password`, banco `clean_node_api`)

Para desligar os containers e liberar recursos:
```bash
docker compose down
```
Se precisar recriar as tabelas limpando os dados persistidos:
```bash
docker compose down -v
```

### Desenvolvimento Local Individual

#### 1. Backend
O backend consome configurações do arquivo `env.ts`.
Para instalar as dependências e iniciar o servidor com auto-reload (Nodemon + Sucrase):
```bash
npm install
npm run dev
```

#### 2. Frontend
Navegue para o diretório do frontend, instale as dependências e inicie o servidor do Angular:
```bash
cd frontend
npm install
npm start
```
O frontend estará acessível em `http://localhost:4200`.

---

## 🧪 Diretrizes de Teste (TDD)

Os testes são a espinha dorsal deste projeto, seguindo o fluxo de **Desenvolvimento Orientado a Testes (TDD)** e isolamento absoluto.

### Comandos de Teste do Backend (Jest)

Todos os testes do backend estão centralizados dentro de `src/tests`.

- **Executar todos os testes:**
  ```bash
  npm test
  ```
- **Executar apenas testes unitários (Modo de observação / Watch):**
  ```bash
  npm run test:unit
  ```
- **Executar apenas testes de integração (Watch):**
  ```bash
  npm run test:integration
  ```
- **Executar testes em modo de verificação de pré-commit (Staged):**
  ```bash
  npm run test:staged
  ```
- **Executar testes em CI com relatórios de cobertura:**
  ```bash
  npm run test:ci
  ```

### Comandos de Teste do Frontend (Vitest)

No diretório do frontend:
```bash
cd frontend
npm test
```

---

## 📐 Convenções Arquiteturais e Regras de Código

Ao propor ou implementar alterações no código, siga rigorosamente estas regras:

1. **Regra de Dependência Estrita:**
   - **Camada de Domínio (Domain):** ZERO dependências externas (sem express, sem mysql, sem bibliotecas de terceiros). Declara apenas entidades e assinaturas de contratos de casos de uso.
   - **Camada de Dados (Data):** Depende apenas do Domínio e de protocolos abstratos de infraestrutura (ex: `AddAccountRepository`). Nunca se acopla a Express ou drivers específicos.
   - **Camada de Apresentação (Presentation):** Depende estritamente de interfaces de controle e de casos de uso do Domínio. É 100% agnóstica de frameworks web (pode ser usada com Express, Fastify ou CLI).
   - **Camada de Infraestrutura (Infrastructure):** Onde os pacotes externos, drivers e adaptadores reais de banco de dados (MySQL, MongoDB) e criptografia são injetados de forma isolada.
   - **Camada Principal (Main):** Apenas esta camada (Compositon Root) pode acoplar tudo, utilizando *Factories* para criar as instâncias e injetá-las.

2. **Segregação de Interfaces e Inversão de Dependência:**
   - Nunca instancie classes diretamente dentro de outras (exceto helpers leves ou objetos de valor). 
   - Sempre utilize injeção de dependência pelo construtor baseando-se em interfaces de protocolo.

3. **Tipagem Forte e Completa:**
   - Nunca utilize casts evasivos como `as any`, comentários de supressão `// @ts-ignore` ou desabilite regras do compilador. Mantenha tipagem expressiva e segura.

4. **Tratamento Transversal de Erros:**
   - Utilize Decoradores (como `LogControllerDecorator`) para envelopar controladores e processar logs de erro de forma centralizada e limpa, em vez de poluir os controladores individuais com código de rastreamento.
