import { Component, computed, inject, input, output } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiCardMedium } from '@taiga-ui/layout';
import { TuiToastService } from '@taiga-ui/kit';
import { openUrl } from '@tauri-apps/plugin-opener';
import { ButtonService } from '../../../shared/services/button';
import type { Button, ActionType } from '../../../shared/models/button';

@Component({
  selector: 'app-button-card',
  imports: [TuiButton, TuiCardMedium, TuiIcon],
  templateUrl: './button-card.html',
  styleUrl: './button-card.scss',
})
export class ButtonCard {
  private readonly toast = inject(TuiToastService);
  private readonly buttonService = inject(ButtonService);

  readonly button = input<Button>();
  readonly position = input<number>();
  readonly edit = output<Button>();
  readonly delete = output<number>();
  readonly add = output<number>();

  protected readonly isAddSlot = computed(() => !this.button());

  protected readonly fallbackIcon = computed(() => {
    const iconMap: Record<ActionType, string> = {
      link: '@tui.link',
      app: '@tui.app-window',
      command: '@tui.terminal',
    };
    return iconMap[this.button()?.action_type ?? 'link'];
  });

  protected onClick() {
    const pos = this.position();
    if (this.isAddSlot() && pos !== undefined) {
      this.add.emit(pos);
    }
  }

  protected async onCardClick(event: MouseEvent) {
    const btn = this.button();
    if (!btn) return;

    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-edit]') || target?.closest('[data-delete]')) {
      return;
    }

    try {
      switch (btn.action_type) {
        case 'link': {
          if (btn.action_value) {
            await openUrl(btn.action_value);
            this.toast.open('Link opened successfully', { appearance: 'success', autoClose: 2000 }).subscribe();
          }
          break;
        }
        case 'app': {
          if (btn.action_value) {
            await this.buttonService.executeApp(btn.action_value);
            this.toast.open('App launched successfully', { appearance: 'success', autoClose: 2000 }).subscribe();
          }
          break;
        }
        case 'command': {
          if (btn.action_value) {
            await this.buttonService.executeCommand(btn.action_value);
            this.toast.open('Command executed successfully', { appearance: 'success', autoClose: 2000 }).subscribe();
          }
          break;
        }
      }
    } catch {
      this.toast.open('Failed to execute action', { appearance: 'error', autoClose: 3000 }).subscribe();
    }
  }
}
