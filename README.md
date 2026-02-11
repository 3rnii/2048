# 2048

A browser implementation of the 2048 puzzle game with an AI-powered move suggestion feature.

## Introduction

This project is a full-stack 2048 game: a React frontend (Vite) and a Node.js API server. Players slide numbered tiles on a 4×4 grid to merge them and reach the 2048 tile. The app includes an optional “Suggest a Move” feature that uses an AI (OpenAI-compatible API) to recommend the next move based on the current board.

## Features

- **The game**
  - Classic 2048 rules: combine tiles with the same number (2, 4, 8, … up to 2048).
  - Keyboard controls: Arrow keys or **W** (up), **A** (left), **S** (down), **D** (right).
  - Win state when a 2048 tile appears; game over when the grid is full and no move is possible.
  - New game can be started from the game-over modal.

- **Suggestion feature (OpenAI)**
  - “Suggest a Move” button sends the current board state to the backend.
  - The server uses an OpenAI-compatible API (e.g. Poe) to return a recommended direction (UP, DOWN, LEFT, RIGHT or NO MOVES) and short reasoning.

- **Test coverage**
  - Unit tests (Vitest) for game logic, reducer, context, helpers, components, and services.
  - React Testing Library for component and view-model tests where applicable.

- **E2E**
  - Cypress E2E tests for: presence of declared UI elements, keyboard input (arrows and W/A/S/D), and the suggestion flow with a mocked API response.

## Tech Stack

| Layer      | Technologies |
| ---------- | ------------ |
| Frontend   | React 19, TypeScript, Vite, Tailwind CSS |
| Backend    | Node.js, Express, TypeScript, OpenAI client (Poe API) |
| Testing    | Vitest, React Testing Library, Cypress |
| Tooling    | ESLint, TypeScript |

## Getting Started

### Prerequisites

- **Node.js** – v20.19+ or v22.12+ (see [Vite requirements](https://vite.dev/guide/#scaffolding-your-first-vite-project))
- **npm** (or another Node package manager)
- **OpenAI** API key or any OpenAI compatible api key (such as Poe's API key)

### Installation

From the project root:

```bash
npm run install-all
```

This installs dependencies for both the root (frontend) and `server/` (backend).

### Environment setup

**Backend (required for the suggestion feature)**

1. In the `server/` directory, copy the example env file:
   ```bash
   cp server/.env.example server/.env
   ```
2. Edit `server/.env` and set:
   - **`POE_API_KEY`** – API key for OpenAI-compatible service used by the suggestion endpoint. Suggest to use your own API key given from poe.com

**Frontend (optional)**

- The client talks to the API at `http://localhost:3000` by default.
- To use a different API base URL, create `.env` or `.env.local` in the project root and set:
  ```bash
  VITE_API_BASE_URL=http://your-api-host:port
  ```

### Running the app

1. Start both the frontend and the backend:
   ```bash
   npm run dev
   ```
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:3000](http://localhost:3000)

2. Open the frontend URL in a browser and play. Use arrow keys or W/A/S/D to move; use “Suggest a Move” (with a valid `POE_API_KEY`) to get AI suggestions.

## Testing

- **Unit / integration (Vitest)**  
  - Run all tests:  
    `npm run test`  
    (runs client tests then server tests.)
  - Client only:  
    `npm run test:client`
  - Server only:  
    `npm run test:server`
  - Watch mode (client):  
    `npm run test:watch`

- **E2E (Cypress)**  
  - Interactive Cypress UI (starts dev server then opens Cypress):  
    `npm run e2e`
  - Headless run (starts dev server then runs Cypress):  
    `npm run e2e:run`

See `cypress/README.md` for what each E2E spec covers.

## Project Structure

```
├── cypress/                                              # E2E tests (Cypress)
│   ├── e2e/                                              # Specs (ui-elements, keyboard, suggestion)
│   └── support/
├── server/                                               # Backend API
│   ├── routes/                                           # Express routes (health, prompt)
│   ├── service/                                          # OpenAI/Poe integration
│   └── __tests__/
├── src/
│   ├── common/                                           # Shared types, test IDs
│   ├── components/                                       # UI components and view models
│   │   ├── {Component}/
│   │   │   ├── Component.tsx/                            # View presentation of compoennt
│   │   │   └── Component.viewModel.tsx/                  # View model layer of the component
│   │   ├── ...
│   ├── contexts/                                         # React context (game state)
│   │   └── {context}/
│   │   │   ├── actions.tsx/                              # Actions to be dispatched from UI components
│   │   │   ├── context.tsx/                              # Context provider offering refined logic or queries on context state to UI components
│   │   │   ├── helper.tsx/                               # Helper functions used within this context
│   │   │   └── reducer.tsx/                              # State management of this context
│   ├── services/                                         # Services used in this application (i.e API calls to server)
│   ├── utils/                                            # Utility functions used across the application
│   ├── App.tsx
│   └── main.tsx
├── cypress.config.ts
├── vite.config.js
├── vitest.config.ts
└── package.json
```

## Script Reference

| Script            | Description |
| ----------------- | ----------- |
| `npm run dev`     | Start frontend (Vite) and backend (Express) together. |
| `npm run dev:client` | Start only the Vite dev server. |
| `npm run dev:server` | Start only the backend server. |
| `npm run build`   | Build frontend and backend for production. |
| `npm run build:client` | Build only the frontend. |
| `npm run build:server` | Build only the backend. |
| `npm run preview` | Serve the built frontend (after `build:client`). |
| `npm run test`    | Run client and server test suites. |
| `npm run test:client` | Run Vitest for the frontend. |
| `npm run test:server` | Run Vitest for the server. |
| `npm run test:watch` | Run Vitest in watch mode (frontend). |
| `npm run e2e`     | Start dev server and open Cypress UI. |
| `npm run e2e:run` | Start dev server and run Cypress headless. |
| `npm run lint`    | Run ESLint. |
| `npm run lint:fix`| Run ESLint with auto-fix. |
| `npm run install-all` | Install root and `server/` dependencies. |
