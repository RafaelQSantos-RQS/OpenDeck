import { Component, inject, input, output, signal, computed, effect } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TuiActiveZone, TuiObscured } from "@taiga-ui/cdk";
import { TuiButton, TuiButtonX, TuiDataList, TuiDropdown, TuiIcon, TuiTextfield, TuiTitle } from "@taiga-ui/core";
import { TuiChevron, TuiInputColor, TuiTextarea } from "@taiga-ui/kit";
import { ButtonService } from "../../services/button";
import { ICON_LIST } from "../../icons/icon-list";
import type { ButtonData, DisplayMode, ActionType } from "../../models/button";

interface DropdownOption {
  value: string;
  label: string;
  description: string;
  icon: string;
}

@Component({
  selector: "app-button-form",
  imports: [
    FormsModule,
    TuiActiveZone,
    TuiButton,
    TuiButtonX,
    TuiChevron,
    TuiDataList,
    TuiDropdown,
    TuiIcon,
    TuiTitle,
    TuiInputColor,
    TuiObscured,
    TuiTextarea,
    TuiTextfield,
  ],
  templateUrl: "./button-form.html",
  styleUrl: "./button-form.scss",
})
export class ButtonForm {
  readonly initialData = input<ButtonData | null>(null);
  readonly isEditing = input(false);

  readonly save = output<ButtonData>();
  readonly cancel = output<void>();

  // 📝 Form fields
  protected label = "";
  protected readonly icon = signal("");
  protected readonly displayMode = signal<DisplayMode>("icon");
  protected readonly actionType = signal<ActionType>("link");
  protected actionValue = "";
  protected backgroundColor = "";

  // 🎨 Icon picker
  protected readonly iconPickerOpen = signal(false);
  protected readonly iconPickerMaxHeight = signal(220);
  protected readonly searchQuery = signal("");

  protected openIconPicker(btn: HTMLElement): void {
    const rect = btn.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const availableBelow = windowHeight - rect.bottom;
    // Account for: dropdown padding (16px) + search bar (~40px) + gap (8px) + safe margin (8px)
    const gridMaxHeight = Math.min(280, Math.max(80, availableBelow - 72));
    this.iconPickerMaxHeight.set(gridMaxHeight);
    this.iconPickerOpen.set(true);
  }

