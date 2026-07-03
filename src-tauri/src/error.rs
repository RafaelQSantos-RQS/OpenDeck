use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Error, Serialize)]
pub enum AppError {
    #[error("Position {position} is invalid. Must bi between {min} and {max}.")]
    #[serde(rename = "invalid_position")]
    InvalidPosition { position: i32, min: i32, max: i32 },

    #[error("Grid is full. Maximum of{max_positions} buttons.")]
    #[serde(rename = "grid_full")]
    GridFull { max_positions: i32 },

    #[error("Position {position} is already occupied.")]
    #[serde(rename = "position_taken")]
    PositionTaken { position: i32 },

    #[error("Button with ID {id} was not found.")]
    #[serde(rename = "not_found")]
    NotFound { id: i64 },

    #[error("Database error: {message}")]
    #[serde(rename = "database_error")]
    DatabaseError { message: String },
}

impl From<sea_orm::DbErr> for AppError {
    fn from(err: sea_orm::DbErr) -> Self {
        AppError::DatabaseError {
            message: err.to_string(),
        }
    }
}
