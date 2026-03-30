import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login implements OnInit {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };

  loading = signal<boolean>(false);
  error = signal<string>('');
  showPassword = signal<boolean>(false);

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private returnUrl: string = '/dashboard';

  ngOnInit() {
    // Get return URL from query params or default to dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.loading.set(false);
        
        // Navigate to the return URL or dashboard
        setTimeout(() => {
          this.router.navigate([this.returnUrl]);
        }, 100);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error.set(err.error?.message || 'Invalid email or password. Please try again.');
        this.loading.set(false);
      }
    });
  }

  validateForm(): boolean {
    if (!this.credentials.email.trim()) {
      this.error.set('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.credentials.email)) {
      this.error.set('Please enter a valid email address');
      return false;
    }

    if (!this.credentials.password) {
      this.error.set('Password is required');
      return false;
    }

    if (this.credentials.password.length < 6) {
      this.error.set('Password must be at least 6 characters');
      return false;
    }

    this.error.set('');
    return true;
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }
}
