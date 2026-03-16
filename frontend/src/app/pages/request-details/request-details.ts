import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestService } from '../../core/services/request.service';
import { QuoteService } from '../../core/services/quote.service';
import { AuthService } from '../../core/services/auth.service';
import { ServiceRequest } from '../../models/service-request.model';
import { Quote } from '../../models/quote.model';

@Component({
  selector: 'app-request-details',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    @if (request) {
      <div class="max-w-3xl mx-auto">
        <a routerLink="/requests" class="text-blue-600 text-sm hover:underline">&larr; Back to requests</a>

        <div class="border rounded-lg p-6 mt-3 mb-6">
          <div class="flex justify-between items-start">
            <h2 class="text-2xl font-bold">{{ request.title }}</h2>
            <span class="text-xs px-2 py-1 rounded font-medium" [class]="statusClass(request.status)">
              {{ request.status }}
            </span>
          </div>
          <p class="text-gray-600 mt-2">{{ request.description }}</p>
          <div class="flex gap-6 mt-3 text-sm text-gray-500">
            <span><strong>Category:</strong> {{ getCategoryName() }}</span>
            <span><strong>Location:</strong> {{ request.location }}</span>
            <span><strong>By:</strong> {{ getCreatorName() }}</span>
          </div>

          <!-- resident status actions -->
          @if (isOwner() && request.status === 'assigned') {
            <button (click)="updateStatus('completed')"
                    class="mt-4 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
              Mark Completed
            </button>
          }
          @if (isOwner() && (request.status === 'open' || request.status === 'quoted')) {
            <button (click)="updateStatus('cancelled')"
                    class="mt-4 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 ml-2">
              Cancel Request
            </button>
          }
        </div>

        <!-- quotes section -->
        <h3 class="text-xl font-semibold mb-3">Quotes ({{ quotes.length }})</h3>

        @if (quotes.length === 0) {
          <p class="text-gray-500 text-sm">No quotes yet.</p>
        }

        <div class="grid gap-3 mb-6">
          @for (quote of quotes; track quote._id) {
            <div class="border rounded-lg p-4" [class.border-green-500]="quote.status === 'accepted'"
                 [class.opacity-50]="quote.status === 'rejected'">
              <div class="flex justify-between items-center">
                <span class="font-semibold text-lg">\${{ quote.price }}</span>
                <span class="text-xs px-2 py-1 rounded" [class]="quoteStatusClass(quote.status)">
                  {{ quote.status }}
                </span>
              </div>
              <p class="text-gray-600 text-sm mt-1">{{ quote.message }}</p>
              <p class="text-gray-500 text-xs mt-1">{{ quote.daysToComplete }} day(s) to complete</p>
              @if (getProviderName(quote)) {
                <p class="text-gray-500 text-xs">Provider: {{ getProviderName(quote) }}</p>
              }

              @if (isOwner() && quote.status === 'pending' && !['completed', 'cancelled', 'assigned'].includes(request.status)) {
                <button (click)="acceptQuote(quote._id)"
                        class="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  Accept Quote
                </button>
              }
            </div>
          }
        </div>

        <!-- provider quote form -->
        @if (canSubmitQuote()) {
          <div class="border rounded-lg p-6 bg-gray-50">
            <h3 class="text-lg font-semibold mb-3">Submit a Quote</h3>
            <form [formGroup]="quoteForm" (ngSubmit)="submitQuote()" class="flex flex-col gap-3">
              <div>
                <label class="block text-sm font-medium mb-1">Price ($)</label>
                <input type="number" formControlName="price" min="1" class="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Message</label>
                <textarea formControlName="message" rows="3" class="w-full border rounded px-3 py-2"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Days to Complete</label>
                <input type="number" formControlName="daysToComplete" min="1" max="30" class="w-full border rounded px-3 py-2" />
              </div>

              @if (quoteError) {
                <p class="text-red-600 text-sm">{{ quoteError }}</p>
              }

              <button type="submit" [disabled]="quoteForm.invalid"
                      class="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                Submit Quote
              </button>
            </form>
          </div>
        }
      </div>
    } @else {
      <p class="text-gray-500">Loading request...</p>
    }
  `
})
export class RequestDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private requestService = inject(RequestService);
  private quoteService = inject(QuoteService);
  auth = inject(AuthService);

  request: ServiceRequest | null = null;
  quotes: Quote[] = [];
  quoteError = '';

  quoteForm = this.fb.group({
    price: [null as number | null, [Validators.required, Validators.min(1)]],
    message: ['', [Validators.required, Validators.minLength(5)]],
    daysToComplete: [null as number | null, [Validators.required, Validators.min(1), Validators.max(30)]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadRequest(id);
    this.loadQuotes(id);
  }

  loadRequest(id: string): void {
    this.requestService.getRequestById(id).subscribe((r) => this.request = r);
  }

  loadQuotes(id: string): void {
    this.quoteService.getQuotesForRequest(id).subscribe((q) => this.quotes = q);
  }

  isOwner(): boolean {
    if (!this.request) return false;
    const userId = this.auth.getCurrentUser()?._id;
    const createdBy = typeof this.request.createdBy === 'object'
      ? this.request.createdBy._id
      : this.request.createdBy;
    return userId === createdBy;
  }

  canSubmitQuote(): boolean {
    if (!this.request) return false;
    return this.auth.hasRole('provider') && ['open', 'quoted'].includes(this.request.status);
  }

  getCategoryName(): string {
    if (!this.request) return '';
    return typeof this.request.categoryId === 'object' ? this.request.categoryId.name : '';
  }

  getCreatorName(): string {
    if (!this.request) return '';
    return typeof this.request.createdBy === 'object' ? this.request.createdBy.fullName : '';
  }

  getProviderName(quote: Quote): string {
    return typeof quote.providerId === 'object' ? quote.providerId.fullName : '';
  }

  submitQuote(): void {
    if (this.quoteForm.invalid || !this.request) return;
    this.quoteError = '';

    this.quoteService.createQuote(this.request._id, this.quoteForm.value as any).subscribe({
      next: () => {
        this.quoteForm.reset();
        this.loadRequest(this.request!._id);
        this.loadQuotes(this.request!._id);
      },
      error: (err) => this.quoteError = err.error?.message || 'Failed to submit quote'
    });
  }

  acceptQuote(quoteId: string): void {
    this.quoteService.acceptQuote(quoteId).subscribe({
      next: () => {
        this.loadRequest(this.request!._id);
        this.loadQuotes(this.request!._id);
      },
      error: (err) => alert(err.error?.message || 'Failed to accept quote')
    });
  }

  updateStatus(status: string): void {
    if (!this.request) return;
    this.requestService.updateStatus(this.request._id, status).subscribe({
      next: (r) => this.request = r,
      error: (err) => alert(err.error?.message || 'Failed to update status')
    });
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

  quoteStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  }
}
