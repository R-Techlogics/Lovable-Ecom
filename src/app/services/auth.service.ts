import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, AuthResponse, UserDto } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:44332/api';
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  
  currentUser = signal<UserDto | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    console.log('AuthService: Constructor called');
    this.checkAuthStatus();
    console.log('AuthService: Initialization complete');
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/Auth/login`, credentials).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem(this.tokenKey, authResult.token);
    localStorage.setItem(this.userKey, JSON.stringify(authResult.user));
    this.currentUser.set(authResult.user);
    this.isAuthenticated.set(true);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): UserDto | null {
    const userStr = localStorage.getItem(this.userKey);
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    const user = this.getUser();
    
    if (token && user) {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    }
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}
