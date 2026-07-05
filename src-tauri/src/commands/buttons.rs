use sea_orm::ActiveValue::Set;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DeleteResult, EntityTrait, PaginatorTrait, QueryFilter,
    QueryOrder,
};
use tauri::State;

use crate::error::AppError;
use crate::models::button::{
    ActiveModel,
    CreateButtonData,
    Entity as Buttons,
    Model as Button,
    UpdateButtonData
};
use crate::state::AppState;

#[tauri::command]
pub async fn get_buttons(state: State<'_, AppState>) -> Result<Vec<Button>, AppError> {
    Buttons::find()
        .order_by_asc(crate::models::button::Column::Position)
        .all(&state.db)
        .await
        .map_err(AppError::from)
}

#[tauri::command]
pub async fn create_button(
    state: State<'_, AppState>,
    data: CreateButtonData,
) -> Result<Button, AppError> {
    if !(0..=6).contains(&data.position) {
        return Err(AppError::InvalidPosition {
            position: data.position,
            min: 0,
            max: 5,
        });
    }

    let count = Buttons::find().count(&state.db).await?;

    if count >= 6 {
        return Err(AppError::GridFull { max_positions: 6 });
    }

    let exists = Buttons::find()
        .filter(crate::models::button::Column::Position.eq(data.position))
        .one(&state.db)
        .await?
        .is_some();
    if exists {
        return Err(AppError::PositionTaken { position: data.position });
    }

    let active = ActiveModel {
        position: Set(data.position),
        label: Set(data.fields.label),
        icon: Set(data.fields.icon),
        display_mode: Set(data.fields.display_mode),
        action_type: Set(data.fields.action_type),
        action_value: Set(data.fields.action_value),
        background_color: Set(data.fields.background_color),
        ..Default::default()
    };

    active.insert(&state.db).await.map_err(AppError::from)
}

#[tauri::command]
pub async fn update_button(
    state: State<'_, AppState>,
    id: i64,
    data: UpdateButtonData,
) -> Result<Button, AppError> {
    let button = Buttons::find_by_id(id)
        .one(&state.db)
        .await?
        .ok_or(AppError::NotFound { id })?;

    let mut active: ActiveModel = button.into();
    active.label = Set(data.fields.label);
    active.icon = Set(data.fields.icon);
    active.display_mode = Set(data.fields.display_mode);
    active.action_type = Set(data.fields.action_type);
    active.action_value = Set(data.fields.action_value);
    active.background_color = Set(data.fields.background_color);
    active.update(&state.db).await.map_err(AppError::from)
}

#[tauri::command]
pub async fn delete_button(state: State<'_, AppState>, id: i64) -> Result<(), AppError> {
    let result: DeleteResult = Buttons::delete_by_id(id).exec(&state.db).await?;

    if result.rows_affected == 0 {
        return Err(AppError::NotFound { id });
    }

    Ok(())
}
