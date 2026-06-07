# 🧠 Clean Node API & Angular Frontend

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Angular](https://img.shields.io/badge/Angular-22.x-red?logo=angular)](https://angular.dev/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue?logo=docker)](https://www.docker.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL_8.0-blue?logo=mysql)](https://www.mysql.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb)](https://www.mongodb.com/)
[![Jest](https://img.shields.io/badge/Tests-Jest-red?logo=jest)](https://jestjs.io/)
[![Vitest](https://img.shields.io/badge/Tests-Vitest-yellow?logo=vitest)](https://vitest.dev/)

This is a full-stack monorepo project featuring a highly decoupled, robust **Node.js Backend (TypeScript)** built using **Clean Architecture** and **SOLID** principles, and a modern **Angular Frontend (v22)** styled with **PrimeNG**.

---

## 📂 Overview & How the Application Works

The application is built on the core principle of **framework and database independence**. It adopts **Clean Architecture**, where the business domain (enterprise business rules) is kept isolated at the center, and external technologies (databases, web frameworks, encryption libraries) are pushed to the outer edges.

### 📐 Backend Architecture

Data flow follows a unidirectional path from the outside in, ensuring that business rules never depend on implementation details:

```text
[Client / Frontend]
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

1. **Domain Layer:** Contains business entities (`AccountModel`) and abstract usecase interfaces (`AddAccount`). It has absolutely zero external library dependencies.
2. **Data Layer:** Implements the usecases defined in the Domain layer. It orchestrates the flow of data (e.g., fetching a password, hashing it, and sending it to be saved) using repository contracts/protocols (`AddAccountRepository`).
3. **Presentation Layer:** Contains controllers responsible for handling HTTP requests and responses in a generic, framework-agnostic way.
4. **Infrastructure Layer:** Contains concrete implementations tightly coupled to specific frameworks or databases. This is where the **Bcrypt** cryptography adapter, the **MongoDB** driver, and the **MySQL** helper/repository reside.
5. **Main Layer:** The *Composition Root* of the application. It is the only layer aware of all other layers. It loads configurations, adapts Express to use our generic controllers, and instantiates classes while injecting the correct dependencies using factories.

---

## 🛠️ Technologies Used

### Backend
*   **Core:** Node.js, TypeScript (v5.x), Express (v5.x)
*   **Databases:** 
    *   **MySQL 8.0:** Used via `mysql2/promise` for fast, efficient query handling with Promise support.
    *   **MongoDB:** Native driver for NoSQL document storage.
*   **Development Tools:** 
    *   **Nodemon & Sucrase:** Enables running TypeScript files directly in real-time without the overhead of traditional compilation (`tsc`).
*   **Testing:** 
    *   **Jest (v30.x):** Fast unit and integration testing suite.
    *   `@shelf/jest-mongodb` for in-memory Mongo integration tests.

### Frontend
*   **Core:** Angular (v22.x) with TypeScript
*   **UI & Components:** PrimeNG (high-quality pre-built UI components and modern themes), PrimeIcons
*   **Styling:** Vanilla CSS/SCSS (straightforward, structured, utility-class-free custom styling)
*   **Testing:** Vitest (v4.x) and JSDOM

### Infrastructure & DevOps
*   **Docker & Docker Compose:** Complete containerization of the application and the MySQL database.
*   **Database Initializer (`init.sql`):** Mounted as a volume in MySQL at `/docker-entrypoint-initdb.d/init.sql` to automate database provisioning and schema creation (`accounts` and `errors` tables) on the first container startup.

---

## 🚀 Installation & Running

### Prerequisites
Make sure you have the following installed:
1.  **Docker Desktop** (with `docker compose` support)
2.  **Node.js (v20+)** and **npm** (if you want to run the project locally outside Docker)

---

### Method 1: Full Execution with Docker Compose (Recommended)

This method sets up both the Node application and the MySQL database in an isolated and automated way, running the `init.sql` script on the first launch.

1.  Open your terminal in the root directory:
    ```bash
    /Users/marcossilva/Documents/Udemy/Node/CLEAN-NODE-API
    ```
2.  Start the containers:
    ```bash
    docker compose up --build
    ```
3.  Docker will:
    *   Download and start MySQL 8.0 on local port **3307**.
    *   Run the `init.sql` script to create the `accounts` and `errors` tables.
    *   Build and launch the Node.js API on port **5050**.
4.  To stop the containers and free up memory on your Mac:
    ```bash
    docker compose down
    ```
    *Tip: To wipe the database and recreate tables from scratch using `init.sql`, run `docker compose down -v`.*

---

### Method 2: Local Execution (For Active Development)

For a fast feedback loop, you can run services individually.

#### Step 1: Start Only the Database (Docker)
Start only the MySQL service so your local backend can connect:
```bash
docker compose up -d mysql
```

#### Step 2: Run the Node.js Backend
1.  In the root folder, install the backend dependencies:
    ```bash
    npm install
    ```
2.  Start the API in development mode (with auto-reload):
    ```bash
    npm run dev
    ```
3.  The API will be available at `http://localhost:5050`.

#### Step 3: Run the Angular Frontend
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install frontend dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
4.  Your frontend will automatically open at `http://localhost:4200`.

---

## 🧪 Running Tests

Code quality is enforced through a strict test suite following TDD.

### Backend Tests (Jest)
Run these commands in the root directory:
*   **Run all tests:**
    ```bash
    npm test
    ```
*   **Unit Tests (Watch Mode):**
    ```bash
    npm run test:unit
    ```
*   **Integration Tests (Database and Express Routes):**
    ```bash
    npm run test:integration
    ```
*   **CI Tests with Coverage Report:**
    ```bash
    npm run test:ci
    ```

### Frontend Tests (Vitest)
Run inside the `frontend/` folder:
*   **Run Angular unit/component tests:**
    ```bash
    npm test
    ```
