## Project Architecture Analysis

This project is a Bun-powered monorepo with a backend API, an Expo mobile app, and a shared contract package.

### 📐 Structure
*   **Monorepo**: The repository uses workspace packages under `apps/*` and `packages/*`, coordinated by Turborepo and Bun.
*   **Backend (`@cruxi/api`)**: Handles core business logic, RPC routing, authentication, and database persistence.
*   **Client (`@cruxi/mobile-app`)**: An Expo/React Native application that consumes the backend through strongly typed RPC contracts.
*   **Shared contract (`@cruxi/contract`)**: Defines the RPC contract shapes and is consumed by both API and mobile packages.

### 🚀 Key Technologies
*   **Language & Typing**: TypeScript is used throughout the monorepo.
*   **State Management & Data Fetching**: The mobile app uses **TanStack Query** (`@tanstack/react-query`) together with `@orpc/tanstack-query`.
*   **Backend Framework**: The API is built with **`@orpc/server`**, delivering type-safe RPC handlers.
*   **Authentication**: The backend uses **better-auth** with a Drizzle adapter and Expo auth integration.
*   **Database**: **Drizzle ORM** powers database access, with schema definitions in `apps/api/src/database/schema.ts` and migration configuration in `apps/api/drizzle.config.ts`.
*   **Mobile Navigation**: The Expo app uses **expo-router** and React Navigation for screen flow.

### 🏗️ Common Patterns & Best Practices

*   **Type Safety First**: RPC contracts, API implementations, and client calls are strongly typed across the stack.
*   **Contract-Driven Integration**: The `@cruxi/contract` workspace package centralizes the API contract used by `apps/api` and `apps/mobile`.
*   **Modular Domains**: The backend separates logic into domain services and route handlers, with auth middleware applied through `apps/api/src/orpc/authorized.orpc.ts`.

### 🧩 Integration Points
1.  **Client → API**: The mobile app calls backend RPC routes through `@orpc/client` and `@orpc/tanstack-query`.
2.  **API → Database**: The backend uses Drizzle ORM and database utilities from `apps/api/src/database/index.ts`.
3.  **Auth Flow**: better-auth manages authentication state and middleware for protected orpc routes.

### 🛠️ Running Scripts & Tooling

**Root monorepo:**
*   **Install dependencies**: `bun install`
*   **Dev orchestration**: `bun dev`
*   **Type checking**: `bun run type:check`

**Backend (apps/api):**
*   **Development Startup**: `bun --watch index.ts`
*   **Setup**: `bun run setup` starts Docker Compose and prepares the database.
*   **DB workflow**: `bun run db:dev`, `bun run db:push`, `bun run db:migrate`, `bun run db:seed`

**Mobile Client (apps/mobile):**
*   **Development Startup**: `expo start`
*   **Type checking**: `bun --prefix apps/mobile run type:check`

**General:**
*   **Database Migration**: Use `drizzle-kit` commands from `apps/api`, such as `bun run db:migrate` and `bun run db:push`.
