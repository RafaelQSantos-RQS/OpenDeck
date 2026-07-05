# OpenDeck — Project Specification

> **Purpose:** Virtual stream deck — a 2×3 grid of customizable buttons that trigger actions (open apps, links, or run commands).
>
> **Stack:** Tauri v2 (Rust backend) + Angular 21 (frontend) + Taiga UI 5 (component library) + SQLite (SeaORM).

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Desktop shell | Tauri | v2 |
| Backend | Rust | edition 2021 |
| ORM | SeaORM | 1.1.20 (sqlx-sqlite, macros) |
| Frontend | Angular | 21 |
| UI library | Taiga UI | 5.13 |
| Icons | Taiga UI Icons | 5.13 |
| Styling | SCSS + Taiga UI theme (Less) |
| Package manager | Bun | |
| Bundler | Angular CLI (@angular/build) | |

---

## Project Structure

```
/
├── AGENTS.md                          # This file
├── package.json                       # Angular / Node deps
├── angular.json                       # Angular build config
├── tsconfig.json / tsconfig.app.json  # TypeScript config
│
├── src/                               # Angular frontend
│   ├── main.ts                        # Bootstrap
│   ├── index.html                     # Root HTML
│   ├── styles.css                     # Global styles
│   └── app/
│       ├── app.config.ts              # App providers (Taiga, Router)
│       ├── app.routes.ts              # Routes
│       ├── app.component.ts           # Root component
│       └── app.component.html         # Root template
│
└── src-tauri/                         # Rust backend (Tauri)
    ├── Cargo.toml                     # Rust deps + lib/bin config
    ├── tauri.conf.json                # Tauri window config
    ├── migrations/                    # SeaORM migration crate
    └── src/
        ├── main.rs                    # Binary entry point
        ├── lib.rs                     # Tauri app setup, plugin registration
        ├── error.rs                   # AppError enum (thiserror + Serialize)
        ├── state.rs                   # AppState (DatabaseConnection)
        ├── db/
        ├── commands/
        │   ├── mod.rs                 # Re-exports all command modules
        │   └── buttons.rs             # CRUD commands: get/create/update/delete
        └── models/
            ├── mod.rs                 # `pub mod button;`
            └── button/
                ├── mod.rs             # Re-exports entity + dto
                ├── entity.rs          # SeaORM Model, ActiveEnums, Relations
                └── dto.rs             # CreateButtonData, UpdateButtonData
```

---

## Architecture

### Rust Backend — Module Organization

Organized by **domain** (not by layer). Each entity is a self-contained folder:

```
models/button/
├── entity.rs    → SeaORM entity, enums, ActiveModelBehavior
├── dto.rs       → Input DTOs (Deserialize only)
└── mod.rs       → Re-exports everything publicly
```

The `mod.rs` follows the **Rust re-export pattern**:

```rust
// models/button/mod.rs
mod entity;
mod dto;

pub use entity::*;
pub use dto::*;
```

External code imports from the domain root, never from internal modules:

```rust
// ✅ Correct
use crate::models::button::{Entity as Buttons, Model as Button, CreateButtonData};

// ❌ Wrong (internal modules are private)
use crate::models::button::entity::{Entity, Model};
```

### Error Handling — AppError

```rust
// error.rs
#[derive(Debug, Error, Serialize)]
pub enum AppError {
    #[error("...")]
    #[serde(rename = "snake_case_variant")]
    Variant { fields },
}

impl From<sea_orm::DbErr> for AppError { ... }
```

- Uses **`thiserror`** for `Display` + `Error` derives
- Uses **`serde::Serialize`** so Tauri can send structured errors to the frontend
- Each variant has a `#[serde(rename = "...")]` — this is what the frontend receives as the `error` field
- `sea_orm::DbErr` is converted automatically via `From` impl, allowing `?` in queries
- All Tauri commands return `Result<T, AppError>`

---

## Data Model — `buttons`

### SeaORM Entity (`entity.rs`)

