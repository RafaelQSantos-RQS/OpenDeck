# OpenDeck

> Virtual stream deck — a 2×3 grid of customizable buttons that trigger actions.

Built with **Tauri v2** (Rust) + **Angular 21** + **Taiga UI 5** + **SQLite**.

---

## Features

- **6 customizable buttons** — 2×3 grid with icon, label, and color
- **3 action types:**
  - 🔗 **Link** — open URLs in the default browser
  - 🚀 **App** — launch any application installed on your system
  - ⌨️ **Command** — execute shell commands
- **Visual customization** — 70+ Taiga UI icons, background color picker, display modes (icon / text / both)
- **Multi-window editor** — Create and edit buttons in separate frameless windows
- **Dark theme** — Built with Taiga UI dark mode tokens
- **Custom titlebar** — Frameless window with hamburger menu (About, Minimize, Close)
- **Persistent storage** — SQLite database via SeaORM, data survives restarts

## Tech Stack

| Layer          | Technology                        | Version       |
|----------------|-----------------------------------|---------------|
| Desktop shell  | Tauri                             | v2            |
| Backend        | Rust                              | edition 2021  |
| ORM            | SeaORM                            | 1.1.20        |
| Frontend       | Angular                           | 21            |
| UI library     | Taiga UI                          | 5.13          |
| Icons          | Taiga UI Icons (Lucide)           | 5.13          |
| Styling        | SCSS + Taiga UI theme             |               |
| Package manager| Bun                               |               |

## Getting Started

### Prerequisites

- [Rust](https://rustup.rs/) (edition 2021)
- [Bun](https://bun.sh/) (package manager)
- [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for your platform

### Development

```bash
# Install frontend dependencies
bun install

# Run in development mode (opens Tauri window with hot reload)
cd src-tauri && cargo tauri dev
```

### Build

```bash
# Build Angular frontend
bun run build

# Build Rust backend (debug)
cd src-tauri && cargo build

# Build the full Tauri application
cd src-tauri && cargo tauri build
```

### Lint

```bash
cd src-tauri && cargo clippy
```

## Project Structure

```
src/                    # Angular frontend
├── app/
│   ├── features/       # Grid, ButtonCard, dialogs
│   └── shared/         # Models, services, components (Titlebar, ButtonForm)
└── ...

src-tauri/              # Rust backend
├── src/
│   ├── commands/       # Tauri commands (buttons CRUD + actions)
│   ├── models/         # SeaORM entities and DTOs (domain-organized)
│   ├── db/             # Database utilities
│   ├── error.rs        # AppError enum (structured errors)
│   ├── state.rs        # AppState (DB connection)
│   └── lib.rs          # Tauri setup, plugin registration
├── migration/          # SeaORM migrations
└── migrations/         # SQL migration files
```

## License

MIT
