import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { RequestsList } from './pages/requests-list/requests-list';
import { CreateRequest } from './pages/create-request/create-request';
import { RequestDetails } from './pages/request-details/request-details';
import { MyQuotes } from './pages/my-quotes/my-quotes';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'requests', component: RequestsList, canActivate: [authGuard] },
  { path: 'requests/create', component: CreateRequest, canActivate: [authGuard, roleGuard('resident')] },
  { path: 'requests/:id', component: RequestDetails, canActivate: [authGuard] },
  { path: 'my-quotes', component: MyQuotes, canActivate: [authGuard, roleGuard('provider')] }
];
