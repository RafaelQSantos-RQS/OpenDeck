use serde::Deserialize;

use crate::models::button::{ActionType, DisplayMode};

#[derive(Debug, Deserialize)]
pub struct ButtonData {
    pub label: Option<String>,
    pub icon: Option<String>,
    pub display_mode: DisplayMode,
    pub action_type: ActionType,
    pub action_value: Option<String>,
    pub background_color: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateButtonData {
    pub position: i32,
    pub fields: ButtonData,
}

#[derive(Debug, Deserialize)]
pub struct UpdateButtonData {
    pub fields: ButtonData,
}
