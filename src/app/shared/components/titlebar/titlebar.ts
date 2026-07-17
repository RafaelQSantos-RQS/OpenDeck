import { ChangeDetectionStrategy, Component, input, output, signal, HostListener } from '@angular/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { TuiButton, TuiDialog, TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-titlebar',
  standalone: true,
  imports: [TuiButton, TuiDialog, TuiIcon],
  templateUrl: './titlebar.html',
  styleUrl: './titlebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Titlebar {
  readonly title = input('Titlebar');
  readonly about = output<void>();

  private readonly appWindow = getCurrentWindow();

  protected readonly menuOpen = signal(false);
  protected aboutOpen = false;

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected onAbout(): void {
    this.aboutOpen = true;
    this.menuOpen.set(false);
  }

  minimize(): void {
    this.appWindow.minimize();
  }

  toggleMaximize(): void {
    this.appWindow.toggleMaximize();
  }

  close(): void {
    this.appWindow.close();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.menuOpen.set(false);
  }
}