import { Component, computed, input, output } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiCardMedium } from '@taiga-ui/layout';
import type { Button, ActionType } from '../../../shared/models/button';

@Component({
  selector: 'app-button-card',
  imports: [TuiButton, TuiCardMedium, TuiIcon],
  templateUrl: './button-card.html',
  styleUrl: './button-card.scss',
})
export class ButtonCard {
  readonly button = input.required<Button>();
  readonly edit = output<Button>();
  readonly delete = output<number>();

  protected readonly fallbackIcon = computed(() => {
    const iconMap: Record<ActionType, string> = {
      link: '@tui.link',
      app: '@tui.app-window',
      command: '@tui.terminal',
    };
    return iconMap[this.button().action_type];
  });

  protected onCardClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-delete]')) {
      return;
    }
    this.edit.emit(this.button());
  }
}
