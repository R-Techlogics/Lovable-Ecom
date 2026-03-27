import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { User } from './pages/user/user';
import { Products } from './pages/products/products';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'users', component: User },
  { path: 'products', component: Products },
  { path: '**', redirectTo: '/login' }
];
