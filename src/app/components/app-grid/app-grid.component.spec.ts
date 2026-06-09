import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppGridComponent } from './app-grid.component';
import { AppRegistryService } from '../../services/app-registry.service';
import { signal, computed } from '@angular/core';
import { AppEntry } from '../../models/app-entry.model';

describe('AppGridComponent', () => {
  let fixture: ComponentFixture<AppGridComponent>;
  let mockApps: ReturnType<typeof signal<AppEntry[]>>;
  let mockAppRegistry: {
    validApps: ReturnType<typeof computed>;
    isEmpty: ReturnType<typeof computed>;
    loadApps: ReturnType<typeof vi.fn>;
  };

  function setup(apps: AppEntry[] = []) {
    mockApps = signal<AppEntry[]>(apps);

    mockAppRegistry = {
      validApps: computed(() => mockApps()),
      isEmpty: computed(() => mockApps().length === 0),
      loadApps: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [AppGridComponent],
      providers: [{ provide: AppRegistryService, useValue: mockAppRegistry }],
    });

    fixture = TestBed.createComponent(AppGridComponent);
    fixture.detectChanges();
  }

  const sampleApps: AppEntry[] = [
    {
      id: 'app1',
      name: 'App One',
      description: 'First app',
      url: 'https://app1.picoder.top',
      icon: 'assets/icons/app1.svg',
      status: 'aktywna',
    },
    {
      id: 'app2',
      name: 'App Two',
      description: 'Second app',
      url: 'https://app2.picoder.top',
      icon: 'assets/icons/app2.svg',
      status: 'w budowie',
    },
  ];

  describe('loading', () => {
    it('should call loadApps on initialization', () => {
      setup([]);

      expect(mockAppRegistry.loadApps).toHaveBeenCalledTimes(1);
    });
  });

  describe('cards rendering', () => {
    it('should render app-card for each valid app', () => {
      setup(sampleApps);

      const cards = fixture.nativeElement.querySelectorAll('app-card');
      expect(cards.length).toBe(2);
    });

    it('should render cards inside the grid container', () => {
      setup(sampleApps);

      const grid = fixture.nativeElement.querySelector('.app-grid');
      expect(grid).toBeTruthy();
      const cards = grid.querySelectorAll('app-card');
      expect(cards.length).toBe(2);
    });
  });

  describe('empty state', () => {
    it('should display empty message when registry is empty', () => {
      setup([]);

      const emptyEl = fixture.nativeElement.querySelector('.app-grid__empty');
      expect(emptyEl).toBeTruthy();
      expect(emptyEl.textContent).toContain('Brak zdefiniowanych aplikacji');
    });

    it('should not render grid container when registry is empty', () => {
      setup([]);

      const grid = fixture.nativeElement.querySelector('.app-grid');
      expect(grid).toBeNull();
    });

    it('should not display empty message when apps exist', () => {
      setup(sampleApps);

      const emptyEl = fixture.nativeElement.querySelector('.app-grid__empty');
      expect(emptyEl).toBeNull();
    });
  });
});
