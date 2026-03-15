import { Routes } from '@angular/router';
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
  { path: 'requests', component: RequestsList },
  { path: 'requests/create', component: CreateRequest },
  { path: 'requests/:id', component: RequestDetails },
  { path: 'my-quotes', component: MyQuotes }
];