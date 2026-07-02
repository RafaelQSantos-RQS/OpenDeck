use sea_orm::ActiveValue::Set;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder};
use tauri::State;

use crate::models::button::Entity as Buttons;
use crate::models::{ActionType, ActiveModel, DisplayMode, Model as Button};
use crate::state::AppState;

#[tauri::command]
pub async fn get_buttons(state: State<'_, AppState>) -> Result<Vec<Button>, String> {
    Buttons::find()
        .order_by_asc(crate::models::button::Column::Position)
        .all(&state.db)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_button(
    state: State<'_, AppState>,
    position: i32,
    label: Option<String>,
    icon: Option<String>,
    display_mode: DisplayMode,
    action_type: ActionType,
    action_value: Option<String>,
    background_color: Option<String>,
) -> Result<Button, String> {
    let count = Buttons::find()
        .count(&state.db)
        .await
        .map_err(|e| e.to_string())?;

    if count >= 16 {
        return Err("Grid is full! Maximum of 16 buttons.".to_string());
    }

    let exists = Buttons::find()
        .filter(crate::models::button::Column::Position.eq(position))
        .one(&state.db)
        .await
        .map_err(|e| e.to_string())?
        .is_some();
    if exists {
        return Err(format!(
            "Position {} is already occupied. Use update instead.",
            position
        ));
    }

    let active = ActiveModel {
        position: Set(position),
        label: Set(label),
        icon: Set(icon),
        display_mode: Set(display_mode),
        action_type: Set(action_type),
        action_value: Set(action_value),
        background_color: Set(background_color),
        ..Default::default()
    };

    active.insert(&state.db).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_button(
    state: State<'_, AppState>,
    id: i64,
    label: Option<String>,
    icon: Option<String>,
    display_mode: DisplayMode,
    action_type: ActionType,
    action_value: Option<String>,
    background_color: Option<String>,
) -> Result<Button, String> {
    let button = Buttons::find_by_id(id)
        .one(&state.db)
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| format!("Button not found: {}", id))?;

    let mut active: ActiveModel = button.into();
    active.label = Set(label);
    active.icon = Set(icon);
    active.display_mode = Set(display_mode);
    active.action_type = Set(action_type);
    active.action_value = Set(action_value);
    active.background_color = Set(background_color);
    active.update(&state.db).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_button(state: State<'_, AppState>, id: i64) -> Result<(), String> {
    let button = Buttons::find_by_id(id)
        .one(&state.db)
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| format!("Button not found: {}", id))?;

    let active: ActiveModel = button.into();
    active
        .delete(&state.db)
        .await
        .map_err(|e| e.to_string())
        .map(|_| ())
}
