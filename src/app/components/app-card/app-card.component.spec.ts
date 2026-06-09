import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { AppCardComponent } from './app-card.component';
import { AppEntry } from '../../models/app-entry.model';

@Component({
  standalone: true,
  imports: [AppCardComponent],
  template: `<app-card [app]="app" />`,
})
class TestHostComponent {
  app: AppEntry = {
    id: 'test-app',
    name: 'Test App',
    description: 'A test application description',
    url: 'https://test.picoder.top',
    icon: 'assets/icons/test.svg',
    status: 'aktywna',
  };
}

describe('AppCardComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let cardElement: HTMLElement;

  function setup(appOverrides: Partial<AppEntry> = {}) {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    Object.assign(hostComponent.app, appOverrides);
    hostFixture.detectChanges();
    cardElement = hostFixture.nativeElement.querySelector('app-card');
  }

  describe('status rendering', () => {
    it('should display "Aktywna" label with active status color for aktywna status', () => {
      setup({ status: 'aktywna' });

      const statusEl = cardElement.querySelector('.card__status') as HTMLElement;
      expect(statusEl.textContent?.trim()).toBe('Aktywna');
      expect(statusEl.style.backgroundColor).toBe('var(--color-status-active)');
    });

    it('should display "W budowie" label with building status color for w budowie status', () => {
      setup({ status: 'w budowie' });

      const statusEl = cardElement.querySelector('.card__status') as HTMLElement;
      expect(statusEl.textContent?.trim()).toBe('W budowie');
      expect(statusEl.style.backgroundColor).toBe('var(--color-status-building)');
    });

    it('should display "Nieznany" label with unknown status color for unknown status', () => {
      setup({ status: 'invalid-status' as never });

      const statusEl = cardElement.querySelector('.card__status') as HTMLElement;
      expect(statusEl.textContent?.trim()).toBe('Nieznany');
      expect(statusEl.style.backgroundColor).toBe('var(--color-status-unknown)');
    });
  });

  describe('active card link', () => {
    it('should render an active link for aktywna status', () => {
      setup({ status: 'aktywna' });

      const link = cardElement.querySelector('a.card__link') as HTMLAnchorElement;
      expect(link).toBeTruthy();
      expect(link.href).toBe('https://test.picoder.top/');
      expect(link.target).toBe('_blank');
      expect(link.rel).toContain('noopener');
    });

    it('should have proper aria-label on active link', () => {
      setup({ name: 'DroneMesh3D', status: 'aktywna' });

      const link = cardElement.querySelector('a.card__link') as HTMLAnchorElement;
      expect(link.getAttribute('aria-label')).toContain('DroneMesh3D');
    });
  });

  describe('disabled card (non-aktywna)', () => {
    it('should render disabled span instead of link for w budowie status', () => {
      setup({ status: 'w budowie' });

      const link = cardElement.querySelector('a.card__link');
      const disabledSpan = cardElement.querySelector('.card__link--disabled');
      expect(link).toBeNull();
      expect(disabledSpan).toBeTruthy();
      expect(disabledSpan?.getAttribute('aria-disabled')).toBe('true');
    });

    it('should render disabled span for unknown status', () => {
      setup({ status: '' as never });

      const link = cardElement.querySelector('a.card__link');
      const disabledSpan = cardElement.querySelector('.card__link--disabled');
      expect(link).toBeNull();
      expect(disabledSpan).toBeTruthy();
    });

    it('should apply card--disabled class for non-aktywna status', () => {
      setup({ status: 'w budowie' });

      const card = cardElement.querySelector('.card');
      expect(card?.classList.contains('card--disabled')).toBe(true);
    });
  });

  describe('content display', () => {
    it('should display the app name', () => {
      setup({ name: 'MyApp' });

      const name = cardElement.querySelector('.card__name');
      expect(name?.textContent?.trim()).toBe('MyApp');
    });

    it('should truncate name longer than 50 characters', () => {
      const longName = 'A'.repeat(60);
      setup({ name: longName });

      const name = cardElement.querySelector('.card__name');
      expect(name?.textContent?.trim()).toBe('A'.repeat(50) + '…');
    });

    it('should display the app description', () => {
      setup({ description: 'Short desc' });

      const desc = cardElement.querySelector('.card__description');
      expect(desc?.textContent?.trim()).toBe('Short desc');
    });

    it('should truncate description longer than 150 characters', () => {
      const longDesc = 'B'.repeat(160);
      setup({ description: longDesc });

      const desc = cardElement.querySelector('.card__description');
      expect(desc?.textContent?.trim()).toBe('B'.repeat(150) + '…');
    });
  });
});
