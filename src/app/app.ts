import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  authService = inject(AuthService);
  router = inject(Router);

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  logout(): void {
    this.authService.logout();
  }
}
