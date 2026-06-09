import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService } from '../../services/theme.service';
import { signal } from '@angular/core';
import { Theme } from '../../models/theme.model';

describe('ThemeToggleComponent', () => {
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let mockThemeService: { currentTheme: ReturnType<typeof signal<Theme>>; toggleTheme: ReturnType<typeof vi.fn> };

  function setup(initialTheme: Theme = 'light') {
    mockThemeService = {
      currentTheme: signal<Theme>(initialTheme),
      toggleTheme: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ThemeToggleComponent],
      providers: [{ provide: ThemeService, useValue: mockThemeService }],
    });

    fixture = TestBed.createComponent(ThemeToggleComponent);
    fixture.detectChanges();
  }

  describe('icon display', () => {
    it('should show moon icon (🌙) when theme is light', () => {
      setup('light');

      const icon = fixture.nativeElement.querySelector('.icon');
      expect(icon.textContent.trim()).toBe('🌙');
    });

    it('should show sun icon (☀️) when theme is dark', () => {
      setup('dark');

      const icon = fixture.nativeElement.querySelector('.icon');
      expect(icon.textContent.trim()).toBe('☀️');
    });
  });

  describe('ARIA attributes', () => {
    it('should have role="switch" on the button', () => {
      setup('light');

      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('role')).toBe('switch');
    });

    it('should have aria-checked="false" when theme is light', () => {
      setup('light');

      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-checked')).toBe('false');
    });

    it('should have aria-checked="true" when theme is dark', () => {
      setup('dark');

      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-checked')).toBe('true');
    });

    it('should have aria-label="Przełącz motyw"', () => {
      setup('light');

      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-label')).toBe('Przełącz motyw');
    });
  });

  describe('toggle interaction', () => {
    it('should call themeService.toggleTheme() when button is clicked', () => {
      setup('light');

      const button = fixture.nativeElement.querySelector('button');
      button.click();

      expect(mockThemeService.toggleTheme).toHaveBeenCalledTimes(1);
    });
  });

  describe('focusability', () => {
    it('should render a focusable button element', () => {
      setup('light');

      const button = fixture.nativeElement.querySelector('button');
      expect(button).toBeTruthy();
      expect(button.tabIndex).toBeGreaterThanOrEqual(0);
    });
  });
});
