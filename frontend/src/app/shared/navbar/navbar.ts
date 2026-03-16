import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="flex items-center gap-4 px-6 py-3 bg-gray-800 text-white text-sm">
      <a routerLink="/requests" routerLinkActive="text-blue-400 font-semibold" class="hover:text-blue-300">Requests</a>

      @if (auth.getCurrentUser()?.role === 'resident') {
        <a routerLink="/requests/create" routerLinkActive="text-blue-400 font-semibold" class="hover:text-blue-300">Create Request</a>
      }

      @if (auth.getCurrentUser()?.role === 'provider') {
        <a routerLink="/my-quotes" routerLinkActive="text-blue-400 font-semibold" class="hover:text-blue-300">My Quotes</a>
      }

      <span class="ml-auto flex items-center gap-3">
        @if (auth.getCurrentUser(); as user) {
          <span class="text-gray-300">{{ user.fullName }} ({{ user.role }})</span>
          <button (click)="logout()" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs">Logout</button>
        } @else {
          <a routerLink="/login" routerLinkActive="text-blue-400" class="hover:text-blue-300">Login</a>
          <a routerLink="/register" routerLinkActive="text-blue-400" class="hover:text-blue-300">Register</a>
        }
      </span>
    </nav>
  `
})
export class Navbar {
  auth = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
