import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
})
export class ThemeToggleComponent {
  readonly themeService = inject(ThemeService);
  readonly isDark = computed(() => this.themeService.currentTheme() === 'dark');
}
