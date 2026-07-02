mod commands;
mod db;
mod models;
mod state;

use migration::Migrator;
use migration::MigratorTrait;
use state::AppState;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("Failed to get app data dir");

            std::fs::create_dir_all(&app_data_dir).expect("Failed to create app data dir");

            let db_path = app_data_dir.join("opendeck.db");
            let db_url = format!("sqlite://{}?mode=rwc", db_path.display());
            println!("The database path is {}", db_path.display());

            let db = tauri::async_runtime::block_on(async {
                let db = sea_orm::Database::connect(&db_url)
                    .await
                    .expect("Failed to connect to database");

                Migrator::up(&db, None)
                    .await
                    .expect("Faile to run migrations");

                db
            });

            app.manage(AppState { db });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_buttons,
            commands::create_button,
            commands::update_button,
            commands::delete_button
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
