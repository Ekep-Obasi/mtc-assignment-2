import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-md mx-auto mt-12">
      <h2 class="text-2xl font-bold mb-6">Login</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input type="email" formControlName="email" class="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Password</label>
          <input type="password" formControlName="password" class="w-full border rounded px-3 py-2" />
        </div>

        @if (error) {
          <p class="text-red-600 text-sm">{{ error }}</p>
        }

        <button type="submit" [disabled]="form.invalid" class="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          Login
        </button>
      </form>

      <p class="mt-4 text-sm text-gray-600">
        Don't have an account? <a routerLink="/register" class="text-blue-600 hover:underline">Register</a>
      </p>
    </div>
  `
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.error = 'Please fill in all fields correctly';
      return;
    }
    this.error = '';

    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () => this.router.navigate(['/requests']),
      error: (err) => this.error = err.error?.message || 'Invalid email or password'
    });
  }
}
