use std::process::{Command as StdCommand, Output};

use crate::error::AppError;

/// Lança uma aplicação pelo caminho executável.
///
/// Funciona com:
/// - Caminho absoluto: `/usr/bin/firefox`, `C:\Program Files\...
/// - Nome no PATH: `firefox`, `code`, `obsidian`
///
/// O processo é spawnado (não bloqueia o Tauri) e o AppError
/// só é retornado se o spawn falhar (ex.: binário não encontrado).
#[tauri::command]
pub async fn execute_app(path: String) -> Result<(), AppError> {
    StdCommand::new(&path)
        .spawn()
        .map_err(|e| AppError::ExecutionError {
            message: format!("Failed to launch app '{}': {}", path, e),
        })?;
    Ok(())
}

/// Executa um comando de shell.
///
/// No Linux/macOS usa `sh -c "<command>"`
/// No Windows usa `cmd /C "<command>"`
///
/// Exemplos de `action_value`:
/// - `notify-send "Hello"`
/// - `ls -la ~/Documents`
/// - `echo "test" >> ~/log.txt`
#[tauri::command]
pub async fn execute_command(command: String) -> Result<(), AppError> {
    let shell = if cfg!(target_os = "windows") {
        "cmd"
    } else {
        "sh"
    };
    let flag = if cfg!(target_os = "windows") {
        "/C"
    } else {
        "-c"
    };

    StdCommand::new(shell)
        .arg(flag)
        .arg(&command)
        .spawn()
        .map_err(|e| AppError::ExecutionError {
            message: format!("Failed to execute command '{}': {}", command, e),
        })?;
    Ok(())
}

/// Verifica se um aplicativo existe no PATH do sistema.
///
/// No Linux/macOS usa `which <name>`
/// No Windows usa `where <name>`
///
/// Retorna `true` se o comando for encontrado, `false` caso contrário.
#[tauri::command]
pub async fn validate_app(name: String) -> Result<bool, AppError> {
    let (shell, flag) = if cfg!(target_os = "windows") {
        ("cmd", "/C")
    } else {
        ("which", "")
    };

    let result: Result<Output, std::io::Error> = if cfg!(target_os = "windows") {
        StdCommand::new(shell).arg(flag).arg("where").arg(&name).output()
    } else {
        StdCommand::new(shell).arg(&name).output()
    };

    match result {
        Ok(output) => Ok(output.status.success()),
        Err(_) => Ok(false),
    }
}
