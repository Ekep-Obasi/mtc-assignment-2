import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuoteService } from '../../core/services/quote.service';
import { Quote } from '../../models/quote.model';

@Component({
  selector: 'app-my-quotes',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2 class="text-2xl font-bold mb-4">My Quotes</h2>

    @if (quotes.length === 0) {
      <p class="text-gray-500">You haven't submitted any quotes yet.</p>
    }

    <div class="grid gap-4">
      @for (quote of quotes; track quote._id) {
        <div class="border rounded-lg p-4">
          <div class="flex justify-between items-center">
            <h3 class="font-semibold text-lg">{{ getRequestTitle(quote) }}</h3>
            <span class="text-xs px-2 py-1 rounded font-medium" [class]="statusClass(quote.status)">
              {{ quote.status }}
            </span>
          </div>
          <div class="flex gap-6 mt-2 text-sm text-gray-600">
            <span><strong>Price:</strong> \${{ quote.price }}</span>
            <span><strong>Days:</strong> {{ quote.daysToComplete }}</span>
          </div>
          <p class="text-gray-600 text-sm mt-1">{{ quote.message }}</p>
          @if (getRequestId(quote)) {
            <a [routerLink]="['/requests', getRequestId(quote)]"
               class="text-blue-600 text-sm hover:underline mt-2 inline-block">
              View Request &rarr;
            </a>
          }
        </div>
      }
    </div>
  `
})
export class MyQuotes implements OnInit {
  private quoteService = inject(QuoteService);
  quotes: Quote[] = [];

  ngOnInit(): void {
    this.quoteService.getMyQuotes().subscribe((q) => this.quotes = q);
  }

  getRequestTitle(quote: Quote): string {
    return typeof quote.requestId === 'object' ? quote.requestId.title : 'Request';
  }

  getRequestId(quote: Quote): string {
    return typeof quote.requestId === 'object' ? quote.requestId._id : (quote.requestId as string);
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  }
}
