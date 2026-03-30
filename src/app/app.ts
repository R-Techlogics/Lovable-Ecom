import { Component, inject, effect } from '@angular/core';
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

  constructor() {
    // Using effect to track authentication changes in zoneless mode
    effect(() => {
      const isAuth = this.authService.isAuthenticated();
      const user = this.authService.currentUser();
      console.log('Auth state changed:', { isAuth, user });
    });
  }

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
