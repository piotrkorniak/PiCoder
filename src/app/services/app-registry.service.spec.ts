import { TestBed } from '@angular/core/testing';
import { AppRegistryService } from './app-registry.service';
import { AppEntry } from '../models/app-entry.model';

function createValidEntry(overrides: Partial<AppEntry> = {}): AppEntry {
  return {
    id: 'test-app',
    name: 'Test App',
    description: 'A test application',
    url: 'https://test.picoder.top',
    icon: 'assets/icons/test.svg',
    status: 'aktywna',
    ...overrides,
  };
}

function mockFetchSuccess(data: unknown): void {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  });
}

function mockFetchFailure(): void {
  globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
}

function mockFetchNotOk(): void {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: false,
    json: () => Promise.resolve(null),
  });
}

describe('AppRegistryService', () => {
  let service: AppRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppRegistryService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('loadApps - poprawne ładowanie danych', () => {
    it('should load valid entries correctly', async () => {
      const entries = [createValidEntry({ id: 'app1', name: 'App One' }), createValidEntry({ id: 'app2', name: 'App Two' })];
      mockFetchSuccess(entries);

      await service.loadApps();

      expect(service.validApps()).toHaveLength(2);
      expect(service.validApps()[0].id).toBe('app1');
      expect(service.validApps()[1].id).toBe('app2');
      expect(service.isEmpty()).toBe(false);
    });

    it('should preserve order from the JSON data', async () => {
      const entries = [createValidEntry({ id: 'z-app', name: 'Z App' }), createValidEntry({ id: 'a-app', name: 'A App' })];
      mockFetchSuccess(entries);

      await service.loadApps();

      expect(service.validApps()[0].id).toBe('z-app');
      expect(service.validApps()[1].id).toBe('a-app');
    });
  });

  describe('loadApps - walidacja wpisów', () => {
    it('should filter out entries without id', async () => {
      const entries = [{ name: 'No ID App', url: 'https://noid.picoder.top', description: 'desc', icon: 'icon', status: 'aktywna' }];
      mockFetchSuccess(entries);

      await service.loadApps();

      expect(service.validApps()).toHaveLength(0);
      expect(service.isEmpty()).toBe(true);
    });

    it('should filter out entries without name', async () => {
      const entries = [{ id: 'no-name', url: 'https://noname.picoder.top', description: 'desc', icon: 'icon', status: 'aktywna' }];
      mockFetchSuccess(entries);

      await service.loadApps();

      expect(service.validApps()).toHaveLength(0);
      expect(service.isEmpty()).toBe(true);
    });

    it('should filter out entries without url', async () => {
      const entries = [{ id: 'no-url', name: 'No URL App', description: 'desc', icon: 'icon', status: 'aktywna' }];
      mockFetchSuccess(entries);

      await service.loadApps();

      expect(service.validApps()).toHaveLength(0);
      expect(service.isEmpty()).toBe(true);
    });

    it('should filter out entries with empty string id', async () => {
      const entries = [createValidEntry({ id: '  ' })];
      mockFetchSuccess(entries);

      await service.loadApps();

      expect(service.validApps()).toHaveLength(0);
    });

    it('should keep valid entries and skip invalid ones', async () => {
      const entries = [createValidEntry({ id: 'valid', name: 'Valid App' }), { id: '', name: 'Invalid', url: 'https://x.picoder.top' }];
      mockFetchSuccess(entries);

      await service.loadApps();

      expect(service.validApps()).toHaveLength(1);
      expect(service.validApps()[0].id).toBe('valid');
    });
  });

  describe('loadApps - deduplikacja po id', () => {
    it('should keep only the first entry when duplicate ids exist', async () => {
      const entries = [createValidEntry({ id: 'dup', name: 'First' }), createValidEntry({ id: 'dup', name: 'Second' })];
      mockFetchSuccess(entries);

      await service.loadApps();

      expect(service.validApps()).toHaveLength(1);
      expect(service.validApps()[0].name).toBe('First');
    });

    it('should deduplicate across multiple duplicates', async () => {
      const entries = [
        createValidEntry({ id: 'a', name: 'A1' }),
        createValidEntry({ id: 'b', name: 'B1' }),
        createValidEntry({ id: 'a', name: 'A2' }),
        createValidEntry({ id: 'b', name: 'B2' }),
      ];
      mockFetchSuccess(entries);

      await service.loadApps();

      expect(service.validApps()).toHaveLength(2);
      expect(service.validApps()[0].name).toBe('A1');
      expect(service.validApps()[1].name).toBe('B1');
    });
  });

  describe('loadApps - pusty rejestr', () => {
    it('should set isEmpty to true when registry is empty array', async () => {
      mockFetchSuccess([]);

      await service.loadApps();

      expect(service.validApps()).toHaveLength(0);
      expect(service.isEmpty()).toBe(true);
    });

    it('should set isEmpty to true before loadApps is called', () => {
      expect(service.isEmpty()).toBe(true);
      expect(service.validApps()).toHaveLength(0);
    });
  });

  describe('loadApps - obsługa błędów', () => {
    it('should handle fetch network error gracefully', async () => {
      mockFetchFailure();

      await service.loadApps();

      expect(service.validApps()).toHaveLength(0);
      expect(service.isEmpty()).toBe(true);
    });

    it('should handle non-ok response gracefully', async () => {
      mockFetchNotOk();

      await service.loadApps();

      expect(service.validApps()).toHaveLength(0);
      expect(service.isEmpty()).toBe(true);
    });

    it('should handle non-array response gracefully', async () => {
      mockFetchSuccess({ not: 'an array' });

      await service.loadApps();

      expect(service.validApps()).toHaveLength(0);
      expect(service.isEmpty()).toBe(true);
    });
  });
});