```
Field              Type            Notes
─────────────────────────────────────────────────
id                 i64 (PK)        Auto-incrementposition             i32             0-5 (2×3 grid)
label              Option<String>  Display text
icon               Option<String>  Material icon name
display_mode       DisplayMode     Enum: icon | text | both
action_type        ActionType      Enum: link | app | command
action_value       Option<String>  URL, path, or shell command
background_color   Option<String>  Hex color (e.g. "#1DB954")
created_at         String          ISO 8601 timestamp
```

### ActiveEnums

```rust
DisplayMode → Icon | Text | Both
ActionType  → Link | App | Command
```

Stored as strings in SQLite (`db_type = "Text"`, `rs_type = "String"`).

### Input DTOs (`dto.rs`)

```rust
ButtonData {
    label: Option<String>,
    icon: Option<String>,
    display_mode: DisplayMode,
    action_type: ActionType,
    action_value: Option<String>,
    background_color: Option<String>,
}

CreateButtonData {
    position: i32,
    fields: ButtonData,          // ← nested composition
}

UpdateButtonData {
    fields: ButtonData,          // ← nested composition
}
```

> **Frontend JSON format for create:**
> ```json
> { "position": 0, "fields": { "label": "...", "icon": "...", ... } }
> ```

---

## Tauri Commands (API)

All commands are registered in `lib.rs` via `generate_handler![]`.

### `get_buttons`
- **Returns:** `Vec<Button>`
- **Ordered by:** `position ASC`

### `create_button`
- **Input:** `CreateButtonData`
- **Validates:**
  1. Position in range 0–5
  2. Grid not full (< 6 buttons)
  3. Position not already occupied
- **Inserts** new row

### `update_button`
- **Input:** `id: i64`, `UpdateButtonData`
- **Fails if:** `id` not found
- **Updates** existing row

### `delete_button`
- **Input:** `id: i64`
- **Fails if:** `id` not found
- **Deletes** row

### Structured Error Responses (frontend receives)

```json
{ "error": "invalid_position", "position": 20, "min": 0, "max": 5 }
{ "error": "grid_full",        "max_positions": 6 }
{ "error": "position_taken",   "position": 7 }
{ "error": "not_found",        "id": 999 }
{ "error": "database_error",   "message": "..." }
```

---

## Frontend Conventions (Angular + Taiga UI)

- **Component style:** Standalone components (no NgModules)
- **Bootstrap:** `bootstrapApplication(AppComponent, appConfig)`
- **Styling:** SCSS (`inlineStyleLanguage: "scss"` in angular.json)
- **Taiga UI:** Already configured with `provideTaiga()` in `app.config.ts`
- **Taiga UI assets:** Icons are copied from `node_modules/@taiga-ui/icons/src` to `assets/taiga-ui/icons/`
- **Taiga UI styles:** Imported from `node_modules/@taiga-ui/styles/` (Less files)
- **Tauri API:** Uses `@tauri-apps/api` (`invoke` from `@tauri-apps/api/core`)
- **Router:** `@angular/router` with `provideRouter(routes)`
- **Dev server:** Port 1420 (configured in angular.json)

### Tauri invoke pattern

```typescript
import { invoke } from "@tauri-apps/api/core";

// Call a Rust command
const buttons = await invoke<Button[]>("get_buttons");
await invoke("create_button", { data: { position: 0, fields: { ... } } });
```

---

## Build & Run

```bash
# Development — runs Angular dev server + Tauri window
cd src-tauri && cargo tauri dev

# Build Rust backend only
cd src-tauri && cargo build

# Run Clippy lint
cd src-tauri && cargo clippy

# Build Angular frontend
npm run build
# or
ng build
```

---

## Coding Standards

1. **Rust:** Run `cargo clippy` before committing. Zero warnings target.
2. **Conventional commits:** `feat:`, `fix:`, `refactor:`, `chore:`, etc.
3. **Organize by domain:** Each entity gets its own folder with `entity.rs`, `dto.rs`, `mod.rs`.
4. **DTOs are Deserialize-only** (input to commands). The SeaORM `Model` has `Serialize` (output to frontend).
5. **Errors are structured:** Never `Result<T, String>`. Always use `AppError`.
6. **No `any` casts** in TypeScript. Use proper types.
7. **SCSS:** Use Taiga UI design tokens when possible.
