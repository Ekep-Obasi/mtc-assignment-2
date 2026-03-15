import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div style="max-width:420px; margin:40px auto;">
      <h2>Register</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display:flex; flex-direction:column; gap:10px;">
        <input type="text" formControlName="fullName" placeholder="Full Name" />
        <input type="email" formControlName="email" placeholder="Email" />
        <input type="password" formControlName="password" placeholder="Password" />

        <select formControlName="role">
          <option value="resident">Resident</option>
          <option value="provider">Provider</option>
        </select>

        <button type="submit">Register</button>
      </form>

      @if (message) {
        <p style="color:green;">{{ message }}</p>
      }
    </div>
  `
})
export class Register {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  message = '';

  form = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    role: ['resident', [Validators.required]]
  });

  onSubmit(): void {
    this.message = 'Registered successfully';
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 800);
  }
}