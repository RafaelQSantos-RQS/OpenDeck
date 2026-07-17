import { Component, inject, signal, NgZone, OnInit, OnDestroy } from "@angular/core";
import { TuiDialogService } from "@taiga-ui/core";
import { TuiLoader } from "@taiga-ui/core";
import { TuiToastService } from "@taiga-ui/kit";
import { TUI_CONFIRM, type TuiConfirmData } from "@taiga-ui/kit";
import { firstValueFrom } from "rxjs";
import { ButtonService } from "../../shared/services/button";
import { Button } from "../../shared/models/button";
import { WebviewWindow, getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { emit, listen, type UnlistenFn } from "@tauri-apps/api/event";
import { ButtonCard } from "./button-card/button-card";
import { Titlebar } from "../../shared/components/titlebar/titlebar";

@Component({
  selector: "app-grid",
  imports: [ButtonCard, Titlebar, TuiLoader],
  templateUrl: "./grid.html",
  styleUrl: "./grid.scss",
})
export class Grid implements OnInit, OnDestroy {
  private readonly ngZone = inject(NgZone);
  private readonly buttonService = inject(ButtonService);
  private readonly toast = inject(TuiToastService);
  private readonly dialogs = inject(TuiDialogService);
  protected buttons: Button[] = [];
  protected readonly loading = signal(true);
  private unlisten: UnlistenFn | null = null;
  private unlistenClose: UnlistenFn | null = null;
  private openEditorCount = 0;

  protected get slots(): (Button | null)[] {
    const slots: (Button | null)[] = new Array(6).fill(null);
    for (const button of this.buttons) {
      slots[button.position] = button;
    }
    return slots;
  }

  ngOnInit(): void {
    const mainWindow = getCurrentWebviewWindow();
    mainWindow.onCloseRequested(async() => {
      await emit("main-window-closing")
    });

    listen("editor-closed", () => {
      this.ngZone.run(() => {
        this.openEditorCount--;
        if (this.openEditorCount <= 0) {
          this.openEditorCount = 0;
          this.removeBlur();
        }
      });
    }).then((unlisten) => {
      this.unlistenClose = unlisten;
    });

    this.loadButtons().then(() => {
      listen("button-saved", () => {
        this.ngZone.run(() => this.loadButtons());
      }).then((unlisten) => {
        this.unlisten = unlisten;
      });
    });
  }

  private applyBlur(): void {
    document.body.classList.add("blurred");
  }

  private removeBlur(): void {
    document.body.classList.remove("blurred");
  }

  ngOnDestroy(): void {
    this.unlisten?.();
    this.unlistenClose?.();
  }

  protected async loadButtons(): Promise<void> {
    this.loading.set(true);
    try {
      this.buttons = await this.buttonService.getButtons();
    } finally {
      this.loading.set(false);
    }
  }

  private static windowCounter = 0;

  protected openEditor(button?: Button, position?: number): void {
    const url = button
      ? `/edit?id=${button.id}`
      : `/create?position=${position}`;

    const label = `editor-${++Grid.windowCounter}-${Date.now()}`;
    try {
      const editorWindow = new WebviewWindow(label, {
        url,
        width: 570,
        height: 610,
        minWidth: 570,
        minHeight: 610,
        title: button ? "Edit Button" : "New Button",
        decorations: false,
        resizable: false,
        center: true,
      });

      editorWindow.once("tauri://created", () => {
        console.log("Editor window created successfully");
        this.openEditorCount++;
        this.applyBlur();
      });

      editorWindow.once("tauri://error", (e) => {
        console.error("Failed to create editor window:", e);
      });
    } catch (error) {
      console.error("Failed to create editor window:", error);
    }
  }

  protected async deleteButton(id: number): Promise<void> {
    const button = this.buttons.find((b) => b.id === id);
    const label = button?.label || 'this button';

    const data: TuiConfirmData = {
      content: `Are you sure you want to delete <strong>${label}</strong>?`,
      yes: 'Delete',
      no: 'Cancel',
    };

    const confirmed = await firstValueFrom(
      this.dialogs.open<boolean>(TUI_CONFIRM, {
        label: 'Delete button',
        size: 's',
        data,
      }),
    );

    if (!confirmed) return;

    try {
      await this.buttonService.deleteButton(id);
      await this.loadButtons();
    } catch {
      this.toast.open('Failed to delete button', { appearance: 'error', autoClose: 3000 }).subscribe();
    }
  }
}
