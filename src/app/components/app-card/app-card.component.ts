import { Component, computed, input } from '@angular/core';
import { AppEntry, ResolvedAppStatus } from '../../models/app-entry.model';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './app-card.component.html',
  styleUrl: './app-card.component.css',
})
export class AppCardComponent {
  app = input.required<AppEntry>();

  resolvedStatus = computed<ResolvedAppStatus>(() => {
    const status = this.app().status;
    if (status === 'aktywna' || status === 'w budowie') return status;
    return 'nieznany';
  });

  isClickable = computed(() => this.resolvedStatus() === 'aktywna');

  statusColor = computed(() => {
    switch (this.resolvedStatus()) {
      case 'aktywna':
        return 'var(--color-status-active)';
      case 'w budowie':
        return 'var(--color-status-building)';
      default:
        return 'var(--color-status-unknown)';
    }
  });

  statusLabel = computed(() => {
    switch (this.resolvedStatus()) {
      case 'aktywna':
        return 'Aktywna';
      case 'w budowie':
        return 'W budowie';
      default:
        return 'Nieznany';
    }
  });

  readonly truncateName = computed(() => {
    const name = this.app().name;
    return name.length > 50 ? name.substring(0, 50) + '…' : name;
  });

  readonly truncateDesc = computed(() => {
    const desc = this.app().description;
    return desc.length > 150 ? desc.substring(0, 150) + '…' : desc;
  });
}
