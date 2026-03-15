import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-request',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div style="max-width:600px; margin:20px auto;">
      <h2>Create Request</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display:flex; flex-direction:column; gap:10px;">
        <input type="text" formControlName="title" placeholder="Title" />
        <textarea formControlName="description" rows="5" placeholder="Description"></textarea>

        <select formControlName="category">
          <option value="">Select Category</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Electrical">Electrical</option>
          <option value="Cleaning">Cleaning</option>
        </select>

        <input type="text" formControlName="location" placeholder="Location" />

        <button type="submit">Create Request</button>
      </form>

      @if (message) {
        <p style="color:green;">{{ message }}</p>
      }
    </div>
  `
})
export class CreateRequest {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  message = '';

  form = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
    location: ['', [Validators.required]]
  });

  onSubmit(): void {
    this.message = 'Request created successfully';
    setTimeout(() => {
      this.router.navigate(['/requests']);
    }, 800);
  }
}