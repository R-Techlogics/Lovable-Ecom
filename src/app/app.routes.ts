import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { User } from './pages/user/user';
import { Products } from './pages/products/products';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'users', component: User, canActivate: [authGuard] },
  { path: 'products', component: Products, canActivate: [authGuard] },
  { path: '**', redirectTo: '/dashboard' }
];
