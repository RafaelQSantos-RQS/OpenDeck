use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Buttons::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Buttons::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Buttons::Position)
                            .integer()
                            .not_null()
                            .unique_key(),
                    )
                    .col(ColumnDef::new(Buttons::Label).string().null())
                    .col(ColumnDef::new(Buttons::Icon).string().null())
                    .col(
                        ColumnDef::new(Buttons::DisplayMode)
                            .string()
                            .not_null()
                            .default("both"),
                    )
                    .col(
                        ColumnDef::new(Buttons::ActionType)
                            .string()
                            .not_null()
                            .default("link"),
                    )
                    .col(ColumnDef::new(Buttons::ActionValue).string().null())
                    .col(ColumnDef::new(Buttons::BackgroundColor).string().null())
                    .col(
                        ColumnDef::new(Buttons::CreatedAt)
                            .string()
                            .not_null()
                            .default("datetime('now')"),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Buttons::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Buttons {
    Table,
    Id,
    Position,
    Label,
    Icon,
    DisplayMode,
    ActionType,
    ActionValue,
    BackgroundColor,
    CreatedAt,
}