  protected readonly filteredIcons = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return ICON_LIST;
    return ICON_LIST.filter(
      (entry) =>
        entry.name.toLowerCase().includes(query) ||
        entry.label.toLowerCase().includes(query) ||
        entry.category.toLowerCase().includes(query)
    );
  });

  protected selectIcon(name: string): void {
    this.icon.set(name);
    this.iconPickerOpen.set(false);
    this.searchQuery.set("");
  }

  protected closeIconPicker(): void {
    this.iconPickerOpen.set(false);
    this.searchQuery.set("");
  }

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.label = data.label ?? "";
        this.icon.set(data.icon ?? "");
        this.displayMode.set(data.display_mode);
        this.actionType.set(data.action_type);
        this.actionValue = data.action_value ?? "";
        this.backgroundColor = data.background_color ?? "";
      }
    });

    effect(() => {
      // Reset app validation when action type changes
      this.actionType();
      this.appStatus.set('idle');
      if (this.validateTimer) clearTimeout(this.validateTimer);
    });
  }

  protected readonly displayOptions: DropdownOption[] = [
    { value: "icon", label: "Icon only", description: "Display only the icon", icon: "@tui.image" },
    { value: "text", label: "Text only", description: "Display only the label", icon: "@tui.type" },
    { value: "both", label: "Icon & Text", description: "Display icon and label together", icon: "@tui.layout-list" },
  ];

  protected readonly displayOpen = signal(false);
  protected readonly displayLabel = computed(() =>
    this.displayOptions.find((o) => o.value === this.displayMode())?.label ?? "Icon only"
  );
  protected readonly displayIcon = computed(() =>
    this.displayOptions.find((o) => o.value === this.displayMode())?.icon ?? "@tui.image"
  );

  protected toggleDisplay(): void {
    this.displayOpen.update((open) => !open);
  }

  protected selectDisplay(value: string): void {
    this.displayMode.set(value as DisplayMode);
    this.displayOpen.set(false);
  }

  protected onDisplayObscured(obscured: boolean): void {
    if (obscured) this.displayOpen.set(false);
  }

  protected onDisplayActiveZone(active: boolean): void {
    if (!active) this.displayOpen.set(false);
  }

  protected readonly actionOptions: DropdownOption[] = [
    { value: "link", label: "Link", description: "Open a URL in the browser", icon: "@tui.link" },
    { value: "app", label: "Application", description: "Launch a desktop application", icon: "@tui.app-window" },
    { value: "command", label: "Command", description: "Run a shell command", icon: "@tui.terminal" },
  ];

  protected readonly actionOpen = signal(false);
  protected readonly actionLabel = computed(() =>
    this.actionOptions.find((o) => o.value === this.actionType())?.label ?? "Link"
  );
  protected readonly actionIcon = computed(() =>
    this.actionOptions.find((o) => o.value === this.actionType())?.icon ?? "@tui.link"
  );

  protected toggleAction(): void {
    this.actionOpen.update((open) => !open);
  }

  protected selectAction(value: string): void {
    this.actionType.set(value as ActionType);
    this.actionOpen.set(false);
  }

  protected readonly actionValueLabel = computed(() => {
    const labels: Record<string, string> = {
      link: "URL",
      app: "Application name",
      command: "Command",
    };
    return labels[this.actionType()] ?? "Value";
  });

  protected readonly actionValuePlaceholder = computed(() => {
    const placeholders: Record<string, string> = {
      link: "https://example.com",
      app: "Ex: calculator, terminal",
      command: "Ex: echo hello",
    };
    return placeholders[this.actionType()] ?? "";
  });

  protected onActionObscured(obscured: boolean): void {
    if (obscured) this.actionOpen.set(false);
  }

  protected onActionActiveZone(active: boolean): void {
    if (!active) this.actionOpen.set(false);
  }

  // 👁️ Preview
  protected readonly showIcon = computed(() =>
    this.displayMode() !== 'text'
  );

  protected readonly showLabel = computed(() =>
    this.displayMode() !== 'icon' && !!this.label
  );

  protected readonly fallbackIcon = computed(() => {
    const fallbackMap: Record<string, string> = {
      link: '@tui.link',
      app: '@tui.app-window',
      command: '@tui.terminal',
    };
    return fallbackMap[this.actionType()] ?? '';
  });

  protected readonly previewIcon = computed(() => {
    if (this.icon()) return '@tui.' + this.icon();
    return this.fallbackIcon();
  });

  // 🔍 App validation (which)
  private readonly buttonService = inject(ButtonService);
  private validateTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly appStatus = signal<'idle' | 'checking' | 'valid' | 'invalid'>('idle');

  protected onActionValueChange(value: string): void {
    this.actionValue = value;
    this.validateAppDelayed();
  }

  private validateAppDelayed(): void {
    if (this.validateTimer) clearTimeout(this.validateTimer);
    this.appStatus.set('idle');

    if (this.actionType() !== 'app' || !this.actionValue) return;

    this.appStatus.set('checking');
    this.validateTimer = setTimeout(async () => {
      try {
        const found = await this.buttonService.validateApp(this.actionValue);
        this.appStatus.set(found ? 'valid' : 'invalid');
      } catch {
        this.appStatus.set('idle');
      }
    }, 500);
  }

  // ✅ Validation
  protected readonly submitted = signal(false);

  protected get nameError(): string {
    return this.submitted() && !this.label ? 'Name is required' : '';
  }

  protected get actionValueError(): string {
    if (!this.submitted()) return '';
    if (!this.actionValue) return `${this.actionValueLabel()} is required`;
    if (this.actionType() === 'link' && !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(this.actionValue)) {
      return 'URL must include a protocol (e.g. https://example.com)';
    }
    return '';
  }

  protected get hasErrors(): boolean {
    if (!this.label) return true;
    if (!this.actionValue) return true;
    if (this.actionType() === 'link' && !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(this.actionValue)) {
      return true;
    }
    return false;
  }

  // 🪟 Titlebar
  protected close(): void {
    this.cancel.emit();
  }

  // 💾 Save
  protected async onSave(): Promise<void> {
    this.submitted.set(true);

    if (this.hasErrors) return;

    const data: ButtonData = {
      label: this.label || null,
      icon: this.icon() || null,
      display_mode: this.displayMode(),
      action_type: this.actionType(),
      action_value: this.actionValue || null,
      background_color: this.backgroundColor || null,
    };

    this.save.emit(data);
  }

  protected onCancel(): void {
    this.cancel.emit();
  }


}
