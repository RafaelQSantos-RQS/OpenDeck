use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum, Serialize, Deserialize)]
#[sea_orm(rs_type = "String", db_type = "Text")]
#[serde(rename_all = "snake_case")]
pub enum DisplayMode {
    #[sea_orm(string_value = "icon")]
    Icon,
    #[sea_orm(string_value = "text")]
    Text,
    #[sea_orm(string_value = "both")]
    Both,
}

#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum, Serialize, Deserialize)]
#[sea_orm(rs_type = "String", db_type = "Text")]
#[serde(rename_all = "snake_case")]
pub enum ActionType {
    #[sea_orm(string_value = "link")]
    Link,
    #[sea_orm(string_value = "app")]
    App,
    #[sea_orm(string_value = "command")]
    Command,
}

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "buttons")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    pub position: i32,
    pub label: Option<String>,
    pub icon: Option<String>,
    pub display_mode: DisplayMode,
    pub action_type: ActionType,
    pub action_value: Option<String>,
    pub background_color: Option<String>,
    pub created_at: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
