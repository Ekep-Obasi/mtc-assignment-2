import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestService } from '../../core/services/request.service';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-create-request',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Create Service Request</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Title</label>
          <input type="text" formControlName="title" class="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea formControlName="description" rows="4" class="w-full border rounded px-3 py-2"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Category</label>
          <select formControlName="categoryId" class="w-full border rounded px-3 py-2">
            <option value="">Select Category</option>
            @for (cat of categories; track cat._id) {
              <option [value]="cat._id">{{ cat.name }}</option>
            }
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Location</label>
          <input type="text" formControlName="location" class="w-full border rounded px-3 py-2" />
        </div>

        @if (error) {
          <p class="text-red-600 text-sm">{{ error }}</p>
        }

        <button type="submit" [disabled]="form.invalid"
                class="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          Create Request
        </button>
      </form>
    </div>
  `
})
export class CreateRequest implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private requestService = inject(RequestService);
  private categoryService = inject(CategoryService);

  categories: Category[] = [];
  error = '';

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    categoryId: ['', [Validators.required]],
    location: ['', [Validators.required, Validators.minLength(2)]]
  });

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((cats) => this.categories = cats);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.error = '';

    this.requestService.createRequest(this.form.value as any).subscribe({
      next: (req) => this.router.navigate(['/requests', req._id]),
      error: (err) => this.error = err.error?.message || 'Failed to create request'
    });
  }
}
