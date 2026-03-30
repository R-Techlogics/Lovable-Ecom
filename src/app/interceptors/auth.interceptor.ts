import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Clone the request and add authorization header if token exists
  const token = authService.getToken();
  let authReq = req;
  
  console.log('Interceptor - Request URL:', req.url);
  console.log('Interceptor - Token exists:', !!token);
  console.log('Interceptor - Token value:', token ? token.substring(0, 20) + '...' : 'null');
  
  if (token && !req.url.includes('/Auth/login')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.log('Interceptor - No token or login request, skipping auth header');
  }

  // Handle the request and catch errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', error);
      console.error('HTTP Error Status:', error.status);
      console.error('HTTP Error Message:', error.message);
      
      // Handle different error status codes
      if (error.status === 401) {
        // Unauthorized - token expired or invalid
        console.warn('Unauthorized access - redirecting to login');
        authService.logout();
        router.navigate(['/login']);
      } else if (error.status === 403) {
        // Forbidden - user doesn't have permission
        console.warn('Forbidden access');
        alert('You do not have permission to access this resource.');
      } else if (error.status === 0) {
        // Network error or CORS issue
        console.error('Network error or server is unreachable');
      }
      
      // Re-throw the error so components can still handle it if needed
      return throwError(() => error);
    })
  );
};
