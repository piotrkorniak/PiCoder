import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let localStorageStore: Record<string, string>;
  let localStorageAvailable: boolean;
  let matchMediaResult: boolean;

  beforeEach(() => {
    localStorageStore = {};
    localStorageAvailable = true;
    matchMediaResult = false;

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
      if (!localStorageAvailable) {
        throw new Error('localStorage is not available');
      }
      return localStorageStore[key] ?? null;
    });

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
      if (!localStorageAvailable) {
        throw new Error('localStorage is not available');
      }
      localStorageStore[key] = value;
    });

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' ? matchMediaResult : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    document.body.classList.remove('theme-light', 'theme-dark');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.classList.remove('theme-light', 'theme-dark');
  });

  function createService(): ThemeService {
    TestBed.configureTestingModule({});
    return TestBed.inject(ThemeService);
  }

  describe('initialization from localStorage', () => {
    it('should use "light" theme when localStorage has "light"', () => {
      localStorageStore['picoder-theme'] = 'light';

      const service = createService();

      expect(service.currentTheme()).toBe('light');
      expect(document.body.classList.contains('theme-light')).toBe(true);
    });

    it('should use "dark" theme when localStorage has "dark"', () => {
      localStorageStore['picoder-theme'] = 'dark';

      const service = createService();

      expect(service.currentTheme()).toBe('dark');
      expect(document.body.classList.contains('theme-dark')).toBe(true);
    });

    it('should ignore invalid localStorage values and fallback', () => {
      localStorageStore['picoder-theme'] = 'invalid-value';

      const service = createService();

      expect(service.currentTheme()).toBe('light');
    });
  });

  describe('fallback to prefers-color-scheme', () => {
    it('should use "dark" when system prefers dark and no localStorage value', () => {
      matchMediaResult = true;

      const service = createService();

      expect(service.currentTheme()).toBe('dark');
      expect(document.body.classList.contains('theme-dark')).toBe(true);
    });

    it('should use "light" when system prefers light and no localStorage value', () => {
      matchMediaResult = false;

      const service = createService();

      expect(service.currentTheme()).toBe('light');
      expect(document.body.classList.contains('theme-light')).toBe(true);
    });

    it('should prioritize localStorage over system preference', () => {
      localStorageStore['picoder-theme'] = 'light';
      matchMediaResult = true;

      const service = createService();

      expect(service.currentTheme()).toBe('light');
    });
  });

  describe('toggleTheme() and persistence', () => {
    it('should toggle from light to dark', () => {
      const service = createService();
      expect(service.currentTheme()).toBe('light');

      service.toggleTheme();

      expect(service.currentTheme()).toBe('dark');
      expect(document.body.classList.contains('theme-dark')).toBe(true);
      expect(document.body.classList.contains('theme-light')).toBe(false);
    });

    it('should toggle from dark to light', () => {
      localStorageStore['picoder-theme'] = 'dark';

      const service = createService();
      expect(service.currentTheme()).toBe('dark');

      service.toggleTheme();

      expect(service.currentTheme()).toBe('light');
      expect(document.body.classList.contains('theme-light')).toBe(true);
      expect(document.body.classList.contains('theme-dark')).toBe(false);
    });

    it('should persist theme to localStorage on toggle', () => {
      const service = createService();

      service.toggleTheme();

      expect(localStorageStore['picoder-theme']).toBe('dark');
    });

    it('should persist correctly after multiple toggles', () => {
      const service = createService();

      service.toggleTheme();
      expect(localStorageStore['picoder-theme']).toBe('dark');

      service.toggleTheme();
      expect(localStorageStore['picoder-theme']).toBe('light');
    });
  });

  describe('localStorage unavailable', () => {
    it('should default to system preference when localStorage throws', () => {
      localStorageAvailable = false;
      matchMediaResult = true;

      const service = createService();

      expect(service.currentTheme()).toBe('dark');
    });

    it('should default to light when localStorage throws and system has no dark preference', () => {
      localStorageAvailable = false;
      matchMediaResult = false;

      const service = createService();

      expect(service.currentTheme()).toBe('light');
    });

    it('should still allow toggling when localStorage is unavailable', () => {
      localStorageAvailable = false;

      const service = createService();
      expect(service.currentTheme()).toBe('light');

      service.toggleTheme();

      expect(service.currentTheme()).toBe('dark');
      expect(document.body.classList.contains('theme-dark')).toBe(true);
    });

    it('should not throw when persisting fails due to unavailable localStorage', () => {
      const service = createService();
      localStorageAvailable = false;

      expect(() => service.toggleTheme()).not.toThrow();
      expect(service.currentTheme()).toBe('dark');
    });
  });
});
