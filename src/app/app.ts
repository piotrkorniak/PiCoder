import { Component, inject } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { AppGridComponent } from './components/app-grid/app-grid.component';
import { FooterComponent } from './components/footer/footer.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, AppGridComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly themeService = inject(ThemeService);
}
