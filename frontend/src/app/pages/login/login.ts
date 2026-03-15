import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div style="max-width:420px; margin:40px auto;">
      <h2>Login</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display:flex; flex-direction:column; gap:10px;">
        <input type="email" formControlName="email" placeholder="Email" />
        <input type="password" formControlName="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>

      @if (error) {
        <p style="color:red;">{{ error }}</p>
      }
    </div>
  `
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  error = '';

  form = this.fb.group({
    email: ['resident@test.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required]]
  });

  onSubmit(): void {
    const email = this.form.value.email;
    const password = this.form.value.password;

    if (email === 'resident@test.com' && password === '123456') {
      this.router.navigate(['/requests']);
      return;
    }

    this.error = 'Invalid email or password';
  }
}