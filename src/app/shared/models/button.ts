export type DisplayMode = "icon" | "text" | "both";
export type ActionType = "link" | "app" | "command";

export interface Button {
    id: number;
    position: number;
    label: string | null;
    icon: string | null;
    display_mode: DisplayMode;
    action_type: ActionType;
    action_value: string | null;
    background_color: string | null;
    created_at: string
}

export interface ButtonData {
    label: string | null;
    icon: string | null;
    display_mode: DisplayMode;
    action_type: ActionType;
    action_value: string | null;
    background_color: string | null;
}

export interface CreateButtonData {
    position: number;
    fields: ButtonData;
}

export interface UpdateButtonData {
    fields: ButtonData;
}
