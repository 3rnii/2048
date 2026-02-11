# E2E tests (Cypress)

## Run E2E tests

- **Interactive (Cypress UI):** `npm run e2e`  
  Starts the dev server, then opens Cypress. Run specs from the UI.

- **Headless:** `npm run e2e:run`  
  Starts the dev server, then runs all E2E specs in headless mode.

The app must be available at `http://localhost:5173`. The dev server is started automatically by these scripts.

## Specs

- **ui-elements.cy.ts** – Asserts declared UI elements exist (title, board, suggest button, suggestion response container, grid with 16 cells).
- **keyboard.cy.ts** – Triggers Arrow keys and W/A/S/D and checks the board stays visible (no win/lose testing).
- **suggestion.cy.ts** – Mocks `POST **/prompt`, clicks “Suggest a Move”, and asserts the mocked response text appears.
