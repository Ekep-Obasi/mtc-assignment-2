import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../../core/services/request.service';
import { CategoryService } from '../../core/services/category.service';
import { AuthService } from '../../core/services/auth.service';
import { ServiceRequest } from '../../models/service-request.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-requests-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <h2 class="text-2xl font-bold mb-4">Service Requests</h2>

    <!-- filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <select [(ngModel)]="filterStatus" (change)="loadRequests()" class="border rounded px-3 py-2 text-sm">
        <option value="">All Statuses</option>
        <option value="open">Open</option>
        <option value="quoted">Quoted</option>
        <option value="assigned">Assigned</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <select [(ngModel)]="filterCategory" (change)="loadRequests()" class="border rounded px-3 py-2 text-sm">
        <option value="">All Categories</option>
        @for (cat of categories; track cat._id) {
          <option [value]="cat._id">{{ cat.name }}</option>
        }
      </select>

      <input [(ngModel)]="filterKeyword" (keyup.enter)="loadRequests()" placeholder="Search keywords..."
             class="border rounded px-3 py-2 text-sm flex-1 min-w-[200px]" />
      <button (click)="loadRequests()" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Search</button>
    </div>

    @if (requests.length === 0) {
      <p class="text-gray-500">No requests found.</p>
    }

    <div class="grid gap-4">
      @for (req of requests; track req._id) {
        <a [routerLink]="['/requests', req._id]"
           class="block border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-semibold">{{ req.title }}</h3>
            <span class="text-xs px-2 py-1 rounded font-medium"
                  [class]="statusClass(req.status)">{{ req.status }}</span>
          </div>
          <p class="text-gray-600 text-sm mt-1 line-clamp-2">{{ req.description }}</p>
          <div class="flex gap-4 mt-2 text-xs text-gray-500">
            <span>{{ getCategoryName(req) }}</span>
            <span>{{ req.location }}</span>
          </div>
        </a>
      }
    </div>
  `
})
export class RequestsList implements OnInit {
  private requestService = inject(RequestService);
  private categoryService = inject(CategoryService);
  auth = inject(AuthService);

  requests: ServiceRequest[] = [];
  categories: Category[] = [];
  filterStatus = '';
  filterCategory = '';
  filterKeyword = '';

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((cats) => this.categories = cats);
    this.loadRequests();
  }

  loadRequests(): void {
    const filters: any = {};
    if (this.filterStatus) filters.status = this.filterStatus;
    if (this.filterCategory) filters.categoryId = this.filterCategory;
    if (this.filterKeyword.trim()) filters.q = this.filterKeyword.trim();

    this.requestService.getRequests(filters).subscribe((data) => this.requests = data);
  }

  getCategoryName(req: ServiceRequest): string {
    if (typeof req.categoryId === 'object' && req.categoryId) return req.categoryId.name;
    return '';
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      open: 'bg-green-100 text-green-800',
      quoted: 'bg-blue-100 text-blue-800',
      assigned: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  }
}
