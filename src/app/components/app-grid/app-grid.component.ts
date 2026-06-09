import { Component, inject, OnInit } from '@angular/core';
import { AppRegistryService } from '../../services/app-registry.service';
import { AppCardComponent } from '../app-card/app-card.component';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [AppCardComponent],
  templateUrl: './app-grid.component.html',
  styleUrl: './app-grid.component.css',
})
export class AppGridComponent implements OnInit {
  protected readonly appRegistry = inject(AppRegistryService);

  ngOnInit(): void {
    this.appRegistry.loadApps();
  }
}
