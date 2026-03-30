import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
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
    this.initializeAuthState();
    console.log('AuthService: Initialization complete');
  }

  private initializeAuthState(): void {
    const token = this.getToken();
    const user = this.getUser();
    
    console.log('Initializing auth state:', { hasToken: !!token, hasUser: !!user });
    
    if (token && user) {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      console.log('User authenticated from storage:', user);
    } else {
      // Clear any partial/invalid data
      this.clearStorage();
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
      console.log('No valid authentication found');
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/Auth/login`, credentials).pipe(
      tap(response => {
        this.setSession(response);
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  private setSession(authResult: AuthResponse): void {
    console.log('=== Setting session ===');
    
    // Check if response is successful and has data
    if (!authResult.success || !authResult.data) {
      console.error('Invalid auth response:', authResult);
      throw new Error(authResult.message || 'Login failed');
    }
    
    const { token, user } = authResult.data;
    
    console.log('User:', user);
    console.log('Token (first 30 chars):', token?.substring(0, 30) + '...');
    console.log('Token length:', token?.length);
    
    if (!token || !user) {
      console.error('Missing token or user in response data');
      throw new Error('Invalid authentication data');
    }
    
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    
    // Verify it was saved
    const savedToken = localStorage.getItem(this.tokenKey);
    const savedUser = localStorage.getItem(this.userKey);
    console.log('Token saved successfully:', !!savedToken);
    console.log('User saved successfully:', !!savedUser);
    console.log('Saved token matches:', savedToken === token);
    
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    console.log('Session set successfully, isAuthenticated:', this.isAuthenticated());
    console.log('=== Session setup complete ===');
  }

  logout(): void {
    console.log('Logging out user');
    this.clearStorage();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  private clearStorage(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('AuthService.getToken() called');
    console.log('Token key:', this.tokenKey);
    console.log('Token from storage:', token ? token.substring(0, 20) + '...' : 'null');
    console.log('Token is valid:', !!(token && token !== 'null' && token !== 'undefined'));
    return token && token !== 'null' && token !== 'undefined' ? token : null;
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

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}
