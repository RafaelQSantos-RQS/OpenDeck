import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { emit } from "@tauri-apps/api/event";
import { ButtonService } from "../../shared/services/button";
import { ButtonForm } from "../../shared/components/button-form/button-form";
import type { ButtonData } from "../../shared/models/button";

@Component({
  selector: "app-create-button-dialog",
  imports: [ButtonForm],
  templateUrl: "./create-button-dialog.html",
  styleUrl: "./create-button-dialog.scss",
})
export class CreateButtonDialog implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly buttonService = inject(ButtonService);

  private createPosition: number | null = null;

  ngOnInit(): void {
    const positionParam = this.route.snapshot.queryParamMap.get("position");
    if (positionParam) {
      this.createPosition = Number(positionParam);
    }
  }

  protected async onSave(data: ButtonData): Promise<void> {
    if (this.createPosition === null) return;

    try {
      await this.buttonService.createButton({
        position: this.createPosition,
        fields: data,
      });
      await emit("button-saved");
      await WebviewWindow.getCurrent().close();
    } catch (error) {
      console.error("Failed to create button:", error);
    }
  }

  protected async onCancel(): Promise<void> {
    await WebviewWindow.getCurrent().close();
  }
}
