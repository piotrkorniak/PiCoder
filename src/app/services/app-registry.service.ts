import { computed, Injectable, signal } from '@angular/core';
import { AppEntry } from '../models/app-entry.model';

@Injectable({ providedIn: 'root' })
export class AppRegistryService {
  private readonly apps = signal<AppEntry[]>([]);

  readonly validApps = computed(() => this.filterValidApps(this.apps()));
  readonly isEmpty = computed(() => this.validApps().length === 0);

  async loadApps(): Promise<void> {
    try {
      const response = await fetch('assets/apps.json');
      if (!response.ok) {
        this.apps.set([]);
        return;
      }
      const data: unknown = await response.json();
      if (Array.isArray(data)) {
        this.apps.set(data);
      } else {
        this.apps.set([]);
      }
    } catch {
      this.apps.set([]);
    }
  }

  private filterValidApps(entries: AppEntry[]): AppEntry[] {
    const seenIds = new Set<string>();
    const result: AppEntry[] = [];

    for (const entry of entries) {
      if (!this.isValidEntry(entry)) {
        continue;
      }

      if (seenIds.has(entry.id)) {
        continue;
      }

      seenIds.add(entry.id);
      result.push(entry);
    }

    return result;
  }

  private isValidEntry(entry: unknown): entry is AppEntry {
    if (entry === null || typeof entry !== 'object') {
      return false;
    }

    const obj = entry as Record<string, unknown>;

    return (
      typeof obj['id'] === 'string' &&
      obj['id'].trim().length > 0 &&
      typeof obj['name'] === 'string' &&
      obj['name'].trim().length > 0 &&
      typeof obj['url'] === 'string' &&
      obj['url'].trim().length > 0
    );
  }
}
