import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { emit } from "@tauri-apps/api/event";
import { ButtonService } from "../../shared/services/button";
import { ButtonForm } from "../../shared/components/button-form/button-form";
import type { ButtonData } from "../../shared/models/button";

@Component({
  selector: "app-edit-button-dialog",
  imports: [ButtonForm],
  templateUrl: "./edit-button-dialog.html",
  styleUrl: "./edit-button-dialog.scss",
})
export class EditButtonDialog implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly buttonService = inject(ButtonService);

  protected initialData: ButtonData | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.queryParamMap.get("id");
    if (!idParam) return;

    const id = Number(idParam);
    this.buttonService.getButtons().then((buttons) => {
      const button = buttons.find((b) => b.id === id);
      if (button) {
        this.initialData = {
          label: button.label,
          icon: button.icon,
          display_mode: button.display_mode,
          action_type: button.action_type,
          action_value: button.action_value,
          background_color: button.background_color,
        };
      }
    });
  }

  protected async onSave(data: ButtonData): Promise<void> {
    const idParam = this.route.snapshot.queryParamMap.get("id");
    if (!idParam) return;

    try {
      await this.buttonService.updateButton(Number(idParam), { fields: data });
      await emit("button-saved");
      await WebviewWindow.getCurrent().close();
    } catch (error) {
      console.error("Failed to save button:", error);
    }
  }

  protected async onCancel(): Promise<void> {
    await WebviewWindow.getCurrent().close();
  }
}
