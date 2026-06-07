# 🧠 Gemini Instructions: CLEAN-NODE-API

Welcome! This workspace contains a full-stack monorepo featuring a highly decoupled, Clean Architecture/SOLID **Node.js Backend** and a modern **Angular Frontend**. This document serves as the architectural blueprint and operational reference for Gemini CLI sessions in this workspace.

---

## 📂 Project Overview & Directory Structure

The project structure guarantees strict isolation of concerns:

```text
/CLEAN-NODE-API
├── frontend/               # Angular Frontend Application (PrimeNG + Vitest)
├── src/                    # Clean Node API Backend (TypeScript + Jest)
│   ├── data/               # Business usecase implementations (interacts with protocols)
│   │   ├── protocols/      # Repository and helper interfaces/contracts
│   │   └── usecases/       # Implementations of Domain interfaces
│   ├── domain/             # Enterprise business rules (no external dependencies)
│   │   ├── models/         # Data structures/entities (e.g., AccountModel)
│   │   └── usecases/       # Domain business contracts (e.g., AddAccount, Authentication)
│   ├── infra/              # External frameworks & tools adapters (DB, Cryptography)
│   │   ├── criptography/   # Encryption adapters (Bcrypt)
│   │   └── db/             # Database drivers & helpers (MongoDB, MySQL)
│   ├── main/               # Composition Root (Framework setup, Routing, Factories)
│   │   ├── adapters/       # Express route & middleware adapters
│   │   ├── config/         # Middleware & route loader setups
│   │   ├── decorators/     # Log decorators (Cross-cutting concerns)
│   │   ├── factories/      # Controllers and Use Cases instantiation & injection
│   │   └── routes/         # Express endpoints configuration
│   ├── presentation/       # HTTP/Controller layer (Validations, Responses, Formatting)
│   │   ├── controllers/    # Request handlers (SignUp, Login, DeleteAccount, ListAccounts)
│   │   └── protocols/      # Controller & validation contracts
│   └── utils/              # Generic utility adapters (e.g., EmailValidator)
├── tests/                  # Unit and integration test suites colocated with source structures
└── env.ts                  # Backend environment configuration
```

---

## 🛠️ Technology Stack

### Backend
- **Core:** Node.js, TypeScript (v5.x), Express (v5.x), dotenv
- **Development Tools:** Nodemon, Sucrase (for fast local execution without pre-compiling)
- **Database Adapters:** 
  - **MongoDB:** High-performance NoSQL connectivity.
  - **MySQL 8.0:** Seamlessly integrated via `mysql2/promise` to handle relational schemas transparently under the Clean paradigm.
- **Testing:** Jest (v30.x) with custom unit and integration configurations, `@shelf/jest-mongodb` for Mongo memory server.

### Frontend
- **Core:** Angular (v22.x)
- **UI & Styling:** PrimeNG, PrimeIcons, Vanilla CSS/SCSS
- **Testing:** Vitest (v4.x), JSDOM
- **Build System:** Angular CLI (`@angular/build`)

### Infrastructure & DevOps
- **Docker Compose:** Orchestrates a container running **MySQL 8.0** and another running the Node API.
- **Table Provisioning (`init.sql`):** Mounted as a volume in MySQL at `/docker-entrypoint-initdb.d/init.sql`, ensuring that the `clean_node_api` database and its `accounts` and `errors` tables are automatically created on the first container startup.

---

## 🏃 Building and Running

### Using Docker Compose (Simplified Workflow)

To start the MySQL database and the Node application together with pre-configured tables:
```bash
docker compose up --build
```
This exposes:
- The Node API on port **5050** (`http://localhost:5050`)
- MySQL on local port **3307** (`localhost:3307`, user `root`, password `password`, database `clean_node_api`)

To stop the containers and release system resources:
```bash
docker compose down
```
To wipe persistency and recreate tables from scratch:
```bash
docker compose down -v
```

### Local Development Flow

#### 1. Backend
The backend uses configurations from `env.ts`.
To install dependencies and start the local development server with auto-reload (Nodemon + Sucrase):
```bash
npm install
npm run dev
```

#### 2. Frontend
Navigate to the frontend folder, install dependencies, and start the Angular server:
```bash
cd frontend
npm install
npm start
```
The frontend is available at `http://localhost:4200`.

---

## 🧪 Testing Guidelines

Testing is a core pillar of this codebase, adhering strictly to **TDD (Test-Driven Development)** and separation of concerns.

### Backend Testing Commands (Jest)

All backend tests are configured via Jest and located inside `src/tests`.

- **Run all tests (quiet, in-band):**
  ```bash
  npm test
  ```
- **Run unit tests only (watch mode):**
  ```bash
  npm run test:unit
  ```
- **Run integration tests only (watch mode):**
  ```bash
  npm run test:integration
  ```
- **Run staged tests (for pre-commit checks):**
  ```bash
  npm run test:staged
  ```
- **Run CI tests (with coverage reports):**
  ```bash
  npm run test:ci
  ```

### Frontend Testing Commands (Vitest)

In the frontend directory:
```bash
cd frontend
npm test
```

---

## 📐 Architectural Conventions & Coding Rules

When contributing to this workspace, adhere strictly to the following Clean Architecture guidelines:

1. **Strict Dependency Rule:**
   - **Domain Layer** has ZERO external dependencies (no express, no mysql, no packages). It defines only data interfaces and usecase declarations.
   - **Data Layer** depends on domain interfaces and generic protocols (like `AddAccountRepository`). It does NOT depend on express, mysql, or mongodb.
   - **Presentation Layer** depends only on domain use cases and controller protocols. It is agnostic to the HTTP server framework (Express/Fastify).
   - **Infrastructure Layer** implements the protocols defined in the `data` and `presentation` layers. This is where MongoDB, MySQL, Bcrypt, and third-party validators are used.
   - **Main Layer** is the ONLY layer allowed to couple everything together. It instantiates adapters, configurations, routes, and controllers using Factories.

2. **Interface Segregation & Dependency Inversion:**
   - Never instantiate classes directly within other classes (except for helpers or simple value objects).
   - Always inject dependencies via constructors using interfaces/protocols.

3. **No Hidden Logic / Suppressed Types:**
   - Rigorously adhere to full type safety. Avoid casts like `as any`, and do not disable TypeScript warnings or use `// @ts-ignore`.

4. **Cross-Cutting Concerns:**
   - Prefer explicit composition (e.g., decorating controllers with a `LogControllerDecorator` rather than writing middleware directly in the controller) to handle cross-cutting concerns like error logging.
