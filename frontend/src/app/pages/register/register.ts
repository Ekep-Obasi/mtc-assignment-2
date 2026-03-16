import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-md mx-auto mt-12">
      <h2 class="text-2xl font-bold mb-6">Register</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Full Name</label>
          <input type="text" formControlName="fullName" class="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input type="email" formControlName="email" class="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Password</label>
          <input type="password" formControlName="password" class="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Role</label>
          <select formControlName="role" class="w-full border rounded px-3 py-2">
            <option value="resident">Resident</option>
            <option value="provider">Provider</option>
          </select>
        </div>

        @if (error) {
          <p class="text-red-600 text-sm">{{ error }}</p>
        }
        @if (success) {
          <p class="text-green-600 text-sm">{{ success }}</p>
        }

        <button type="submit" [disabled]="form.invalid" class="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          Register
        </button>
      </form>

      <p class="mt-4 text-sm text-gray-600">
        Already have an account? <a routerLink="/login" class="text-blue-600 hover:underline">Login</a>
      </p>
    </div>
  `
})
export class Register {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  error = '';
  success = '';

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['resident' as const, [Validators.required]]
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.error = '';
    this.success = '';

    const val = this.form.value;
    this.auth.register({
      fullName: val.fullName!,
      email: val.email!,
      password: val.password!,
      role: val.role as 'resident' | 'provider'
    }).subscribe({
      next: () => {
        this.success = 'Registered successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err) => this.error = err.error?.message || 'Registration failed'
    });
  }
}
