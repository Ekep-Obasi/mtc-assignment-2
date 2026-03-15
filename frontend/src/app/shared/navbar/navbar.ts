import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav style="display:flex; gap:12px; padding:12px 16px; border-bottom:1px solid #ddd; margin-bottom:20px;">
      <a routerLink="/login" routerLinkActive="active">Login</a>
      <a routerLink="/register" routerLinkActive="active">Register</a>
      <a routerLink="/requests" routerLinkActive="active">Requests</a>
      <a routerLink="/requests/create" routerLinkActive="active">Create Request</a>
      <a routerLink="/my-quotes" routerLinkActive="active">My Quotes</a>
    </nav>
  `
})
export class Navbar {}