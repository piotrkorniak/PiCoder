import { Injectable, signal } from '@angular/core';
import { Theme } from '../models/theme.model';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'picoder-theme';

  readonly currentTheme = signal<Theme>(this.getInitialTheme());

  constructor() {
    this.applyThemeClass(this.currentTheme());
  }

  toggleTheme(): void {
    const newTheme: Theme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.currentTheme.set(newTheme);
    this.persistTheme(newTheme);
    this.applyThemeClass(newTheme);
  }

  private getInitialTheme(): Theme {
    const stored = this.readStoredTheme();
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  private readStoredTheme(): string | null {
    try {
      return localStorage.getItem(this.STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private persistTheme(theme: Theme): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch {
      // localStorage unavailable — theme works in-memory only
    }
  }

  private applyThemeClass(theme: Theme): void {
    if (typeof document === 'undefined') {
      return;
    }
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark');
    body.classList.add(`theme-${theme}`);
  }
}
