import { Component, inject, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TuiToastService } from "@taiga-ui/kit";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { emit, listen, type UnlistenFn } from "@tauri-apps/api/event";
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
  private readonly toast = inject(TuiToastService);
  private createPosition: number | null = null;
  private unlistenClose: UnlistenFn | null = null;

  ngOnInit(): void {
    const positionParam = this.route.snapshot.queryParamMap.get("position");
    if (positionParam) {
      this.createPosition = Number(positionParam);
    }
    listen("main-window-closing", () => {
      WebviewWindow.getCurrent().close();
    }).then((unlisten) => {
      this.unlistenClose = unlisten;
    });
  }

  protected async onSave(data: ButtonData): Promise<void> {
    if (this.createPosition === null) return;

    try {
      await this.buttonService.createButton({
        position: this.createPosition,
        fields: data,
      });
      await emit("button-saved");
      await emit("editor-closed");
      await WebviewWindow.getCurrent().close();
    } catch {
      this.toast.open('Failed to create button', { appearance: 'error', autoClose: 3000 }).subscribe();
    }
  }

  protected async onCancel(): Promise<void> {
    await emit("editor-closed");
    await WebviewWindow.getCurrent().close();
  }

  ngOnDestroy(): void {
    this.unlistenClose?.();
  }
}
