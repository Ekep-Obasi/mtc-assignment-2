import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quote } from '../../models/quote.model';
import { environment } from '../../environment';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getQuotesForRequest(requestId: string): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${this.baseUrl}/requests/${requestId}/quotes`);
  }

  createQuote(requestId: string, data: { price: number; message: string; daysToComplete: number }): Observable<Quote> {
    return this.http.post<Quote>(`${this.baseUrl}/requests/${requestId}/quotes`, data);
  }

  acceptQuote(quoteId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/quotes/${quoteId}/accept`, {});
  }

  getMyQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${this.baseUrl}/quotes/mine`);
  }
}
