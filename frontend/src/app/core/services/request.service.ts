import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceRequest } from '../../models/service-request.model';
import { environment } from '../../environment';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/requests`;

  getRequests(filters?: { status?: string; categoryId?: string; q?: string }): Observable<ServiceRequest[]> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.categoryId) params = params.set('categoryId', filters.categoryId);
    if (filters?.q) params = params.set('q', filters.q);
    return this.http.get<ServiceRequest[]>(this.url, { params });
  }

  getRequestById(id: string): Observable<ServiceRequest> {
    return this.http.get<ServiceRequest>(`${this.url}/${id}`);
  }

  createRequest(data: { title: string; description: string; categoryId: string; location: string }): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(this.url, data);
  }

  updateStatus(id: string, status: string): Observable<ServiceRequest> {
    return this.http.patch<ServiceRequest>(`${this.url}/${id}/status`, { status });
  }
}
