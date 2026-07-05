import { Component, inject, NgZone, OnInit, OnDestroy } from "@angular/core";
import { ButtonService } from "../../shared/services/button";
import { Button } from "../../shared/models/button";
import { TuiIcon } from "@taiga-ui/core";
import { TuiCardMedium } from "@taiga-ui/layout";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { ButtonCard } from "./button-card/button-card";

@Component({
  selector: "app-grid",
  imports: [TuiCardMedium, TuiIcon, ButtonCard],
  templateUrl: "./grid.html",
  styleUrl: "./grid.scss",
})
export class Grid implements OnInit, OnDestroy {
  private readonly ngZone = inject(NgZone);
  private readonly buttonService = inject(ButtonService);
  protected buttons: Button[] = [];
  private unlisten: UnlistenFn | null = null;

  ngOnInit(): void {
    this.loadButtons().then(() => {
      listen("button-saved", () => {
        this.ngZone.run(() => this.loadButtons());
      }).then((unlisten) => {
        this.unlisten = unlisten;
      });
    });
  }

  ngOnDestroy(): void {
    this.unlisten?.();
  }

  protected async loadButtons(): Promise<void> {
    const buttons = await this.buttonService.getButtons();
    this.buttons = buttons;
  }

  protected openEditor(button?: Button, position?: number): void {
    let url = button
      ? `/edit?id=${button.id}`
      : `/create?position=${position}`;

    const label = `editor-${Date.now()}`;
    try {
      const editorWindow = new WebviewWindow(label, {
        url,
        width: 600,
        height: 720,
        title: button ? "Edit Button" : "New Button",
        decorations: false,
        resizable: false,
        center: true,
      });

      editorWindow.once("tauri://created", () => {
        console.log("Editor window created successfully");
      });

      editorWindow.once("tauri://error", (e) => {
        console.error("Failed to create editor window:", e);
      });
    } catch (error) {
      console.error("Failed to create editor window:", error);
    }
  }

  protected deleteButton(id: number): void {
    this.buttonService.deleteButton(id).then(() => this.loadButtons());
  }
}
