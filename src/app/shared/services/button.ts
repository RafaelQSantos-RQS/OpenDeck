import { Injectable } from '@angular/core';
import { invoke } from "@tauri-apps/api/core";
import type { Button, CreateButtonData, UpdateButtonData} from "../models/button";

@Injectable({ providedIn: 'root' })
export class ButtonService {
  getButtons(): Promise<Button[]> {
    return invoke<Button[]>("get_buttons");
  }

  createButton( data: CreateButtonData): Promise<Button> {
    return invoke<Button>("create_button", {data});
  }

  updateButton( id: number, data: UpdateButtonData): Promise<Button> {
    return invoke<Button>("update_button", {id, data});
  }

  deleteButton( id: number): Promise<void> {
    return invoke<void>("delete_button", {id});
  }
}
